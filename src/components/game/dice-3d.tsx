import { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { cn } from "@/lib/utils";

/**
 * Настоящие 3D-кости с физикой (cannon-es): падают в лоток кормовой базы,
 * сталкиваются и сваливаются в кучку, а затем доворачиваются выпавшей гранью
 * кверху — значения задаёт движок партии, физика только «оживляет» бросок.
 * Пока значения нет, кубики спокойно лежат: без подпрыгиваний и дрожи.
 *
 * Оформление — «родственник» фишек еды (FoodCube в icons.tsx): тот же красный
 * тон кормовой базы, светлая кромка-фаска по ребру и тёплая кость очков.
 * Значение читается по ВЕРХНЕЙ грани, как у настоящей кости на столе.
 */

/** Значение грани для материала BoxGeometry: +x, −x, +y, −y, +z, −z. */
const FACE_BY_MATERIAL = [1, 6, 2, 5, 3, 4] as const;

/** Нормаль грани со значением в системе кубика (та же раскладка, что выше). */
const FACE_NORMAL: Record<number, readonly [number, number, number]> = {
  1: [1, 0, 0],
  6: [-1, 0, 0],
  2: [0, 1, 0],
  5: [0, -1, 0],
  3: [0, 0, 1],
  4: [0, 0, -1],
};

const UP = new THREE.Vector3(0, 1, 0);
const TAU = Math.PI * 2;

/**
 * Грань кости рисуется в canvas 512×512. Кромка (внешние ~5.5% — ровно доля
 * скругления геометрии) — «фаска»: светлая сверху-слева, тёмная снизу-справа,
 * как светлое ребро фишек еды. Середина грани — плита с бумажной фактурой.
 */
const FACE_PX = 512;
const PLATE_INSET = 0.055;
/** Радиус очка в долях грани: как у настоящей кости, с зазором между рядами. */
const PIP_R = 0.088;
/** Центры очков в долях грани (0…1). Ряды через 0.22–0.25 — точки не слипаются. */
const PIP_LAYOUT: Record<number, ReadonlyArray<readonly [number, number]>> = {
  1: [[0.5, 0.5]],
  2: [
    [0.28, 0.28],
    [0.72, 0.72],
  ],
  3: [
    [0.28, 0.28],
    [0.5, 0.5],
    [0.72, 0.72],
  ],
  4: [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
  5: [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.5, 0.5],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
  6: [
    [0.3, 0.25],
    [0.7, 0.25],
    [0.3, 0.5],
    [0.7, 0.5],
    [0.3, 0.75],
    [0.7, 0.75],
  ],
};

/** Бумага граней — тот же лист, что лежит под игровым столом. */
const PAPER_SRC = "/img/bg/texture-paper.jpg";
let paperCache: Promise<HTMLImageElement | null> | null = null;
function paperImage(): Promise<HTMLImageElement | null> {
  paperCache ??= new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = PAPER_SRC;
  });
  return paperCache;
}

/** Прямоугольник со скруглёнными углами (arcTo — без опоры на ctx.roundRect). */
function roundedPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/**
 * Очко-углубление: тень вокруг, тёплая кость со скошенной в тень верхней
 * стенкой, тёмная кромка отверстия и блик на нижней стенке. Так точка
 * читается как выбранная в кости, а не как наклейка.
 */
function drawPip(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const hole = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.5);
  hole.addColorStop(0, "rgba(34,18,10,0)");
  hole.addColorStop(0.5, "rgba(34,18,10,0.3)");
  hole.addColorStop(1, "rgba(34,18,10,0)");
  ctx.fillStyle = hole;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.5, 0, TAU);
  ctx.fill();

  const bone = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  bone.addColorStop(0, "#c6b795");
  bone.addColorStop(0.45, "#f1e7cf");
  bone.addColorStop(1, "#fffaf0");
  ctx.fillStyle = bone;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.fill();

  ctx.lineWidth = Math.max(1.5, r * 0.16);
  ctx.strokeStyle = "rgba(46,26,14,0.55)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.stroke();

  // Блик на нижней (освещённой) стенке углубления.
  ctx.beginPath();
  ctx.arc(cx + r * 0.16, cy + r * 0.18, r * 0.66, Math.PI * 0.12, Math.PI * 0.88);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = Math.max(1.5, r * 0.24);
  ctx.lineCap = "round";
  ctx.stroke();
}

