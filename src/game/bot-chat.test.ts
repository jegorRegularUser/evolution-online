import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BOT_CHAT,
  CHANCES,
  PHRASES,
  PERSONALITIES,
  SCARCE_FOOD_TOTAL,
  categorizePlayerMessage,
  emptyBotMemory,
  eventTriggers,
  personalityOf,
  pickBotLine,
  renderPhrase,
  type BotChatMemory,
  type BotSpeaker,
  type TriggerContext,
} from "./bot-chat.ts";
import { TRAITS } from "./traits.ts";
import type { GameEvent, Player, TraitId } from "./types.ts";

// Детерминированный ГПСЧ (mulberry32) — те же правила, что в движке.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let seq = 0;
function makePlayer(
  id: number,
  name: string,
  isAI: boolean,
  animalIds: string[] = [],
): Player {
  seq += 1;
  return {
    id,
    name,
    isAI,
    hand: [],
    discardCount: 0,
    passedDev: false,
    passedFeed: false,
    animals: animalIds.map((animalId, i) => ({
      id: animalId,
      ownerId: id,
      cardId: `c${seq}-${animalId}`,
      traits: [],
      food: 0,
      blueFood: 0,
      fatTokens: 0,
      hibernating: false,
      hibernatedLastYear: false,
      receivedFoodThisYear: false,
      poisoned: false,
      seed: seq * 100 + i,
    })),
  };
}

function ctx(players: Player[], pendingAttack: TriggerContext["pendingAttack"] = null): TriggerContext {
  return { players, pendingAttack };
}

const HUMAN = () => makePlayer(0, "Дима", false, ["h1"]);
const KUVIER = () => makePlayer(1, "Кювье", true, ["k1"]);
const DARWIN = () => makePlayer(2, "Дарвин", true, ["d1"]);

function botNames(triggers: ReturnType<typeof eventTriggers>): string[] {
  return triggers.flatMap((t) => t.candidates.map((c) => c.name));
}

describe("банк реплик ботов", () => {
  const PLACEHOLDERS = new Set(["name", "trait"]);

  it("в каждой категории есть варианты и все подстановки разрешимы", () => {
    for (const [category, variants] of Object.entries(PHRASES)) {
      assert.ok(variants.length >= 4, `${category}: нужно хотя бы 4 варианта, есть ${variants.length}`);
      for (const text of variants) {
        assert.ok(text.trim().length > 0, `${category}: пустой вариант`);
        for (const match of text.matchAll(/\{(\w+)\}/g)) {
          assert.ok(
            PLACEHOLDERS.has(match[1]!),
            `${category}: неизвестная подстановка {${match[1]}} в «${text}»`,
          );
        }
      }
    }
  });

  it("у семи учёных свой характер и свой пул фоновых реплик", () => {
    assert.equal(PERSONALITIES.length, 7);
    const names = new Set(PERSONALITIES.map((p) => p.name));
    assert.equal(names.size, 7);
    for (const p of PERSONALITIES) {
      assert.ok(p.idle.length >= 5, `${p.name}: нужно хотя бы 5 фоновых реплик`);
      for (const text of p.idle) {
        assert.ok(text.trim().length > 0, `${p.name}: пустая фоновая реплика`);
        assert.doesNotMatch(text, /\{\w+\}/, `${p.name}: подстановки в idle не нужны`);
      }
    }
  });

  it("характер определяется и по имени с суффиксом, и стабильно для незнакомца", () => {
    assert.equal(personalityOf("Кювье"), personalityOf("Кювье 1"));
    assert.equal(personalityOf("Кювье"), personalityOf("Кювье 12"));
    const stranger = personalityOf("Босс-Изверг");
    assert.equal(personalityOf("Босс-Изверг"), stranger, "незнакомое имя должно выбирать характер стабильно");
    assert.ok(PERSONALITIES.includes(stranger));
  });

  it("renderPhrase подставляет {name} и {trait}, неизвестное оставляет как есть", () => {
    assert.equal(
      renderPhrase("Ты заплатишь, {name}!", { name: "Дима" }),
      "Ты заплатишь, Дима!",
    );
    assert.equal(
      renderPhrase("«{trait}» — венец творения.", { trait: "Хищник" }),
      "«Хищник» — венец творения.",
    );
    assert.equal(renderPhrase("Никого нет: {name}", undefined), "Никого нет: {name}");
    assert.equal(renderPhrase("{mystery}", { name: "x" }), "{mystery}");
  });
});

