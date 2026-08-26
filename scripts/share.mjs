// Печатает адреса для игры с других устройств; при установленном cloudflared
// поднимает быстрый туннель и даёт публичную ссылку на время партии.
import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";

console.log("Эволюция — адреса для игры по сети (dev-сервер должен быть запущен):\n");

// Реальные локальные сети (192.168/10) впереди, виртуальные адаптеры — в конце.
const all = [];
for (const list of Object.values(networkInterfaces())) {
  for (const ni of list ?? []) {
    if (ni.family === "IPv4" && !ni.internal) all.push(ni.address);
  }
}
const score = (ip) =>
  ip.startsWith("192.168.") ? 0
  : ip.startsWith("10.") ? 1
  : ip.startsWith("172.") ? 2
  : 3; // 198.18.* и прочие VPN-диапазоны
const lan = all.sort((a, b) => score(a) - score(b));
for (const ip of lan) {
  const tag = score(ip) >= 3 ? "   (виртуальный/VPN-адаптер — скорее всего не он)" : "";
  console.log(`LAN:   http://${ip}:8099/${tag}`);
}
if (lan.length) {
  console.log("\nПодсказка: из домашнего Wi-Fi обычно работает адрес 192.168.*");
  console.log("Если телефон не открывает — разрешите Node.js во входящих Windows Firewall (или запустите dev один раз от администратора).");
}

// ── публичная ссылка через cloudflared quick tunnel ─────────────────────────

import { existsSync } from "node:fs";

function findCloudflared() {
  // Сначала известные пути установки (PATH процесса может быть старым),
  // в самом конце — надежда на PATH.
  const known = [
    "C:\\Program Files (x86)\\cloudflared\\cloudflared.exe",
    "C:\\Program Files\\cloudflared\\cloudflared.exe",
  ];
  for (const c of known) {
    if (existsSync(c)) return { bin: c, shell: false };
  }
  return { bin: "cloudflared", shell: process.platform === "win32" };
}

function runTunnel(args, onLine) {
  return new Promise((resolve) => {
    const { bin, shell } = findCloudflared();
    const cf = spawn(bin, args, {
      shell,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let url = null;
    let registered = false;
    const tail = [];
    const feed = (s) => {
      for (const line of String(s).split(/\r?\n/)) {
        if (!line.trim()) continue;
        tail.push(line);
        if (tail.length > 8) tail.shift();
        if (/Registered tunnel connection/.test(line)) registered = true;
        const m = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
        if (m && !url) url = m[0];
        onLine?.(line);
      }
    };
    cf.stdout?.on("data", (d) => feed(d));
    cf.stderr?.on("data", (d) => feed(d));
    cf.on("error", () => resolve({ url: null, tail: ["cloudflared не запускается"], cf: null }));
    const iv = setInterval(() => {
      // Ссылка печатается до установки соединения — ждём «Registered»,
      // иначе посетители получат ошибку 1033.
      if (url && registered) {
        clearInterval(iv);
        resolve({ url, tail, cf });
      }
    }, 300);
    setTimeout(() => {
      clearInterval(iv);
      if (!(url && registered)) resolve({ url: null, tail, cf });
    }, 30_000);
  });
}

async function tunnelUp(args) {
  const r = await runTunnel(args);
  if (r.url && r.cf) {
    console.log(`WEB:   ${r.url}   ← отправьте эту ссылку друзьям`);
    console.log("Туннель живёт, пока запущен этот скрипт. Ctrl+C — закрыть.");
    setInterval(() => {}, 1 << 30); // держим процесс (и туннель) живым
  }
  return r;
}

console.log("\nПробую поднять публичную ссылку (cloudflared quick tunnel)…");
console.log("Профиль для сетей, где режут QUIC и часть Cloudflare: region us + http2.");
const first = await tunnelUp(["tunnel", "--region", "us", "--protocol", "http2", "--url", "http://127.0.0.1:8099"]);
if (!first.url) {
  first.cf?.kill();
  const notInstalled = first.tail.some((l) =>
    /not recognized|не является внутренней|cannot find|не установлен/i.test(l),
  );
  if (notInstalled) {
    console.log("cloudflared не найден — публичной ссылки не будет.");
    console.log("Установить: winget install Cloudflare.cloudflared  (затем снова npm run share)");
    console.log("Игрокам в вашей Wi-Fi сети хватит LAN-адреса выше.");
    process.exit(0);
  }
  console.log("Этот профиль не поднялся. Хвост вывода cloudflared:");
  for (const l of first.tail) console.log(`  | ${l}`);
  console.log("\nПробую стандартный профиль (QUIC, оба региона)…");
  const second = await tunnelUp(["tunnel", "--url", "http://127.0.0.1:8099"]);
  if (!second.url) {
    second.cf?.kill();
    console.log("Не удалось. Хвост вывода:");
    for (const l of second.tail) console.log(`  | ${l}`);
    console.log("\nПохоже, провайдер блокирует edge Cloudflare. Варианты:");
    console.log("  • раздать мобильный хот-спот и повторить npm run share;");
    console.log("  • задеплоить приложение (README.md, раздел «Игра по сети») — тогда сервер не зависит от вашей сети.");
  }
}