/**
 * Грань кости: фаска по ребру, плита в тон кормовой базы с бумажной фактурой,
 * объёмным светом от верхнего левого угла и очками-углублениями.
 */
function dieFaceTexture(value: number, paper: HTMLImageElement | null, tint: string): THREE.CanvasTexture {
  const S = FACE_PX;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  // Фаска по всему квадрату: скруглённое ребро кубика ловит свет.
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, S, S);
  const bevel = ctx.createLinearGradient(0, 0, S, S);
  bevel.addColorStop(0, "rgba(255,247,228,0.62)");
  bevel.addColorStop(0.3, "rgba(255,247,228,0.1)");
  bevel.addColorStop(0.7, "rgba(26,12,6,0.12)");
  bevel.addColorStop(1, "rgba(26,12,6,0.5)");
  ctx.fillStyle = bevel;
  ctx.fillRect(0, 0, S, S);

  // Плита грани — плоская часть: тон базы, объём, бумага.
  const inset = S * PLATE_INSET;
  const plate = S - inset * 2;
  const radius = S * 0.16;
  ctx.save();
  roundedPath(ctx, inset, inset, plate, plate, radius);
  ctx.clip();
  ctx.fillStyle = tint;
  ctx.fillRect(inset, inset, plate, plate);
  const dome = ctx.createRadialGradient(S * 0.34, S * 0.3, S * 0.04, S * 0.5, S * 0.52, S * 0.8);
  dome.addColorStop(0, "rgba(255,246,226,0.38)");
  dome.addColorStop(0.55, "rgba(255,255,255,0)");
  dome.addColorStop(1, "rgba(28,16,8,0.3)");
  ctx.fillStyle = dome;
  ctx.fillRect(inset, inset, plate, plate);
  if (paper) {
    ctx.globalAlpha = 0.22;
    ctx.drawImage(paper, inset, inset, plate, plate);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  // Кромка плиты: тёмная линия отделяет площадку от фаски.
  roundedPath(ctx, inset, inset, plate, plate, radius);
  ctx.lineWidth = S * 0.011;
  ctx.strokeStyle = "rgba(40,22,12,0.34)";
  ctx.stroke();

  for (const [fx, fy] of PIP_LAYOUT[value] ?? PIP_LAYOUT[1]!) {
    drawPip(ctx, fx * S, fy * S, PIP_R * S);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface Die {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  /** Целевой кватернион «нужная грань кверху»; null — значение ещё неизвестно. */
  target: THREE.Quaternion | null;
  /** Высота покоя: доводка приподнимает кубик над ней, но не «топит» в полу. */
  restY: number;
}

/** Детерминированный ГПСЧ: один и тот же бросок выглядит одинаково. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function Dice3D({
  values,
  dieSize = 64,
  gap = 14,
  className,
  ariaLabel,
  tint = "#b4453a",
}: {
  /** Выпавшие значения; null — кубик ещё летит без значения. */
  values: Array<number | null>;
  /** Идёт бросок. Физика сама проходит фазы, поэтому не влияет на сцену —
   * проп оставлен для совместимости вызовов. */
  rolling?: boolean;
  /** Размер одного кубика в пикселях CSS. */
  dieSize?: number;
  gap?: number;
  className?: string;
  ariaLabel?: string;
  /** Цвет граней (по умолчанию — красный кормовой базы); бумага тонируется им целиком. */
  tint?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const n = Math.max(values.length, 1);
  // Минимальная ширина лотка даже для одного кубика: кадр обязан быть шире
  // кубика «на углу» (полу-описанная окружность ~0.87 юнита) с тенью —
  // иначе кучка упирается в край канваса.
  const width = Math.max(n * dieSize + (n - 1) * gap, Math.round(dieSize * 2.3));
  const height = Math.round(dieSize * 1.6);
  // Ключ — только значения: сцена строится заново на новый бросок, а смена
  // rolling физику не перезапускает (доводка граней идёт своим чередом).
  const rollKey = values.map((v) => v ?? "?").join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    // Бросок начинается, только когда лоток реально виден: иначе анимация
    // проигрывается за экраном (правила, мобильный скролл) и к пользователю
    // кубики приезжают уже лежащими — выглядит как «анимации сломаны».
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // Сцена строится после загрузки бумаги и следующего кадра — создание
        // WebGL-контекста и текстур не блокирует отрисовку хода партии.
        paperImage().then((paper) => {
          requestAnimationFrame(() => {
            if (disposed || !canvasRef.current) return;
            cleanup = buildScene(canvasRef.current, paper, tint, rollKey);
          });
        });
      },
      { threshold: 0.2 },
    );
    io.observe(canvas);
    return () => {
      disposed = true;
      io.disconnect();
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollKey, n, width, height, tint]);

  function buildScene(canvas: HTMLCanvasElement, paper: HTMLImageElement | null, tint: string, seed: string) {
    // preserveDrawingBuffer — чтобы кубики попадали в скриншоты (QA, шеринг).
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Тени перерисовываем только пока идёт физика: после укладки кучки
    // карта теней замораживается — рендер стоит копейки.
    renderer.shadowMap.autoUpdate = false;

    // Ортографическая камера с наклоном сверху: «настольный» вид, кубики
    // одинакового размера в любой точке лотка. Наклон круче прежнего — верхняя
    // грань со значением читается, а над задним бортом остаётся место для
    // кубика «на углу» (иначе задняя грань уходила за кадр).
    const aspect = width / height;
    // Запас по высоте кадра: кубик у заднего борта не должен срезаться сверху.
    const frustumH = 2.85;
    const frustumW = frustumH * aspect;
    const camera = new THREE.OrthographicCamera(-frustumW / 2, frustumW / 2, frustumH / 2, -frustumH / 2, 0.1, 60);
    camera.position.set(0, 5.6, 3.0);
    // Смотрим чуть ниже центра кубика: над задним бортом остаётся запас кадра,
    // чтобы лежащий у борта кубик не срезался верхним краем канваса.
    camera.lookAt(0, 0.42, 0);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xfff4e4, 0.5));
    scene.add(new THREE.HemisphereLight(0xfff8ec, 0x4a3a2c, 0.6));
    const key = new THREE.DirectionalLight(0xfff3df, 1.55);
    // Свет высокий и почти отвесный: тени короткие и не вылезают за кадр.
    key.position.set(2.2, 8, 2.4);
    key.castShadow = true;
    key.shadow.mapSize.set(768, 768);
    key.shadow.camera.left = -3.6;
    key.shadow.camera.right = 3.6;
    key.shadow.camera.top = 3.6;
    key.shadow.camera.bottom = -3.6;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 24;
    // Смещение по нормали убирает самозатенение граней (акне) на кубике.
    key.shadow.normalBias = 0.02;
    key.shadow.camera.updateProjectionMatrix();
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa9c0d6, 0.32);
    fill.position.set(-4, 2.4, -2.6);
    scene.add(fill);
    // Тёплый контровой свет спереди-слева: подсвечивает передние грани и
    // даёт лёгкий блик, как светлое ребро фишек еды.
    const rim = new THREE.DirectionalLight(0xffe6c2, 0.4);
    rim.position.set(-2.4, 1.8, 4.2);
    scene.add(rim);

    // Пол ловит только тень — фон канваса остаётся прозрачным.
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.3 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Физика: лоток с невидимыми бортами, кубики падают и кучкуются ──
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });
    world.broadphase = new CANNON.SAPBroadphase(world);
    // Решатель по умолчанию — GSSolver; больше итераций = меньше продавливания
    // кубиков друг в друга в кучке.
    if (world.solver instanceof CANNON.GSSolver) world.solver.iterations = 12;
    world.allowSleep = true;
    const diceMaterial = new CANNON.Material("dice");
    const floorMaterial = new CANNON.Material("floor");
    world.addContactMaterial(
      // Трение о дно большое, отскок слабый: кубик садится и не скачет.
      new CANNON.ContactMaterial(floorMaterial, diceMaterial, { restitution: 0.12, friction: 0.62 }),
    );
    world.addContactMaterial(new CANNON.ContactMaterial(diceMaterial, diceMaterial, { restitution: 0.06, friction: 0.25 }));

    const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: floorMaterial });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    const diceCount = Math.max(valuesRef.current.length, 1);
    // Коридор лотка: кубик должен свободно лежать «на углу» (полудиагональ
    // 0.707), поэтому минимум 0.95 от центра, а не впритык к полукубу:
    // в тесном лотке кубики заклинивало между бортами и они дрожали.
    // Сверху коридор ограничен, чтобы кучка не расползалась по кадру.
    const wallX = Math.max(Math.min(frustumW / 2 - 0.68, 0.66 * n - 0.02), 0.95);
    // По глубине коридор ограничен кадром: у заднего борта кубик «на углу»
    // не должен уходить за верхний край.
    const wallZ = 0.86;
    // Борта — плоскости-полупространства, а не тонкие боксы: столкновение
    // «плоскость × бокс» решается устойчиво и кубик не может ни застрять
    // в борту, ни проскочить сквозь него.
    for (const [normal, point] of [
      [new CANNON.Vec3(1, 0, 0), new CANNON.Vec3(-wallX, 0, 0)],
      [new CANNON.Vec3(-1, 0, 0), new CANNON.Vec3(wallX, 0, 0)],
      [new CANNON.Vec3(0, 0, 1), new CANNON.Vec3(0, 0, -wallZ)],
      [new CANNON.Vec3(0, 0, -1), new CANNON.Vec3(0, 0, wallZ)],
    ]) {
      const wall = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: floorMaterial });
      wall.quaternion.setFromVectors(new CANNON.Vec3(0, 0, 1), normal);
      wall.position.copy(point);
      world.addBody(wall);
    }

    // Скруглённый куб: рёбра ловят свет, силуэт читается как у настоящей кости.
    const geometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.07);
    const materialsByValue = new Map<number, THREE.MeshPhysicalMaterial>();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const materialFor = (value: number) => {
      let m = materialsByValue.get(value);
      if (!m) {
        const map = dieFaceTexture(value, paper, tint);
        map.anisotropy = Math.min(4, maxAniso);
        m = new THREE.MeshPhysicalMaterial({
          map,
          // Лёгкий лак поверх краски: мягкий блик на фаске и верхней грани.
          roughness: 0.42,
          metalness: 0,
          clearcoat: 0.3,
          clearcoatRoughness: 0.55,
        });
        materialsByValue.set(value, m);
      }
      return m;
    };

    const rand = mulberry32(seedFrom(seed));
    const dice: Die[] = [];
    for (let i = 0; i < diceCount; i++) {
      const materials = FACE_BY_MATERIAL.map((v) => materialFor(v));
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        material: diceMaterial,
        // Кубики засыпают охотно: без этого дрожат на полу и доводка граней
        // начинается только по таймауту — бросок «зависает».
        sleepSpeedLimit: 0.2,
        sleepTimeLimit: 0.2,
      });
      // Затухание гасит остаточное качение: после остановки кубик не ёрзает.
      body.linearDamping = 0.15;
      body.angularDamping = 0.25;
      // Спокойный подброс: кубики падают с небольшой высоты почти плашмя и
      // лишь слегка перекатываются. Из-за прежнего разгона кубики бились
      // друг о друга, застревали в бортах и «выдавливались» из лотка.
      // Дорожки разнесены (кубик не может лечь на соседа), высоты — лесенкой.
      const tilt = () => (rand() * 2 - 1) * 0.18;
      // Разворот вокруг вертикали кратен 90°: угол «на угол» (45°) раздувает
      // пятно кубика до 0.71 полуширины, и угол застревает в борту — кубик
      // зависает в воздухе, приклеенный трением к невидимой стене.
      const yaw = Math.floor(rand() * 4) * (Math.PI / 2) + (rand() - 0.5) * 0.12;
      const laneStep = diceCount === 1 ? 0 : Math.min(1.2, Math.max(wallX - 0.62, 0.5) * 2);
      const lane = (i - (diceCount - 1) / 2) * laneStep;
      body.position.set(lane + (rand() * 2 - 1) * 0.05, 0.72 + i * 0.42, (rand() * 2 - 1) * 0.15);
      body.quaternion.setFromEuler(tilt(), yaw, tilt());
      body.velocity.set((rand() * 2 - 1) * 0.2, -0.6 - rand() * 0.4, (rand() * 2 - 1) * 0.2);
      body.angularVelocity.set((rand() * 2 - 1) * 1.2, (rand() * 2 - 1) * 1.2, (rand() * 2 - 1) * 1.2);
      world.addBody(body);
      dice.push({ mesh, body, target: null, restY: 0.5 });
    }

    /** Страховка: тело, вылетевшее из лотка (не должно случаться), возвращаем. */
    const keepInside = (d: Die) => {
      const p = d.body.position;
      if (p.y > 3.2 || p.y < -1 || Math.abs(p.x) > wallX + 0.6 || Math.abs(p.z) > wallZ + 0.6) {
        p.set(0, 1.3, 0);
        d.body.quaternion.set(0, 0, 0, 1);
        d.body.velocity.setZero();
        d.body.angularVelocity.setZero();
      }
    };

    const targetOf = (value: number, index: number) => {
      const nrm = FACE_NORMAL[value] ?? FACE_NORMAL[3]!;
      const align = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(nrm[0], nrm[1], nrm[2]), UP);
      // Небольшой поворот вокруг вертикали: кубики лежат «по-живому», а
      // значение всё равно смотрит вверх. Угол маленький: при наклонной камере
      // сильный поворот читается как «кубик стоит криво».
      const yaw = ((((value * 7 + index * 5) % 9) / 9) * 2 - 1) * 0.13;
      return new THREE.Quaternion().setFromAxisAngle(UP, yaw).multiply(align);
    };

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let settleT = 0;
    let settled = false;
    let done = false;
    /** Сколько секунд подряд кучка стоит почти неподвижно. */
    let quiet = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      // Пока кубики движутся — тени живые; после укладки карта замораживается.
      if (!done) renderer.shadowMap.needsUpdate = true;

      // Фаза 1 — физика: падение, столкновения, кучкование.
      if (!settled) {
        world.step(1 / 60, dt, 3);
        for (const d of dice) {
          keepInside(d);
          d.mesh.position.copy(d.body.position as unknown as THREE.Vector3);
          d.mesh.quaternion.copy(d.body.quaternion as unknown as THREE.Quaternion);
        }
        const vals = valuesRef.current;
        const valsReady = vals.length >= dice.length && vals.slice(0, dice.length).every((v) => v != null);
        // «Спокойно» — не мгновенная тишина (на ребре кубик на миг
        // останавливается и сразу заваливается), а 0.22 с непрерывного покоя:
        // иначе доводка замораживала кубик стоящим на ребре.
        const calmNow = dice.every(
          (d) =>
            d.body.sleepState === CANNON.Body.SLEEPING ||
            (d.body.velocity.lengthSquared() < 0.2 && d.body.angularVelocity.lengthSquared() < 0.7),
        );
        quiet = calmNow ? quiet + dt : 0;
        const calm = elapsed > 0.25 && quiet > 0.22;
        if (valsReady && (calm || elapsed > 1.5)) {
          settled = true;
          settleT = 0;
          for (let i = 0; i < dice.length; i++) {
            dice[i]!.target = targetOf(vals[i] ?? 3, i);
            // Если кубик замер чуть выше пола (остановился на ребре, не успев
            // завалиться), доводка кладёт его плашмя на пол. Кубик, лежащий
            // на другом кубике, остаётся на своей высоте.
            const y = dice[i]!.mesh.position.y;
            dice[i]!.restY = y > 0.5 && y < 0.8 ? 0.5 : y;
          }
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
        return;
      }

      // Фаза 2 — доводка: кубик мягко приподнимается и доворачивается нужной
      // гранью кверху, оставаясь на месте в кучке. Горизонтальные позиции и
      // высота покоя — от физики, так что кучка сохраняется.
      settleT += dt;
      const p = Math.min(settleT / 0.32, 1);
      const lift = 0.22 * Math.sin(Math.PI * p);
      for (const d of dice) {
        if (!d.target) continue;
        d.mesh.quaternion.slerp(d.target, Math.min(1, dt * 13));
        const targetY = d.restY + lift;
        d.mesh.position.y += (targetY - d.mesh.position.y) * Math.min(1, dt * 16);
      }
      if (p >= 1) {
        done = true;
        for (const d of dice) {
          if (!d.target) continue;
          d.mesh.quaternion.copy(d.target);
          d.mesh.position.y = d.restY;
        }
        renderer.render(scene, camera);
        raf = 0;
        return;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      geometry.dispose();
      for (const m of materialsByValue.values()) {
        m.map?.dispose();
        m.dispose();
      }
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      // Отдаём контекст браузеру только когда канвас реально уходит из DOM:
      // без этого каждый бросок кубиков оставляет живой контекст и после ~16
      // Chrome теряет самые старые. Но в dev StrictMode эффекты прогоняются
      // дважды на живом канвасе — потеря контекста сломала бы второй прогон.
      if (!canvas.isConnected) renderer.forceContextLoss();
    };
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel ?? "Игральные кости"}
      style={{ width, height, display: "block" }}
      className={cn(className)}
    />
  );
}
