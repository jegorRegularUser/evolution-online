/**
 * Реплики ботов в чат (#9): банк фраз и ЧИСТАЯ логика выбора.
 *
 * Модуль ничего не знает о БД, сети и времени сервера: наружу отдаются
 * детерминированные функции, принимающие ГПСЧ, показания часов, версию
 * партии и «память» (кто когда последний раз говорил) как аргументы.
 * Сервер (server.ts) только хранит память по коду комнаты и вставляет
 * выбранную реплику в evo_chat от имени бота.
 *
 * Тон: игровой, «по прикольному» — негодование, злость, сарказм, пафос
 * учёных. Без оскорблений и токсичности за пределами дружеского пикирования.
 * Фразы — только русский текст без i18n-ключей: сервер языка клиента не
 * знает, а боты по сюжету — русскоязычные учёные (как и журнал движка).
 */

import { TRAITS } from "./traits.ts";
import type { GameEvent, Player } from "./types.ts";

// ── категории ────────────────────────────────────────────────────────────────

/** Реплики по игровым событиям и по ходу партии. */
export type BotEventCategory =
  /** Бот съел чужое животное ({name} — имя жертвы). */
  | "huntSuccess"
  /** Охоту бота отбила защита добычи ({name} — имя жертвы). */
  | "huntFail"
  /** Животное бота спаслось бегством/мимикрией ({name} — имя охотника). */
  | "preyEscaped"
  /** На животное бота объявлена охота ({name} — имя охотника). */
  | "hunted"
  /** Животное бота съедено ({name} — имя охотника). */
  | "preyDied"
  /** Животное бота умерло от голода. */
  | "starved"
  /** Животное бота отравлено. */
  | "poisoned"
  /** Мало еды в базе (низкий бросок). */
  | "foodScarcity"
  /** Бот выложил свойство ({trait} — название свойства). */
  | "traitPride"
  /** Старт партии. */
  | "greeting"
  /** Бот в числе победителей. */
  | "victory"
  /** Партия кончилась не в пользу бота. */
  | "defeat";

/** Ответы ботов на сообщения живых игроков. */
export type BotReplyCategory =
  | "replyGreeting"
  | "replyAgreement"
  | "replyTease"
  | "replySympathy"
  | "replyTaunt"
  /** Ничего узнаваемого — общий комментарий. */
  | "replyGeneric"
  /**
   * Игрок злится: ядовитые боты язвят в ответ, остальные сочувствуют.
   * Разрешается в характер ВЫБРАННОГО бота внутри pickBotLine.
   */
  | "replyRage";

export type BotLineCategory = BotEventCategory | BotReplyCategory | "idle";

// ── вероятности и ограничения темпа ──────────────────────────────────────────

/**
 * Шансы линий на одно событие-триггер. Общий темп ограничивают и они, и
 * кулдауны ниже: партия с тремя ботами даёт реплику раз в несколько ходов,
 * а не на каждое действие.
 */
export const CHANCES: Record<BotEventCategory | "idle" | "chatReply", number> = {
  huntSuccess: 0.1,
  huntFail: 0.1,
  preyEscaped: 0.1,
  hunted: 0.08,
  preyDied: 0.12,
  starved: 0.1,
  poisoned: 0.08,
  foodScarcity: 0.05,
  traitPride: 0.05,
  greeting: 0.35,
  victory: 0.6,
  defeat: 0.35,
  idle: 0.04,
  chatReply: 0.3,
};

/** Темп реплик: между двумя репликами одного бота. */
export const BOT_CHAT = {
  /** Минутный по практике чата зазор по времени (мс эпохи). */
  minGapMs: 45_000,
  /** И минимум три шага партии (версии состояния) — чтобы бот не говорил дважды подряд в одном круге. */
  minGapVersion: 3,
  /** Не больше трёх реплик всех ботов за один год (раунд) на стол. */
  maxPerRound: 3,
} as const;

/** Низкий бросок кормовой базы, после которого бот вправе поворчать. */
export const SCARCE_FOOD_TOTAL = 5;

// ── участники и память ───────────────────────────────────────────────────────

