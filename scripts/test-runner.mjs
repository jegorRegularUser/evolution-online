import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
function discover(dir, suffix) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? discover(path, suffix) : entry.isFile() && entry.name.endsWith(suffix) ? [path] : [];
  }).sort();
}
// Explicit argv, no shell/globs: works from cmd.exe, PowerShell and POSIX.
// Separate groups still run after failures. External timeout also stops sync loops.
let failed = false;
for (const [dir, suffix] of [["scripts", ".test.mjs"], ["src", ".test.ts"]]) {
  const files = discover(join(root, dir), suffix);
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
