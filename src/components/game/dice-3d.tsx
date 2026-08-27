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

/** Грань кости: пергамент с кромкой и очками тушью (в стиле стола). */
function dieFaceTexture(value: number): THREE.CanvasTexture {
  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const r = 18;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(S, 0, S, S, r);
  ctx.arcTo(S, S, 0, S, r);
  ctx.arcTo(0, S, 0, 0, r);
  ctx.arcTo(0, 0, S, 0, r);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, "#faf4e4");
  grad.addColorStop(1, "#e7ddc4");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(58,48,32,0.35)";
  ctx.stroke();
  for (const [fx, fy] of PIPS[value] ?? []) {
    const x = fx * S;
    const y = fy * S;
    const pip = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 11);
    pip.addColorStop(0, "#4a4234");
    pip.addColorStop(1, "#211c14");
    ctx.fillStyle = pip;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
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

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 50);
    camera.position.set(0, 1.9, 6.6);
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
        m = new THREE.MeshStandardMaterial({ map: dieFaceTexture(value), roughness: 0.38, metalness: 0.04 });
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
    // Пересоздаём сцену только на новый бросок или смену числа кубиков.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollKey, n, width, height]);

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