export interface BotSpeaker {
  /** Имя бота (как в evo_seats, напр. «Кювье» или «Кювье 1» — характер вычисляется по основе). */
  name: string;
  /** Место бота в комнате (player.id). */
  seat: number;
}

/**
 * Память о репликах одной комнаты. Неизменяемая по соглашению: pickBotLine
 * возвращает обновлённую копию, сервер её и хранит.
 */
export interface BotChatMemory {
  /** Имя бота → мс эпохи последней реплики. */
  lastSpokeAt: Record<string, number>;
  /** Имя бота → версия партии на момент реплики. */
  lastSpokeVersion: Record<string, number>;
  /** Год (раунд) → сколько реплик уже прозвучало. */
  linesThisRound: Record<string, number>;
}

export function emptyBotMemory(): BotChatMemory {
  return { lastSpokeAt: {}, lastSpokeVersion: {}, linesThisRound: {} };
}

// ── характеры ────────────────────────────────────────────────────────────────

export interface BotPersonality {
  /** Базовое имя из AI_NAMES (engine.ts). */
  name: string;
  /** Короткая подпись темперамента — для тестов и правок. */
  label: string;
  /** Реакция на злость игрока (категория replyRage). */
  moodOnRage: "sympathy" | "taunt";
  /** Периодические реплики «в пустоту» — свои на характер. */
  idle: string[];
}

/** Семь учёных — семь темпераментов (имена из AI_NAMES в engine.ts). */
export const PERSONALITIES: BotPersonality[] = [
  {
    name: "Дарвин",
    label: "рассудительный, мягкая самоирония",
    moodOnRage: "sympathy",
    idle: [
      "Любопытно: еды всё меньше, амбиций всё больше.",
      "Данные накапливаются. Выводы — пока нет.",
      "Терпение — главный инструмент натуралиста.",
      "Интересный расклад. Запишу на будущее.",
      "Эволюция не терпит суеты. Но слегка поторопить можно.",
      "Наблюдаю. Пока ничего не ручаюсь, но скетч уже есть.",
    ],
  },
  {
    name: "Уоллес",
    label: "восторженный путешественник",
    moodOnRage: "sympathy",
    idle: [
      "Какая чудесная экосистема получается! Почти как на Молукках.",
      "Вижу здесь закономерность! Или не вижу. Проверю ещё раз.",
      "Природа — лучший художник, а мы все — её натурщики.",
      "Сколько всего происходит за одним столом! Восторг.",
      "Собрал бы здесь целую коллекцию. Красивые виды пошли!",
      "Каждый год — как новая экспедиция. Только кормить не надо.",
    ],
  },
  {
    name: "Мендель",
    label: "педант, счёт и порядок",
    moodOnRage: "sympathy",
    idle: [
      "Горох я считал точнее, чем вы считаете свои очки.",
      "Всё должно быть по правилам. И по фенотипам.",
      "Кто-то здесь не ведёт статистику. Так побед не бывает.",
      "Расщепление три к одному. Всё остальное — случайность.",
      "Порядок в колоде — порядок в голове.",
      "Записал ход в тетрадь. Как обычно, аккуратнее вашего.",
    ],
  },
  {
    name: "Линней",
    label: "сноб-систематизатор",
    moodOnRage: "sympathy",
    idle: [
      "Я бы всех вас уже разнёс по видам и подвидам.",
      "Беспорядок на столе оскорбляет систематику.",
      "Да, я знаю латынь. Нет, не скажу, что я о вас думаю. По-латыни.",
      "Каждое животное — в свою номенклатуру. Немедленно.",
      "Назвал бы это хаосом, но хаос хотя бы честен.",
      "У этого стола до сих пор нет внятной классификации. Как и у ваших планов.",
    ],
  },
  {
    name: "Кювье",
    label: "ядовитый сарказм",
    moodOnRage: "taunt",
    idle: [
      "Ваши стратегии смешили бы палеонтологов. Всех. Мёртвых тоже.",
      "Удивительно, сколько ошибок помещается в один ход.",
      "Не переживай. Катастрофа — двигатель эволюции. Я проверял.",
      "Я помню всё. Особенно чужие ошибки. Особенно твои.",
      "Скромность тебе не помешает. Как и план на игру.",
      "Теория катастроф подтверждается: катастрофа — это ваш ход.",
    ],
  },
  {
    name: "Ламарк",
    label: "обидчивый",
    moodOnRage: "sympathy",
    idle: [
      "Меня опять не упомянули. Все забыли, кто первым заговорил об эволюции!",
      "Ну конечно: шумите все, а достаётся одному мне.",
      "Упражнение и привычка! Всё решают привычки. Ваши — плохие.",
      "Обидно. Я стараюсь, а признания — ноль.",
      "Помолчали бы. Историю науки надо уважать.",
      "Вот при жизни меня не ценили, тут — тем более.",
    ],
  },
  {
    name: "Геккель",
    label: "пафосный драматург",
    moodOnRage: "taunt",
    idle: [
      "Онтогенез повторяет филогенез! А вы повторяете свои ошибки.",
      "Какая драма разворачивается! Слёзы, чешуя, триумф!",
      "Красота форм — единственное, что оправдывает эту возню.",
      "Вижу здесь симметрию. Уродливую, но симметрию.",
      "Формы природы — вот настоящее искусство. Ваша возня — так, прикладная графика.",
      "Медузы честнее вас: у них прозрачность натуральная.",
    ],
  },
];