describe("выбор реплики (pickBotLine)", () => {
  const KUVY: BotSpeaker = { name: "Кювье", seat: 1 };
  const DARW: BotSpeaker = { name: "Дарвин", seat: 2 };
  const base = {
    candidates: [KUVY],
    chance: 1,
    nowMs: 1_000_000,
    version: 100,
    round: 3,
    rng: mulberry32(7),
  };

  it("детерминирован при одном зерне ГПСЧ", () => {
    const a = pickBotLine({ ...base, category: "greeting", rng: mulberry32(42), memory: emptyBotMemory() });
    const b = pickBotLine({ ...base, category: "greeting", rng: mulberry32(42), memory: emptyBotMemory() });
    assert.ok(a);
    assert.deepEqual(a, b);
  });

  it("шанс: промах молчит, попадание говорит", () => {
    assert.equal(
      pickBotLine({ ...base, category: "greeting", chance: 0.1, rng: () => 0.99, memory: emptyBotMemory() }),
      null,
      "rng >= chance — молчание",
    );
    assert.ok(
      pickBotLine({ ...base, category: "greeting", chance: 0.1, rng: () => 0.01, memory: emptyBotMemory() }),
      "rng < chance — реплика",
    );
  });

  it("кап на год: после трёх реплик молчим до следующего года", () => {
    const full: BotChatMemory = emptyBotMemory();
    full.linesThisRound["3"] = BOT_CHAT.maxPerRound;
    assert.equal(pickBotLine({ ...base, category: "greeting", rng: () => 0, memory: full }), null);
    const nextYear = pickBotLine({ ...base, category: "greeting", round: 4, rng: () => 0, memory: full });
    assert.ok(nextYear, "в новом году кап обнуляется");
  });

  it("кулдаун бота: и по времени, и по шагам партии", () => {
    const mem: BotChatMemory = emptyBotMemory();
    mem.lastSpokeAt["Кювье"] = base.nowMs;
    mem.lastSpokeVersion["Кювье"] = base.version;
    // Слишком рано по времени.
    assert.equal(
      pickBotLine({ ...base, category: "greeting", nowMs: base.nowMs + 1000, version: base.version + 5, rng: () => 0, memory: mem }),
      null,
    );
    // Время прошло, но в партии не случилось трёх шагов.
    assert.equal(
      pickBotLine({ ...base, category: "greeting", nowMs: base.nowMs + BOT_CHAT.minGapMs + 1, version: base.version + 1, rng: () => 0, memory: mem }),
      null,
    );
    const line = pickBotLine({
      ...base,
      category: "greeting",
      nowMs: base.nowMs + BOT_CHAT.minGapMs + 1,
      version: base.version + BOT_CHAT.minGapVersion,
      rng: () => 0,
      memory: mem,
    });
    assert.ok(line, "после зазора бот снова говорит");
  });

  it("если участник события молчит по кулдауну — пробуем следующего кандидата", () => {
    const mem: BotChatMemory = emptyBotMemory();
    mem.lastSpokeAt["Кювье"] = base.nowMs;
    mem.lastSpokeVersion["Кювье"] = base.version;
    const line = pickBotLine({
      ...base,
      category: "greeting",
      candidates: [KUVY, DARW],
      rng: () => 0,
      memory: mem,
    });
    assert.ok(line);
    assert.equal(line.speaker.name, "Дарвин");
  });

  it("злость игрока: ядовитый язвит, обидчивый сочувствует", () => {
    const kuch = pickBotLine({ ...base, category: "replyRage", candidates: [{ name: "Кювье", seat: 1 }], rng: () => 0, memory: emptyBotMemory() });
    assert.ok(kuch);
    assert.ok(PHRASES.replyTaunt.includes(kuch.text), `Кювье должен язвить, сказал: ${kuch.text}`);
    const lamarck = pickBotLine({ ...base, category: "replyRage", candidates: [{ name: "Ламарк", seat: 3 }], rng: () => 0, memory: emptyBotMemory() });
    assert.ok(lamarck);
    assert.ok(PHRASES.replySympathy.includes(lamarck.text), `Ламарк должен сочувствовать, сказал: ${lamarck.text}`);
  });

  it("фоновая реплика берётся из характера бота", () => {
    const line = pickBotLine({ ...base, category: "idle", candidates: [{ name: "Дарвин", seat: 2 }], rng: () => 0, memory: emptyBotMemory() });
    assert.ok(line);
    assert.ok(PERSONALITIES.find((p) => p.name === "Дарвин")!.idle.includes(line.text));
  });

  it("память не изменяется, а возвращается обновлённой копией", () => {
    const mem = emptyBotMemory();
    const snapshot = JSON.stringify(mem);
    const line = pickBotLine({ ...base, category: "greeting", rng: () => 0, memory: mem });
    assert.ok(line);
    assert.equal(JSON.stringify(mem), snapshot, "исходная память должна остаться нетронутой");
    assert.equal(line.memory.linesThisRound["3"], 1);
    assert.equal(line.memory.lastSpokeAt["Кювье"], base.nowMs);
  });

  it("подстановка имени игрока попадает в текст", () => {
    const line = pickBotLine({
      ...base,
      category: "huntSuccess",
      params: { name: "Дима" },
      rng: () => 0,
      memory: emptyBotMemory(),
    });
    assert.ok(line);
    assert.ok(!line.text.includes("{name}"), `имя должно быть подставлено: ${line.text}`);
  });
});

