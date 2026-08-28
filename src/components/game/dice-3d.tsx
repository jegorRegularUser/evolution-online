import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * Настоящие 3D-кости на three.js: кувыркаются, пока идёт бросок, и плавно
 * ложатся гранью с выпавшим значением. Один canvas на набор кубиков,
 * поэтому сцена живёт только пока смонтирован компонент.
 *
 * Значение грани видно зрителю (камера смотрит с +z):
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
  spin: THREE.Vector3;
}

export function Dice3D({
  values,
  rolling,
  dieSize = 64,
  gap = 14,
  className,
  ariaLabel,
  tint = "#b4453a",
}: {
  /** Выпавшие значения; null — кубик ещё летит без значения. */
  values: Array<number | null>;
  /** Идёт бросок: кубики кувыркаются; false — ложатся на значения. */
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
  const rollingRef = useRef(rolling);
  const valuesRef = useRef(values);
  rollingRef.current = rolling;
  valuesRef.current = values;

  const n = Math.max(values.length, 1);
  const width = n * dieSize + (n - 1) * gap;
  const height = Math.round(dieSize * 1.45);
  const rollKey = values.map((v) => v ?? "?").join(",") + (rolling ? "|rolling" : "");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    // Сцена строится после загрузки бумаги; при сбое — с градиентным фолбэком.
    paperImage().then((paper) => {
      if (disposed || !canvasRef.current) return;
      cleanup = buildScene(canvasRef.current, paper, tint);
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
    // Пересоздаём сцену только на новый бросок или смену числа кубиков.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollKey, n, width, height, tint]);

  function buildScene(canvas: HTMLCanvasElement, paper: HTMLImageElement | null, tint: string) {
    // preserveDrawingBuffer — чтобы кубики попадали в скриншоты (QA, шеринг).
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 1.7, 5.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xfff6e6, 1.05));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(3, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9fb4c8, 0.55);
    fill.position.set(-4, 1.5, -2);
    scene.add(fill);

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
      mesh.position.x = (i - (diceCount - 1) / 2) * 1.75;
      scene.add(mesh);
      dice.push({
        mesh,
        spin: new THREE.Vector3(4 + Math.random() * 5, 5 + Math.random() * 5, 3 + Math.random() * 4),
      });
    }

    const targetOf = (value: number | null) => {
      if (!value) return null;
      const e = FACE_EULER[value] ?? FACE_EULER[3]!;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(e[0], e[1], e[2]));
    };

    // Новый бросок: каждый кубик стартует со случайной ориентации.
    for (const d of dice) {
      d.mesh.quaternion.setFromEuler(
        new THREE.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2),
      );
    }

    const delta = new THREE.Quaternion();
    const step = new THREE.Euler();
    const settle = 1 - Math.exp(-11 / 60);
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const vals = valuesRef.current;
      const isRolling = rollingRef.current;
      for (let i = 0; i < dice.length; i++) {
        const d = dice[i]!;
        const value = vals[i] ?? null;
        if (isRolling || !value) {
          step.set(d.spin.x * dt, d.spin.y * dt, d.spin.z * dt);
          delta.setFromEuler(step);
          d.mesh.quaternion.multiply(delta).normalize();
          d.mesh.position.y = Math.abs(Math.sin(now / 140 + i * 1.7)) * 0.22;
        } else {
          const target = targetOf(value);
          if (target) d.mesh.quaternion.slerp(target, settle);
          d.mesh.position.y += (0 - d.mesh.position.y) * settle;
        }
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      geometry.dispose();
      for (const m of materialsByValue.values()) {
        m.map?.dispose();
        m.dispose();
      }
      renderer.dispose();
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