const DEFAULT_PERSONALITY = PERSONALITIES[0]!;

/**
 * Характер бота по имени: точное совпадение, затем имя с суффиксом («Дарвин 1»),
 * затем стабильный выбор по хэшу — кампания/сценарии могут звать бота своим
 * именем, но молчать из-за этого бот не станет.
 */
export function personalityOf(name: string): BotPersonality {
  const base = name.replace(/\s+\d+$/, "").trim().toLowerCase();
  const exact = PERSONALITIES.find((p) => p.name.toLowerCase() === base);
  if (exact) return exact;
  let hash = 0;
  for (let i = 0; i < base.length; i++) hash = (hash * 31 + base.charCodeAt(i)) | 0;
  return PERSONALITIES[Math.abs(hash) % PERSONALITIES.length]!;
}

// ── банк фраз ────────────────────────────────────────────────────────────────

/**
 * Шаблоны с подстановками: {name} — имя другого игрока/бота, {trait} —
 * русское название свойства (TRAITS из движка, i18n не нужен). Прочие
 * скобки в текстах запрещены — тест банка следит.
 */
export const PHRASES: Record<Exclude<BotLineCategory, "idle" | "replyRage">, string[]> = {
  huntSuccess: [
    "{name}, прости — наука требует жертв. В основном твоих.",
    "Ммм, обед удался. Спасибо за добычу, {name}!",
    "Голодный хищник — не злой хищник. Просто эффективный.",
    "Ничего личного, {name}: естественный отбор в действии.",
    "Моё создание передаёт тебе пламенный привет, {name}.",
    "Такова пищевая цепочка: кто-то наверху, а кто-то — в ней.",
  ],
  huntFail: [
    "Как?! У тебя же не было ни брони, ни плана, {name}!",
    "Добыча ушла. Записал в графу «несправедливость».",
    "Мой хищник в ярости. {name}, это ещё не конец!",
    "Отбилась, насмотрятся... В следующий раз не отвертишься, {name}.",
    "Весь план охоты — насмарку. Из-за одной ловкости.",
  ],
  preyEscaped: [
    "Ха! Рановато ты на меня позарился, {name}.",
    "Уворотился! Форма сегодня у меня отменная.",
    "Мимо, {name}. Считай это разминкой.",
    "Едва ноги унёс... но цел. Зубы в следующий раз отращивай длиннее, {name}.",
    "Бежать — тоже стратегия. Выжил — значит, победил.",
  ],
  hunted: [
    "{name}, ты уверен? Моё создание того не стоит.",
    "Нападение! Все видели: без причины и без объявления войны!",
    "Ох, кажется, нас выбрали на обед. Не завидую охотнику.",
    "Смелый ход, {name}. Посмотрим, чем он кончится.",
    "Только попробуй! У меня на этот случай припасено кое-что.",
  ],
  preyDied: [
    "Моё создание! {name}, ты заплатишь за это очками.",
    "Погибло. Целое направление эволюции — в никуда.",
    "Запомню это, {name}. Наука долговечна, и память моя тоже.",
    "Жаль зверя. Он был почти готов всех победить.",
    "Ну и аппетиты у некоторых, {name}!",
    "Это была не охота, {name}. Это была война.",
  ],
  starved: [
    "Кормовая база — позорище. Мы тут вымираем, между прочим.",
    "Голодная смерть — самая обидная. Нечего было экономить.",
    "Моё животное не дожило до обеда. Вечная ему память.",
    "Так. Кто съел всю еду? Признавайтесь!",
    "Экстремальная диета не работает. Проверено на своём звере.",
  ],
  poisoned: [
    "Отравился?! Кто разрешил ему есть незнакомые ягоды?!",
    "Яд. Классика. Всегда проверяй, что ешь, дети.",
    "Моё создание погибло от яда. Наука скорбит.",
    "Учусь на ошибках: ядовитое — не значит питательное.",
  ],
  foodScarcity: [
    "С кормовой базой в этом году кто-то перестарался. В худшем смысле.",
    "Бросок кубика — и столько боли.",
    "В этом году все будут худые. Очень.",
    "Голодный сезон, говорите... Я бы сказал — голодный год.",
    "Кто-нибудь ещё чувствует, что еды катастрофически мало? Нет? Одни я.",
  ],
  traitPride: [
    "«{trait}»! Вот теперь я — венец творения.",
    "Поставил «{trait}». Завидуйте молча.",
    "«{trait}» на доске. Классика жанра.",
    "Новая «{trait}» — и мир содрогнулся. Ну, почти.",
    "«{trait}»? Гениально. Даже если говорю это сам.",
    "Свойство «{trait}» занимает своё законное место. Стратегия чиста.",
  ],
  greeting: [
    "Всем привет. Пусть победит сильнейший генотип.",
    "Здороваться — хорошо. А теперь — к естественному отбору.",
    "Итак, пруд заселён. Начинаем эксперимент.",
    "Привет, коллеги. Помните: мутация непредсказуема. Как и я.",
    "Готов эволюционировать. Кто со мной — тот рискует.",
  ],
  victory: [
    "Победа! Наука, а не удача. Ну ладно, чуть-чуть удачи.",
    "Как я и предсказывал. Записи велись с первого хода.",
    "Первое место! Мой метод работает.",
    "Победил сильнейший. То есть я. Всё честно.",
    "Вы все были достойны. Но я — достойнее.",
  ],
  defeat: [
    "Поражение? Данные просто были недостаточно полными.",
    "Ну и ладно. В следующей партии пересмотрю стратегию.",
    "Проиграл... но с достоинством. Почти.",
    "Отрицательный результат — тоже результат!",
    "Меня обошли. Запишу имена. Все до одного.",
  ],
  replyGreeting: [
    "И тебе привет. Не отвлекайся от эволюции.",
    "Привет-привет. Хорошая партия начинается с вежливости.",
    "Здравствуй. Твои животные меня пока не пугают.",
    "О, живые люди! Рады стараться.",
    "Приветствую. Ставки сделаны, отбор начался.",
  ],
  replyAgreement: [
    "Согласен. Редкость, но бывает.",
    "Вот! Наконец кто-то говорит разумные вещи.",
    "Запишу. Хорошая мысль — не пропадать же.",
    "Именно. Наука любит точность.",
    "Поддерживаю. Игра продолжается.",
  ],
  replyTease: [
    "Ха! Вот за это твои животные и платят.",
    "Смейся-смейся, а еда кончится.",
    "Смеёшься? Эволюция тоже смеётся. Последней.",
    "Ржёшь, пока твой хищник голодный. Смелый ход.",
    "Хех. Твоя уверенность занесена в протокол.",
  ],
  replySympathy: [
    "Держись. Неудачный бросок — ещё не приговор.",
    "Бывает. У меня тоже вымирали целыми ветвями.",
    "Сочувствую. Эволюция жестока, но справедлива. Ну, жестока.",
    "Ничего, следующий год твой. Возможно.",
    "Понимаю. Я тоже терял. Много. Всех жалко.",
  ],
  replyTaunt: [
    "Жалуешься? Естественный отбор жалобы не слушает.",
    "Ох, страсти. Может, тебе кубик пожалеть?",
    "Слабое звено всегда громче всех. Проверено.",
    "Возмущение зафиксировано. Результат не изменён.",
    "Не злись — эволюция всё равно безжалостна. Как я.",
  ],
  replyGeneric: [
    "Продолжаем наблюдение.",
    "Хм. Интересная позиция.",
    "Все реплики зафиксированы. Пригодится в финале.",
    "Разговоры — это хорошо. Но еда лучше.",
    "Слушаю. Эволюционирую. Одновременно.",
    "Каждое слово — в дневник наблюдений.",
  ],
};