describe("категория ответа на сообщение игрока", () => {
  const cases: Array<[string, ReturnType<typeof categorizePlayerMessage>]> = [
    ["Привет, звери!", "replyGreeting"],
    ["здарова, учёные", "replyGreeting"],
    ["ахахаха", "replyTease"],
    ["лол, ну ты даёшь", "replyTease"],
    ["ха-ха ))", "replyTease"],
    ["ну всё, бесит!!!", "replyRage"],
    ["это подстава", "replyRage"],
    ["Согласен, красиво сыграл", "replyAgreement"],
    ["молодец, удачи", "replyAgreement"],
    ["ход третий, еда кончается", "replyGeneric"],
    ["", "replyGeneric"],
  ];
  for (const [text, expected] of cases) {
    it(`«${text}» → ${expected}`, () => {
      assert.equal(categorizePlayerMessage(text), expected);
    });
  }
});

describe("триггеры событий (eventTriggers)", () => {
  it("бот-охотник хвастается после успешной охоты на человека", () => {
    const triggers = eventTriggers(ctx([HUMAN(), KUVIER(), DARWIN()]), [
      { kind: "preyKilled", preyId: "h1", carnivoreId: "k1" },
    ]);
    assert.equal(triggers.length, 1);
    assert.equal(triggers[0]!.category, "huntSuccess");
    assert.deepEqual(botNames(triggers), ["Кювье"]);
    assert.equal(triggers[0]!.params?.name, "Дима");
    assert.equal(triggers[0]!.chance, CHANCES.huntSuccess);
  });

  it("гибель зверя бота сильнее бахвальства охотника: сначала жертва", () => {
    const triggers = eventTriggers(ctx([HUMAN(), KUVIER(), DARWIN()]), [
      { kind: "preyKilled", preyId: "k1", carnivoreId: "h1" },
    ]);
    assert.equal(triggers.length, 1);
    assert.equal(triggers[0]!.category, "preyDied");
    assert.equal(triggers[0]!.params?.name, "Дима");
  });

  it("два бота в охоте дают триггер и жертве, и охотнику", () => {
    const triggers = eventTriggers(ctx([HUMAN(), KUVIER(), DARWIN()]), [
      { kind: "preyKilled", preyId: "d1", carnivoreId: "k1" },
    ]);
    assert.deepEqual(
      triggers.map((t) => t.category),
      ["preyDied", "huntSuccess"],
      "сначала горе жертвы, потом бахвальство",
    );
    assert.deepEqual(botNames(triggers), ["Дарвин", "Кювье"]);
  });

  it("хищник-растение не даёт имени: реплика жертвы без {name} не строится", () => {
    const triggers = eventTriggers(ctx([HUMAN(), KUVIER(), DARWIN()]), [
      { kind: "preyKilled", preyId: "k1", carnivoreId: "plant-42" },
    ]);
    assert.deepEqual(triggers, [], "охотник-растение имени не имеет — молчим, а не печатаем {name}");
  });

  it("объявление охоты на зверя бота — триггер «hunted» с именем нападающего", () => {
    const triggers = eventTriggers(ctx([HUMAN(), KUVIER(), DARWIN()]), [
      { kind: "huntDeclared", carnivoreId: "h1", preyId: "k1" },
    ]);
    assert.equal(triggers.length, 1);
    assert.equal(triggers[0]!.category, "hunted");
    assert.deepEqual(botNames(triggers), ["Кювье"]);
    assert.equal(triggers[0]!.params?.name, "Дима");
  });

  it("защита спасла добычу: бот-жертва злорадствует, бот-охотник негодует", () => {
    const players = [HUMAN(), KUVIER(), DARWIN()];
    // Охотник-человек: реплика только у бота-жертвы.
    const escaped = eventTriggers(ctx(players, { carnivoreId: "h1", preyId: "k1" }), [
      { kind: "defenseUsed", defense: "running", roll: 5, preyId: "k1" },
    ]);
    assert.equal(escaped.length, 1);
    assert.equal(escaped[0]!.category, "preyEscaped");
    assert.deepEqual(botNames(escaped), ["Кювье"]);
    assert.equal(escaped[0]!.params?.name, "Дима");

    // Оба бота: жертва спаслась И охота провалилась — два триггера.
    const repelled = eventTriggers(ctx(players, { carnivoreId: "k1", preyId: "d1" }), [
      { kind: "defenseUsed", defense: "tailLoss", preyId: "d1" },
    ]);
    assert.deepEqual(
      repelled.map((t) => t.category),
      ["preyEscaped", "huntFail"],
      "сначала радость жертвы, потом досада охотника",
    );
    assert.deepEqual(botNames(repelled), ["Дарвин", "Кювье"]);
    assert.equal(repelled[0]!.params?.name, "Кювье");
    assert.equal(repelled[1]!.params?.name, "Дарвин");
  });

  it("защита «сдался» молчит, а неспасшаяся добыча реплику отдаёт preyKilled", () => {
    const players = [HUMAN(), KUVIER(), DARWIN()];
    assert.deepEqual(
      eventTriggers(ctx(players, { carnivoreId: "h1", preyId: "k1" }), [
        { kind: "defenseUsed", defense: "none", preyId: "k1" },
      ]),
      [],
    );
    const triggers = eventTriggers(ctx(players, { carnivoreId: "k1", preyId: "d1" }), [
      { kind: "defenseUsed", defense: "mimicry", preyId: "d1" },
      { kind: "preyKilled", preyId: "d1", carnivoreId: "k1" },
    ]);
    assert.deepEqual(
      triggers.map((t) => t.category),
      ["preyDied", "huntSuccess"],
      "добыча всё же погибла: реплики от preyKilled, «побегов» у defenseUsed нет",
    );
  });

  it("голод и яд бьют по владельцу-боту; смерти людей ботов не волнуют", () => {
    const players = [HUMAN(), KUVIER(), DARWIN()];
    const starved = eventTriggers(ctx(players), [
      { kind: "animalDied", animalId: "k1", cause: "starved" },
    ]);
    assert.equal(starved.length, 1);
    assert.equal(starved[0]!.category, "starved");
    assert.equal(eventTriggers(ctx(players), [{ kind: "animalDied", animalId: "h1", cause: "starved" }]).length, 0);
    const poison = eventTriggers(ctx(players), [
      { kind: "animalDied", animalId: "d1", cause: "poisonMark" },
    ]);
    assert.equal(poison.length, 1);
    assert.equal(poison[0]!.category, "poisoned");
  });

  it("низкий бросок кормовой базы — все боты могут поворчать", () => {
    const players = [HUMAN(), KUVIER(), DARWIN()];
    const scarce = eventTriggers(ctx(players), [{ kind: "diceRoll", dice: [2, 2], total: SCARCE_FOOD_TOTAL }]);
    assert.equal(scarce.length, 1);
    assert.equal(scarce[0]!.category, "foodScarcity");
    assert.equal(scarce[0]!.candidates.length, 2);
    assert.equal(
      eventTriggers(ctx(players), [{ kind: "diceRoll", dice: [6], total: SCARCE_FOOD_TOTAL + 1 }]).length,
      0,
      "еды достаточно — никто не жалуется",
    );
  });

  it("новое свойство бота — повод для гордости, скрытое — нет", () => {
    const type: TraitId = "carnivore";
    const players = [HUMAN(), KUVIER(), DARWIN()];
    const pride = eventTriggers(ctx(players), [
      { kind: "traitPlaced", animalId: "k1", type, hidden: false },
    ]);
    assert.equal(pride.length, 1);
    assert.equal(pride[0]!.category, "traitPride");
    assert.equal(pride[0]!.params?.trait, TRAITS[type].name);
    assert.equal(
      eventTriggers(ctx(players), [{ kind: "traitPlaced", animalId: "k1", type, hidden: true }]).length,
      0,
    );
    assert.equal(
      eventTriggers(ctx(players), [{ kind: "traitPlaced", animalId: "h1", type, hidden: false }]).length,
      0,
      "свойство человека ботов не хвалит",
    );
  });

  it("финал: победивший бот торжествует, проигравший признаёт поражение", () => {
    const triggers = eventTriggers(ctx([HUMAN(), KUVIER(), DARWIN()]), [
      { kind: "gameFinished", winnerIds: [1] },
    ]);
    assert.deepEqual(
      triggers.map((t) => t.category),
      ["victory", "defeat"],
    );
    assert.deepEqual(botNames(triggers), ["Кювье", "Дарвин"]);
    assert.equal(triggers[0]!.chance, CHANCES.victory);
  });

  it("события без ботов и посторонние события триггеров не создают", () => {
    assert.deepEqual(
      eventTriggers(ctx([makePlayer(0, "Дима", false, ["h1"])]), [
        { kind: "preyKilled", preyId: "h1", carnivoreId: "h2" },
        { kind: "gameFinished", winnerIds: [0] },
        { kind: "passed", playerId: 0 },
      ]),
      [],
    );
  });
});

