import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyReward,
  clearCurrentNode,
  createCampaignRun,
  loadCampaignRun,
  runBattleScenario,
  saveCampaignRun,
  type CampaignRun,
} from "./campaign-run.ts";
import { CAMPAIGN_ERAS } from "./campaign.ts";

/**
 * Модель забега кампании-рогалика (фундамент): путь эпохи — связный граф
 * бой→награда→…→изверг, награды капятся в заначку, персист — localStorage.
 * localStorage в node нет — ставим краткий полифилл на время теста.
 */

const store = new Map<string, string>();
(globalThis as Record<string, unknown>).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};

function nodeOrder(run: CampaignRun): string[] {
  const ids: string[] = [];
  let cur: string | undefined = Object.values(run.nodes).find((n) => !Object.values(run.nodes).some((x) => x.next.includes(n.id)))?.id;
  const seen = new Set<string>();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    ids.push(cur);
    cur = run.nodes[cur]!.next[0];
  }
  return ids;
}

describe("campaign-run: путь эпохи", () => {
  for (const era of CAMPAIGN_ERAS) {
    it(`${era.id}: 5 узлов, старт с боя, финал — изверг, награды между боями`, () => {
      const run = createCampaignRun(era.id);
      const order = nodeOrder(run);
      assert.equal(order.length, 5);
      assert.deepEqual(order, Object.keys(run.nodes).sort().map((id) => run.nodes[id]!.id));
      const kinds = order.map((id) => run.nodes[id]!.kind);
      assert.equal(kinds[0], "battle");
      assert.equal(kinds[kinds.length - 1], "boss");
      assert.deepEqual(kinds.filter((k) => k === "reward").length, 2);
      // Награда не стоит первой и не идёт подряд.
      for (let i = 1; i < kinds.length; i++) {
        assert.ok(!(kinds[i] === "reward" && kinds[i - 1] === "reward"), "награды не идут подряд");
      }
      // У каждого боевого узла есть конфиг партии; у награды — три варианта.
      for (const id of order) {
        const n = run.nodes[id]!;
        if (n.kind === "reward") assert.equal(n.rewards?.length, 3);
        else assert.ok(n.battle, `узел ${id} без battle`);
      }
      // Босс несёт ломающее правило.
      const boss = run.nodes[order[order.length - 1]]!;
      assert.ok(boss.battle?.scenario, "у изверга нет сценарного правила");
    });
  }
});

describe("campaign-run: награды и продвижение", () => {
  it("победа двигает курсор, финал пути — забег won", () => {
    const run = createCampaignRun("cambrian");
    const order = nodeOrder(run);
    for (let i = 0; i < order.length; i++) {
      assert.equal(run.currentNodeId, order[i]);
      clearCurrentNode(run);
    }
    assert.equal(run.status, "won");
    assert.equal(run.currentNodeId, "");
    assert.equal(run.cleared.length, 5);
  });

  it("handBonus капится на 2, свойства не дублируются", () => {
    const run = createCampaignRun("devon");
    const [hand, burrow, tail] = run.nodes["devon-2"]!.rewards!;
    applyReward(run, hand!);
    applyReward(run, hand!);
    assert.equal(run.stash.handBonus, 2, "потолок +2");
    applyReward(run, hand!);
    assert.equal(run.stash.handBonus, 2);
    applyReward(run, burrow!);
    applyReward(run, burrow!);
    assert.deepEqual(run.stash.startTraits, ["burrowing"]);
    applyReward(run, tail!);
    assert.deepEqual(run.stash.startTraits, ["burrowing", "tailLoss"]);
  });

  it("сценарий боя несёт правило босса и награды человеку", () => {
    const run = createCampaignRun("cambrian");
    applyReward(run, run.nodes["cambrian-2"]!.rewards![0]!);
    const boss = run.nodes["cambrian-5"]!;
    const scenario = runBattleScenario(run, boss);
    assert.equal(scenario?.seat, 1);
    assert.equal(scenario?.doubleHunt, true);
    assert.equal(scenario?.humanBoons?.handBonus, 1);
    // Обычный бой: награды есть, правила босса нет.
    const plain = runBattleScenario(run, run.nodes["cambrian-1"]!);
    assert.equal(plain?.doubleHunt, undefined);
    assert.equal(plain?.humanBoons?.handBonus, 1);
  });
});

describe("campaign-run: персист", () => {
  it("save/load — кругосировка с матчем и заначкой", () => {
    const run = createCampaignRun("glacier");
    applyReward(run, run.nodes["glacier-2"]!.rewards![1]!);
    clearCurrentNode(run);
    run.match = { nodeId: run.currentNodeId, state: { marker: true } as unknown as import("./types.ts").GameState, version: 7 };
    saveCampaignRun(run);
    const loaded = loadCampaignRun();
    assert.ok(loaded);
    assert.equal(loaded!.era, "glacier");
    assert.equal(loaded!.stash.startTraits.length, 1);
    assert.equal(loaded!.cleared.length, 1);
    assert.equal(loaded!.match?.version, 7);
    assert.deepEqual(loaded!.nodes, run.nodes);
  });

  it("битое хранилище — null, а не падение", () => {
    store.set("evo-campaign-run", "{broken json");
    assert.equal(loadCampaignRun(), null);
    store.set("evo-campaign-run", JSON.stringify({ version: 99 }));
    assert.equal(loadCampaignRun(), null);
    store.delete("evo-campaign-run");
    assert.equal(loadCampaignRun(), null);
  });
});