/** Подстановка {ключей} в шаблон; неизвестные ключи остаются как есть. */
export function renderPhrase(template: string, params?: Record<string, string>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    Object.prototype.hasOwnProperty.call(params, key) ? params[key]! : whole,
  );
}

// ── реакция на сообщения игроков ─────────────────────────────────────────────

/**
 * Границы слов для кириллицы: \b в JS считает словообразующими только
 * латиницу/цифры, поэтому русские слова ищем через «не буква до/после».
 */
const REPLY_KEYWORDS: Array<{ category: BotReplyCategory; pattern: RegExp }> = [
  {
    category: "replyGreeting",
    pattern:
      /(^|[^а-яё])(привет|прив|здаров|здарова|здравств|здрасьте|хай|ку|салют|hello|hi)(?=$|[^а-яё])/i,
  },
  {
    category: "replyRage",
    pattern:
      /(^|[^а-яё])(бесит|злюсь|злой|злая|злость|ненавижу|чёрт|черт|блин|жесть|ужас|обидно|нечестно|жульнич|читер|подстав|капец|кошмар|задолба)/i,
  },
  {
    category: "replyTease",
    // Смех живёт внутри слов («ахахаха»), тут границы не нужны.
    pattern: /(ахах|хаха|хехе|хихи|ха-ха|лол|кек|ржу|ржач|смешно|угар|\){2,})/i,
  },
  {
    category: "replyAgreement",
    pattern:
      /(^|[^а-яё])(согласен|согласна|точно|верно|правда|хорошо|давай|удачи|удача|красиво|красота|молодец|зачёт|зачет|прикольно|круто|топ|го)(?=$|[^а-яё])/i,
  },
];

