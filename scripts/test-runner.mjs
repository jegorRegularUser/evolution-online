import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
function discover(dir, suffix, recursive = true) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return recursive ? discover(path, suffix, recursive) : [];
      return entry.isFile() && entry.name.endsWith(suffix) ? [path] : [];
    })
    .sort();
}
// Explicit argv, no shell/globs: works from cmd.exe, PowerShell and POSIX.
// Separate groups still run after failures. External timeout also stops sync loops.
const platformTests = discover(join(root, "scripts", "platform"), ".test.mjs");
if (platformTests.length) {
  console.log(
    `[test-runner] platform tests excluded from the game gate: ${platformTests
      .map((f) => relative(root, f))
      .join(", ")}`,
  );
}
const productionFiles = [
  ...discover(join(root, "src"), ".ts"),
  ...discover(join(root, "src"), ".tsx"),
].filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"));
console.log(
  `[test-runner] coverage scope: ${productionFiles.length} production TS/TSX files under src/ ` +
    "(UI and store are included in the inventory, not executed by this gate); " +
    "no application-wide percentage is inferred from imported modules.",
);
let failed = false;
for (const [dir, suffix, recursive] of [
  ["scripts", ".test.mjs", false],
  ["src", ".test.ts", true],
]) {
  const files = discover(join(root, dir), suffix, recursive);
  console.log(`[test-runner] ${dir}: ${files.length} files\n${files.map((f) => relative(root, f)).join("\n")}`);
  if (!files.length) {
    console.error(`[test-runner] ERROR: no tests in ${dir}`);
    failed = true;
    continue;
  }
  const result = spawnSync(process.execPath, ["--experimental-strip-types", "--test", ...files], {
    cwd: root, stdio: "inherit", shell: false, timeout: 180_000,
  });
  if (result.error) console.error(result.error);
  if (result.status !== 0 || result.error) failed = true;
}
process.exitCode = failed ? 1 : 0;
