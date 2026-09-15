/**
 * Минимальное воспроизведение сообщения M6 («пытаюсь поменять животных
 * местами — пишет, что ход недоступен») на СЕТЕВОМ столе.
 *
 * Факты:
 *   - клиент включает перетаскивание только в свой ход
 *     (game-app: canReorder = isHumanTurn && фаза development/feeding);
 *   - сервер пропускает reorderAnimal отдельным гейтом isReorder
 *     (src/lib/net/server.ts): фаза development/feeding И currentPlayerId ===
 *     моё место И животное моё. Иначе действие сверяется с legal*Actions, где
 *     reorderAnimal нет, и сервер отвечает «Такой ход сейчас недопустим» —
 *     это и есть «ход недоступен» из жалобы.
 *
 * Проба шлёт netAction НАПРЯМУЮ (мимо стора): стор показывает ошибку тостом
 * и сразу её очищает, поэтому поймать текст через net.error нельзя. Печатает
 * машиночитаемый ответ сервера в двух состояниях: в фазе броска (ожидается
 * отказ) и в свой ход в развитии (ожидается ok).
 *
 * Запуск: node scripts/qa-m6-repro.mjs
 */
import { chromium } from "playwright";
import { advancePhase, netState, phaseOf, startNetGame, waitHumanTurn } from "./qa-lib.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));

/** Прямой вызов netAction от имени места вкладки (токен из localStorage). */
const sendReorder = (animalId, beforeId) =>
  page.evaluate(
    async ({ id, before }) => {
      const code = globalThis.__evoStore?.getState?.().net?.code;
      const token = code ? localStorage.getItem(`evo-seat-${code}`) : null;
      if (!code || !token) return { error: "нет кода/токена места" };
      const api = await import("/src/lib/net/api.ts");
      const action = before
        ? { type: "reorderAnimal", animalId: id, beforeId: before }
        : { type: "reorderAnimal", animalId: id };
      const r = await api.netAction({ data: { code, token, action } });
      return { ok: r.ok, error: r.error ?? null, code: r.code ?? null };
    },
    { id: animalId, before: beforeId ?? null },
  );

const myAnimal = () =>
  page
    .evaluate(() => {
      const sec = [...document.querySelectorAll("[data-player-section]")].find((s) =>
        s.textContent.includes("Ваша популяция"),
      );
      return sec?.querySelector("[data-animal-id]")?.getAttribute("data-animal-id") ?? null;
    })
    .catch(() => null);

try {
  await startNetGame(page, { name: "М6", players: 2, bots: 1 });
  await waitHumanTurn(page, 60_000);
  const face = page.locator("[data-hand-row] button", { hasText: "Животное" }).first();
  if (await face.count()) {
    await face.click({ timeout: 5000 }).catch(() => {});
    await sleep(700);
  }
  // 1) Свой ход в развитии — перестановка обязана пройти.
  await waitHumanTurn(page, 60_000);
  const id = await myAnimal();
  const net = await netState(page);
  console.log(`развитие, мой ход: место=${net?.seat}, животное=${id}`);
  console.log(`  ответ сервера: ${JSON.stringify(await sendReorder(id))}`);

  // 2) Уходим в фазу броска — там reorder нелегален по гейту.
  const inBank = await advancePhase(
    page,
    () => phaseOf(page).then((p) => p === "foodBank" || p === "feeding"),
    { timeout: 120_000 },
  );
  const phase = await phaseOf(page);
  const id2 = (await myAnimal()) ?? id;
  const r2 = await sendReorder(id2);
  console.log(`фаза=${phase} (дошли: ${inBank}), животное=${id2}`);
  console.log(`  ответ сервера: ${JSON.stringify(r2)}`);
  console.log(
    r2.error
      ? `ВОСПРОИЗВЕДЕНО: в фазе «${phase}» сервер отвечает «${r2.error}» — это текст, который игрок видит тостом`
      : "отказа не было: гейт пропустил перестановку",
  );
} catch (e) {
  console.log("FAIL:", String(e?.message ?? e).split("\n")[0]);
} finally {
  await browser.close();
}