/**
 * Категория ответа по тексту игрока: приветствие → злость → смех →
 * согласие → общий комментарий. Порядок фиксирован, чтобы «привет,
 * бесит» отвечало как приветствие (вежливость прежде драмы).
 */
export function categorizePlayerMessage(text: string): BotReplyCategory {
  const clean = text.trim();
  for (const { category, pattern } of REPLY_KEYWORDS) {
    if (pattern.test(clean)) return category;
  }
  return "replyGeneric";
}

// ── триггеры событий ─────────────────────────────────────────────────────────

export interface BotTrigger {
  category: BotEventCategory;
  /** Шанс линии на этот триггер (0..1). */
  chance: number;
  /** Кандидаты в порядке предпочтения: сначала участники события. */
  candidates: BotSpeaker[];
  /** Подстановки в шаблон ({name}, {trait}). */
  params?: Record<string, string>;
}

/**
 * Срез состояния ДО шага, нужный для разбора событий. GameState структурно
 * ему удовлетворяет; тесты собирают его из двух полей.
 */
export interface TriggerContext {
  players: Player[];
  /** Объявленная и ещё не разрешённая охота (нужна defenseUsed: объявление и защита — разные шаги). */
  pendingAttack: { carnivoreId: string; preyId: string } | null;
}

function botSpeakers(players: Player[]): BotSpeaker[] {
  return players.filter((p) => p.isAI).map((p) => ({ seat: p.id, name: p.name }));
}

/** Владелец животного по id среди игроков ДО шага (съеденные ещё на месте). */
function ownerOfAnimal(players: Player[], animalId: string): Player | null {
  for (const p of players) {
    if (p.animals.some((a) => a.id === animalId)) return p;
  }
  return null;
}

function speakerOf(owner: Player | null): BotSpeaker | null {
  return owner && owner.isAI ? { seat: owner.id, name: owner.name } : null;
}

