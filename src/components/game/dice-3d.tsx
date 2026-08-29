import { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * Настоящие 3D-кости с физикой (cannon-es): падают в лоток кормовой базы,
 * сталкиваются и сваливаются в кучку, а затем мягко перекатываются нужной
 * гранью кверху — значение задаёт движок партии, физика только «оживляет»
 * бросок. Пока значения нет, кубики вечно подбрасываются.
 *
 * Значение грани видно зрителю (камера смотрит сверху и спереди):
 * материалы BoxGeometry идут в порядке +x,−x,+y,−y,+z,−z — раскладываем
 * очки так, чтобы противоположные грани давали в сумме 7, как на настоящей кости.
 */
const FACE_BY_MATERIAL = [1, 6, 2, 5, 3, 4];

/** Поворот, которым грань со значением оказывается к зрителю. */
const FACE_EULER: Record<number, [number, number, number]> = {
  3: [0, 0, 0],
  4: [0, Math.PI, 0],
  1: [0, -Math.PI / 2, 0],
  6: [0, Math.PI / 2, 0],
  2: [Math.PI / 2, 0, 0],
  5: [-Math.PI / 2, 0, 0],
};

const PIPS: Record<number, Array<[number, number]>> = {
  1: [[0.5, 0.5]],
  2: [
    [0.3, 0.3],
    [0.7, 0.7],
  ],
  3: [
    [0.3, 0.3],
    [0.5, 0.5],
    [0.7, 0.7],
  ],
  4: [
    [0.3, 0.3],
    [0.7, 0.3],
    [0.3, 0.7],
    [0.7, 0.7],
  ],
  5: [
    [0.3, 0.3],
    [0.7, 0.3],
    [0.5, 0.5],
    [0.3, 0.7],
    [0.7, 0.7],
  ],
  6: [
    [0.3, 0.26],
    [0.7, 0.26],
    [0.3, 0.5],
    [0.7, 0.5],
    [0.3, 0.74],
    [0.7, 0.74],
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

/**
 * Грань кости: ровный тон цвета кормовой базы с лёгкой бумажной фактурой
 * поверх (текстура стола, но приглушённо — тон доминирует), виньетка к кромке
 * для объёма, очки — светлая кость с тёмной обводкой, как на окрашенной кости.
 */
function dieFaceTexture(value: number, paper: HTMLImageElement | null, tint: string): THREE.CanvasTexture {
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const r = 30;
  const roundPath = () => {
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(S, 0, S, S, r);
    ctx.arcTo(S, S, 0, S, r);
    ctx.arcTo(0, S, 0, 0, r);
    ctx.arcTo(0, 0, S, 0, r);
    ctx.closePath();
  };

  // Насыщенный тон с мягким световым градиентом — основа грани.
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, S, S);
  const light = ctx.createLinearGradient(0, 0, 0, S);
  light.addColorStop(0, "rgba(255,246,225,0.32)");
  light.addColorStop(0.5, "rgba(255,255,255,0)");
  light.addColorStop(1, "rgba(24,14,6,0.24)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, S, S);
  // Бумажная фактура стола поверх — приглушённо, чтобы не гасить тон.
  if (paper) {
    roundPath();
    ctx.save();
    ctx.clip();
    ctx.globalAlpha = 0.24;
    ctx.drawImage(paper, 0, 0, S, S);
    ctx.restore();
  }
  const vig = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S * 0.78);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(28,18,10,0.34)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, S, S);

  roundPath();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(35,24,15,0.5)";
  ctx.stroke();

  for (const [fx, fy] of PIPS[value] ?? []) {
    const x = fx * S;
    const y = fy * S;
    // Очки — кость с двойным контуром: тёмная кромка и внутренняя тень-блик.
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#f8f1de";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(30,20,12,0.6)";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - 4, y - 5, 11, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fill();
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
  const width = n * dieSize + (n - 1) * gap;
  const height = Math.round(dieSize * 1.6);
  // Ключ — только значения: сцена строится заново на новый бросок, а смена
  // rolling физику не перезапускает (доводка граней идёт своим чередом).
  const rollKey = values.map((v) => v ?? "?").join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    // Сцена строится после загрузки бумаги и следующего кадра — создание
    // WebGL-контекста и текстур не блокирует отрисовку хода партии.
    paperImage().then((paper) => {
      requestAnimationFrame(() => {
        if (disposed || !canvasRef.current) return;
        cleanup = buildScene(canvasRef.current, paper, tint);
      });
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollKey, n, width, height, tint]);

  function buildScene(canvas: HTMLCanvasElement, paper: HTMLImageElement | null, tint: string) {
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
    // одинакового размера в любой точке лотка, верхняя грань всегда читается.
    const aspect = width / height;
    const frustumH = 2.35;
    const frustumW = frustumH * aspect;
    const camera = new THREE.OrthographicCamera(-frustumW / 2, frustumW / 2, frustumH / 2, -frustumH / 2, 0.1, 50);
    camera.position.set(0, 4.6, 3.4);
    camera.lookAt(0, 0.3, 0);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xfff6e6, 0.95));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(3, 6, 2);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9fb4c8, 0.5);
    fill.position.set(-4, 2, -2);
    scene.add(fill);

    // Пол ловит только тень — фон канваса остаётся прозрачным.
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.32 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Физика: лоток с невидимыми бортами, кубики падают и кучкуются ──
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;
    const diceMaterial = new CANNON.Material("dice");
    const floorMaterial = new CANNON.Material("floor");
    world.addContactMaterial(
      new CANNON.ContactMaterial(floorMaterial, diceMaterial, { restitution: 0.32, friction: 0.5 }),
    );
    world.addContactMaterial(new CANNON.ContactMaterial(diceMaterial, diceMaterial, { restitution: 0.15, friction: 0.12 }));

    const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: floorMaterial });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    // Борта внутри кадра: кучка не расползается за края канваса.
    const wallX = Math.max(frustumW / 2 - 0.55, 1.0);
    const wallZ = 0.85;
    const wallShape = new CANNON.Box(new CANNON.Vec3(10, 2, 0.25));
    for (const [x, z, rz] of [
      [-wallX, 0, Math.PI / 2],
      [wallX, 0, Math.PI / 2],
      [0, -wallZ, 0],
      [0, wallZ, 0],
    ] as const) {
      const wall = new CANNON.Body({ mass: 0, shape: wallShape, material: floorMaterial });
      wall.position.set(x, 1, z);
      wall.quaternion.setFromEuler(0, 0, rz);
      world.addBody(wall);
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materialsByValue = new Map<number, THREE.MeshStandardMaterial>();
    const materialFor = (value: number) => {
      let m = materialsByValue.get(value);
      if (!m) {
        m = new THREE.MeshStandardMaterial({ map: dieFaceTexture(value, paper, tint), roughness: 0.38, metalness: 0.04 });
        materialsByValue.set(value, m);
      }
      return m;
    };

    const dice: Die[] = [];
    const diceCount = Math.max(valuesRef.current.length, 1);
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
        sleepSpeedLimit: 0.45,
        sleepTimeLimit: 0.4,
      });
      // Разбросанный спавн этажами над лотком — кубики прилетают не строем.
      body.position.set(
        (Math.random() * 2 - 1) * Math.max(wallX - 0.7, 0.3),
        1.6 + i * 0.8,
        (Math.random() * 2 - 1) * 0.4,
      );
      body.quaternion.setFromEuler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );
      body.velocity.set((Math.random() * 2 - 1) * 2, -2 - Math.random() * 2, (Math.random() * 2 - 1) * 2);
      body.angularVelocity.set(
        (Math.random() * 2 - 1) * 9,
        (Math.random() * 2 - 1) * 9,
        (Math.random() * 2 - 1) * 9,
      );
      world.addBody(body);
      dice.push({ mesh, body, target: null });
    }

    const targetOf = (value: number) => {
      const e = FACE_EULER[value] ?? FACE_EULER[3]!;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(e[0], e[1], e[2]));
    };

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let settleT = 0;
    let settled = false;
    let done = false;
    let nudgeAt = 0;

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
          d.mesh.position.copy(d.body.position as unknown as THREE.Vector3);
          d.mesh.quaternion.copy(d.body.quaternion as unknown as THREE.Quaternion);
        }
        const calm =
          elapsed > 0.35 &&
          dice.every((d) => d.body.sleepState === CANNON.Body.SLEEPING || d.body.velocity.lengthSquared() < 0.02);
        if (calm || elapsed > 2.2) {
          const vals = valuesRef.current;
          if (vals.length >= dice.length && vals.slice(0, dice.length).every((v) => v != null)) {
            // Значения известны — переходим к доводке граней.
            settled = true;
            settleT = 0;
            for (let i = 0; i < dice.length; i++) {
              dice[i]!.target = targetOf(vals[i] ?? 3);
            }
          } else if (elapsed - nudgeAt > 0.9) {
            // Бросок ещё идёт — подбрасываем снова.
            nudgeAt = elapsed;
            for (const d of dice) {
              d.body.wakeUp();
              d.body.velocity.set((Math.random() * 2 - 1) * 1.6, 3 + Math.random() * 2, (Math.random() * 2 - 1) * 1.6);
              d.body.angularVelocity.set(
                (Math.random() * 2 - 1) * 8,
                (Math.random() * 2 - 1) * 8,
                (Math.random() * 2 - 1) * 8,
              );
            }
          }
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
        return;
      }

      // Фаза 2 — доводка: кубик приподнимается и перекатывается нужной гранью
      // кверху, занимая место в кучке. Горизонтальные позиции сохраняются.
      if (!done) {
        settleT += dt;
        const p = Math.min(settleT / 0.45, 1);
        for (const d of dice) {
          if (!d.target) continue;
          d.mesh.quaternion.slerp(d.target, Math.min(1, dt * 10));
          const lift = 0.3 * Math.sin(Math.PI * p);
          const targetY = 0.5 + lift;
          d.mesh.position.y += (targetY - d.mesh.position.y) * Math.min(1, dt * 14);
        }
        if (p >= 1) {
          done = true;
          for (const d of dice) {
            if (!d.target) continue;
            d.mesh.quaternion.copy(d.target);
            d.mesh.position.y = 0.5;
          }
          renderer.render(scene, camera);
          raf = 0;
          return;
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      }
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