describe("темп: партия с тремя ботами не превращается в спам", () => {
  it("за пять лет с событиями на каждом шаге реплик не больше капа на год", () => {
    const players = [HUMAN(), KUVIER(), DARWIN()];
    const bots: BotSpeaker[] = [
      { name: "Кювье", seat: 1 },
      { name: "Дарвин", seat: 2 },
      { name: "Линней", seat: 3 },
    ];
    players.push(makePlayer(3, "Линней", true, ["l1"]));
    let memory = emptyBotMemory();
    let lines = 0;
    const rng = mulberry32(2026);
    const t0 = 1_700_000_000_000;
    for (let year = 1; year <= 5; year++) {
      let spokenThisYear = 0;
      for (let step = 0; step < 30; step++) {
        // Каждую добычу бота кто-то съедает — самые частые «драматичные» события.
        const events: GameEvent[] = [
          { kind: "preyKilled", preyId: step % 2 === 0 ? "d1" : "l1", carnivoreId: step % 2 === 0 ? "k1" : "h1" },
        ];
        const triggers = eventTriggers(ctx(players), events);
        for (const trigger of triggers) {
          const line = pickBotLine({
            category: trigger.category,
            candidates: trigger.candidates,
            chance: trigger.chance,
            nowMs: t0 + step * 1500,
            version: (year - 1) * 30 + step,
            round: year,
            params: trigger.params,
            rng,
            memory,
          });
          if (!line) continue;
          memory = line.memory;
          lines += 1;
          spokenThisYear += 1;
          assert.ok(
            spokenThisYear <= BOT_CHAT.maxPerRound,
            `год ${year}: реплик ${spokenThisYear} больше капа ${BOT_CHAT.maxPerRound}`,
          );
        }
      }
      assert.ok(spokenThisYear <= BOT_CHAT.maxPerRound);
    }
    // Живость: при таких событиях реплики есть, но их порядка единиц на год.
    assert.ok(lines > 0, "полностью молчащая партия — фразы зря написаны");
    assert.ok(lines <= BOT_CHAT.maxPerRound * 5, `за 5 лет реплик ${lines} — слишком много`);
  });
});