/**
 * Триггеры реплик из событий одного шага. Контекст — состояние ДО шага:
 * съеденная добыча там ещё числится за владельцем. Триггер создаётся, только
 * если в событии фигурирует бот И все подстановки его шаблона разрешимы
 * (например, реплика жертвы «съел {name}» не строится, когда охотник —
 * растение, имени которого нет).
 */
export function eventTriggers(before: TriggerContext, events: GameEvent[]): BotTrigger[] {
  const triggers: BotTrigger[] = [];
  const bots = botSpeakers(before.players);
  const killedPrey = new Set(
    events.filter((e) => e.kind === "preyKilled").map((e) => (e.kind === "preyKilled" ? e.preyId : "")),
  );

  for (const event of events) {
    switch (event.kind) {
      case "huntDeclared": {
        const preyOwner = ownerOfAnimal(before.players, event.preyId);
        const hunterOwner = ownerOfAnimal(before.players, event.carnivoreId);
        const prey = speakerOf(preyOwner);
        if (prey && hunterOwner) {
          triggers.push({
            category: "hunted",
            chance: CHANCES.hunted,
            candidates: [prey],
            params: { name: hunterOwner.name },
          });
        }
        break;
      }
      case "preyKilled": {
        const preyOwner = ownerOfAnimal(before.players, event.preyId);
        const hunterOwner = ownerOfAnimal(before.players, event.carnivoreId);
        const prey = speakerOf(preyOwner);
        const hunter = speakerOf(hunterOwner);
        // Сначала горе жертвы (оно эмоциональнее), потом бахвальство охотника.
        // Охотник может быть растением: реплика жертвы без его имени не строится.
        if (prey && hunterOwner) {
          triggers.push({
            category: "preyDied",
            chance: CHANCES.preyDied,
            candidates: [prey],
            params: { name: hunterOwner.name },
          });
        }
        if (hunter && preyOwner) {
          triggers.push({
            category: "huntSuccess",
            chance: CHANCES.huntSuccess,
            candidates: [hunter],
            params: { name: preyOwner.name },
          });
        }
        break;
      }
      case "defenseUsed": {
        if (event.defense === "none") break; // сдался — дальше будет preyKilled
        if (killedPrey.has(event.preyId)) break; // защита не спасла — реплику скажет preyKilled
        const preyOwner = ownerOfAnimal(before.players, event.preyId);
        // Объявление охоты и защита — разные шаги: имя охотника берём
        // из незакрытой атаки, а не из событий этого шага.
        const hunterOwner =
          before.pendingAttack && before.pendingAttack.preyId === event.preyId
            ? ownerOfAnimal(before.players, before.pendingAttack.carnivoreId)
            : null;
        const prey = speakerOf(preyOwner);
        const hunter = speakerOf(hunterOwner);
        if (prey && hunterOwner) {
          triggers.push({
            category: "preyEscaped",
            chance: CHANCES.preyEscaped,
            candidates: [prey],
            params: { name: hunterOwner.name },
          });
        }
        if (hunter && preyOwner) {
          triggers.push({
            category: "huntFail",
            chance: CHANCES.huntFail,
            candidates: [hunter],
            params: { name: preyOwner.name },
          });
        }
        break;
      }
      case "animalDied": {
        const owner = ownerOfAnimal(before.players, event.animalId);
        const speaker = speakerOf(owner);
        if (!speaker) break;
        if (event.cause === "starved") {
          triggers.push({ category: "starved", chance: CHANCES.starved, candidates: [speaker] });
        } else if (event.cause === "poison" || event.cause === "poisonMark") {
          triggers.push({ category: "poisoned", chance: CHANCES.poisoned, candidates: [speaker] });
        }
        break;
      }
      case "diceRoll": {
        if (event.total > SCARCE_FOOD_TOTAL || !bots.length) break;
        triggers.push({ category: "foodScarcity", chance: CHANCES.foodScarcity, candidates: bots });
        break;
      }
      case "traitPlaced": {
        const owner = ownerOfAnimal(before.players, event.animalId);
        const speaker = speakerOf(owner);
        if (!speaker || event.hidden) break;
        triggers.push({
          category: "traitPride",
          chance: CHANCES.traitPride,
          candidates: [speaker],
          params: { trait: TRAITS[event.type].name },
        });
        break;
      }
      case "gameFinished": {
        if (!bots.length) break;
        const winners = new Set(event.winnerIds);
        const winningBots = bots.filter((b) => winners.has(b.seat));
        if (winningBots.length) {
          triggers.push({ category: "victory", chance: CHANCES.victory, candidates: winningBots });
        }
        const losingBots = bots.filter((b) => !winners.has(b.seat));
        if (losingBots.length) {
          triggers.push({ category: "defeat", chance: CHANCES.defeat, candidates: losingBots });
        }
        break;
      }
      default:
        break;
    }
  }
  return triggers;
}

// ── выбор реплики ────────────────────────────────────────────────────────────

export interface BotLineInput {
  /** Категория реплики; "idle" берёт варианты из характера выбранного бота. */
  category: BotLineCategory;
  /** Кандидаты в порядке предпочтения. */
  candidates: BotSpeaker[];
  /** Шанс линии 0..1 (1 — реплика уже разыграна, остался только кулдаун). */
  chance: number;
  /** Мс эпохи (серверные часы). */
  nowMs: number;
  /** Текущая версия партии — прокси числа шагов. */
  version: number;
  /** Текущий год партии (раунд). */
  round: number;
  /** Подстановки шаблона. */
  params?: Record<string, string>;
  /** ГПСЧ [0..1) — для воспроизводимости в тестах. */
  rng: () => number;
  /** Память комнаты (не изменяется). */
  memory: BotChatMemory;
}

export interface BotLine {
  speaker: BotSpeaker;
  text: string;
  /** Обновлённая память: сервер обязан сохранить её вместо старой. */
  memory: BotChatMemory;
}

function canSpeak(input: BotLineInput, speaker: BotSpeaker): boolean {
  const lastAt = input.memory.lastSpokeAt[speaker.name];
  if (lastAt !== undefined && input.nowMs - lastAt < BOT_CHAT.minGapMs) return false;
  const lastVersion = input.memory.lastSpokeVersion[speaker.name];
  if (lastVersion !== undefined && input.version - lastVersion < BOT_CHAT.minGapVersion) return false;
  return true;
}

/**
 * Решает, говорит ли бот, и что именно. Чистая: память не изменяет, а
 * возвращает обновлённую копию в BotLine.memory. null — молчание (шанс не
 * выпал, лимит раунда исчерпан, кулдауны или пустой банк).
 *
 * Порядок проверок детерминирован: лимит раунда → шанс → кандидаты по
 * порядку (участник события раньше свидетеля) → выбор варианта фразы.
 */
export function pickBotLine(input: BotLineInput): BotLine | null {
  const roundKey = String(input.round);
  const said = input.memory.linesThisRound[roundKey] ?? 0;
  if (said >= BOT_CHAT.maxPerRound) return null;
  if (!input.candidates.length) return null;
  if (input.rng() >= input.chance) return null;

  for (const speaker of input.candidates) {
    if (!canSpeak(input, speaker)) continue;
    // Злость игрока разрешается в характер выбранного бота: ядовитые язят,
    // остальные сочувствуют. Фоновые реплики строго персонифицированы.
    const variants: readonly string[] =
      input.category === "idle"
        ? personalityOf(speaker.name).idle
        : input.category === "replyRage"
          ? PHRASES[personalityOf(speaker.name).moodOnRage === "taunt" ? "replyTaunt" : "replySympathy"]
          : PHRASES[input.category];
    if (!variants.length) continue;
    const text = renderPhrase(variants[Math.floor(input.rng() * variants.length)]!, input.params);
    return {
      speaker,
      text,
      memory: {
        lastSpokeAt: { ...input.memory.lastSpokeAt, [speaker.name]: input.nowMs },
        lastSpokeVersion: { ...input.memory.lastSpokeVersion, [speaker.name]: input.version },
        linesThisRound: { ...input.memory.linesThisRound, [roundKey]: said + 1 },
      },
    };
  }
  return null;
}

/**
 * Фоновые реплики («в пустоту») в PHRASES не живут: они строго
 * персонифицированы и выбираются из характера бота внутри pickBotLine
 * (категория "idle"), вместе с общими кулдаунами и капом на год.
 */
