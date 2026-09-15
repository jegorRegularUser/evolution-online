import type { FloraKind, PlantKind, TraitId } from "@/game/types";
import { cn } from "@/lib/utils";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function TraitGlyph({ id, className }: { id: TraitId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden>
      {glyph(id)}
    </svg>
  );
}

function glyph(id: TraitId) {
  switch (id) {
    case "carnivore":
      return <path {...stroke} d="M4 14c2-6 6-8 8-8s6 2 8 8M7 14l2 4 3-6 3 6 2-4" />;
    case "swimming":
      return <path {...stroke} d="M4 12c4-6 8-6 16 0-8 6-12 6-16 0Zm8 0h.01M17 8c1 1 2 3 2 4" />;
    case "camouflage":
      return (
        <>
          <circle cx="9" cy="12" r="4" {...stroke} />
          <circle cx="15" cy="12" r="4" {...stroke} />
        </>
      );
    case "sharpVision":
      return (
        <>
          <path {...stroke} d="M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z" />
          <circle cx="12" cy="12" r="2.2" {...stroke} />
        </>
      );
    case "burrowing":
      return <path {...stroke} d="M4 16c4-8 12-8 16 0M8 16v-3m4 3v-5m4 5v-3" />;
    case "scavenger":
      return <path {...stroke} d="M5 16c2-8 12-8 14 0M9 10l-2-4m8 4 2-4M12 16v-3" />;
    case "symbiosis":
      return (
        <>
          <circle cx="9" cy="12" r="3.5" {...stroke} />
          <circle cx="15" cy="12" r="3.5" {...stroke} />
        </>
      );
    case "piracy":
      return <path {...stroke} d="M5 18 12 5l7 13M8 13h8" />;
    case "tailLoss":
      return <path {...stroke} d="M5 16c6-1 7-8 12-10M15 6l3 1-1 3" />;
    case "grazing":
      return <path {...stroke} d="M5 17h14M7 17c0-6 3-9 5-9s5 3 5 9M12 8V5" />;
    case "cooperation":
      return <path {...stroke} d="M8 10v6m8-6v6M6 14h4m4 0h4M10 12h4" />;
    case "running":
      return <path {...stroke} d="M6 17l3-6 4 3 5-7M14 7h4v4" />;
    case "highBodyWeight":
      return <path {...stroke} d="M5 16h14l-2-8H7l-2 8Zm3-8 1-3h6l1 3" />;
    case "parasite":
      return <path {...stroke} d="M12 4v6m0 0c-3 0-5 2-5 5v5m5-10c3 0 5 2 5 5v5" />;
    case "fatTissue":
      return <path {...stroke} d="M7 15c0-5 2.5-8 5-8s5 3 5 8-2 5-5 5-5-1-5-5Z" />;
    case "communication":
      return <path {...stroke} d="M5 12h3l2-4 4 8 2-4h3" />;
    case "poisonous":
      return <path {...stroke} d="M12 4c3 4 5 7 5 10a5 5 0 1 1-10 0c0-3 2-6 5-10Z" />;
    case "hibernation":
      return <path {...stroke} d="M12 4v2M7 7l1.5 1.5M17 7l-1.5 1.5M6 14a6 6 0 0 0 12 0c0-4-6-6-6-6s-6 2-6 6Z" />;
    case "mimicry":
      return (
        <>
          <rect x="4" y="7" width="8" height="10" rx="1" {...stroke} />
          <rect x="12" y="7" width="8" height="10" rx="1" opacity={0.6} {...stroke} />
        </>
      );
    // ── Континенты ──
    case "migration":
      return <path {...stroke} d="M4 16c3-2 5-8 9-8m0 0h-4m4 0v4M17 6c2 2 3 4 3 6s-1 4-3 6" />;
    case "remora":
      return <path {...stroke} d="M6 12c4-4 10-4 13 0-3 4-9 4-13 0Zm11 0h.01" />;
    case "herding":
      return (
        <>
          <circle cx="7" cy="14" r="2.2" {...stroke} />
          <circle cx="12" cy="14" r="2.2" {...stroke} />
          <circle cx="17" cy="14" r="2.2" {...stroke} />
        </>
      );
    case "nematocysts":
      return <path {...stroke} d="M7 18V9m0 0L5 5m2 4 2-4m0 13V9m5 9V9m0 0-2-4m2 4 2-4" />;
    case "regeneration":
      return <path {...stroke} d="M19 12a7 7 0 1 1-3-5.7M19 4v4h-4" />;
    case "recombination":
      return <path {...stroke} d="M8 5v14m8-14v14M6 8h4m4 0h4M6 16h4m4 0h4" />;
    case "edificator":
      return <path {...stroke} d="M6 20v-7l6-5 6 5v7M10 20v-5h4v5" />;
    case "neoplasia":
      return (
        <>
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path {...stroke} d="M12 4v3m0 10v3M4 12h3m10 0h3M6.6 6.6l2.1 2.1m6.6 6.6 2.1 2.1m0-10.8-2.1 2.1M8.7 15.3l-2.1 2.1" />
        </>
      );
    // ── Растения: свойства растений ──
    case "plantWater":
      return (
        <>
          <path {...stroke} d="M4 16c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0" />
          <path {...stroke} d="M12 13c-1-3 .5-6 3-7-.4 3-1.2 5.5-3 7Z" />
        </>
      );
    case "thorny":
      return <path {...stroke} d="M5 18c3-4 3-8 1-11m0 0 3 2M6 7l-2.6.8M9 13l3-1m-3 5 3 .5M9 14l-2.6 1.4M13 12c0-4 2-6 5-7-1 4-2.4 6.5-5 7Z" />;
    case "rootVegetable":
      return (
        <>
          <path {...stroke} d="M9 12c0 5 1.5 8 3 8s3-3 3-8" />
          <path {...stroke} d="M12 12V7m0 0c-2 0-3-1-3-3m3 3c2 0 3-1 3-3" />
        </>
      );
    case "medicinal":
      return (
        <>
          <path {...stroke} d="M12 20c-4 0-6-2-6-6 0-4 3-9 6-10 3 1 6 6 6 10 0 4-2 6-6 6Z" />
          <path {...stroke} d="M12 8v6M9 11h6" />
        </>
      );
    case "plantParasite":
      return (
        <>
          <path {...stroke} d="M6 20V10m0 0c0-3 2-5 5-5m0 0v10" />
          <path {...stroke} d="M14 5h4m-4 0V1m4 4v4" />
        </>
      );
    case "micorrhiza":
      return (
        <>
          <path {...stroke} d="M7 20v-6m0 0c-2 0-3-2-3-4m3 4c2 0 3-2 3-4M17 20v-6m0 0c-2 0-3-2-3-4m3 4c2 0 3-2 3-4" />
          <path {...stroke} d="M8 20h3m2 0h3M5 20c4 2 10 2 14 0" />
        </>
      );
    case "tree":
      return (
        <>
          <path {...stroke} d="M12 21v-7" />
          <circle cx="12" cy="9" r="5" {...stroke} />
          <path {...stroke} d="M12 4V2m-7 7H3m18 0h-2" />
        </>
      );
    case "nutritious":
      return (
        <>
          <circle cx="12" cy="14" r="6" {...stroke} />
          <path {...stroke} d="M12 8c0-2 1-3 3-4M9 13l2 2 4-4" />
        </>
      );
    case "honeyPlant":
      return (
        <>
          <circle cx="12" cy="8" r="3" {...stroke} />
          <path {...stroke} d="M12 11v6m0 0c-3 0-5-1-6-3m6 3c3 0 5-1 6-3M9 8H7m10 0h-2" />
          <path {...stroke} d="M17 3c1 1 1.5 2 1.5 3" />
        </>
      );
    // ── Трава и грибы: свойства животных ──
    case "transparent":
      return (
        <>
          <path {...stroke} d="M8 4h8l3 4-7 12L5 8l3-4Z" />
          <path {...stroke} d="M8 4l4 8 4-8M12 12l3 0" opacity={0.55} />
        </>
      );
    case "insectivore":
      return (
        <>
          <ellipse cx="12" cy="14" r="4.5" ry="5.5" {...stroke} />
          <path {...stroke} d="M12 8.5V6m0 0c-2 0-3-1-3-2.5M12 6c2 0 3-1 3-2.5M7.5 12H4m16 0h-3.5M8.5 17l-2.5 2m10-2 2.5 2" />
        </>
      );
    // ── Случайные мутации ──
    case "obligateCarnivore":
      return (
        <>
          <path {...stroke} d="M4 13c2-6 6-8 8-8s6 2 8 8M7 13l2 4 3-6 3 6 2-4" />
          <circle cx="12" cy="13" r="1.4" />
        </>
      );
    case "budding":
      return (
        <>
          <circle cx="10" cy="13" r="5" {...stroke} />
          <circle cx="16.5" cy="8.5" r="2.6" {...stroke} />
          <path {...stroke} d="M13.8 10.6 15 9.4" />
        </>
      );
    case "metabolicSyndrome":
      return (
        <>
          <path {...stroke} d="M13 3 6 13h5l-1 8 8-11h-5l1-7Z" />
        </>
      );
    case "barkBeetle":
      return (
        <>
          <ellipse cx="12" cy="13" rx="4.5" ry="6" {...stroke} />
          <path {...stroke} d="M7.5 11c1.5 1 1.5 3 0 4m9-4c-1.5 1-1.5 3 0 4M12 7v12" opacity={0.55} />
          <path {...stroke} d="M9 5.5 7 3m8 2.5L17 3" />
        </>
      );
    case "extremophile":
      return (
        <>
          <path {...stroke} d="M4 16c2 1 4 1 6 0m4 0c2 1 4 1 6 0" />
          <path {...stroke} d="M8 13c1-4 3-6 4-8 1 2 3 4 4 8" />
          <path {...stroke} d="M9 19h6" />
        </>
      );
    case "developmentDefects":
      return (
        <>
          <circle cx="12" cy="12" r="7" {...stroke} />
          <path {...stroke} d="M5.8 8.5 18.2 15.5M8.5 5.8l7 12.4" opacity={0.55} />
        </>
      );
    case "simplification":
      return (
        <>
          <path {...stroke} d="M14 4 8 12h4l-2 8 8-10h-5l1-6Z" opacity={0.55} />
          <path {...stroke} d="M4 4v6m0 0 3-3M4 10 1 7" />
        </>
      );
    default:
      return <circle cx="12" cy="12" r="6" {...stroke} />;
  }
}

/** Глиф карты флоры «Травы и грибов»: гриб или травинка. */
export function FloraGlyph({ kind, className }: { kind: FloraKind; className?: string }) {
  const fungus = kind === "toadstool" || kind === "mold" || kind === "madCap" || kind === "flyAgaric" || kind === "insight" || kind === "soaring";
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden>
      {fungus ? (
        <path {...stroke} d="M4 11c0-4 3.6-7 8-7s8 3 8 7c0 .8-.6 1.4-1.4 1.2A16 16 0 0 0 12 11c-2.3 0-4.5.4-6.6 1.2C4.6 12.4 4 11.8 4 11Zm3 2.4 1.6 6.2c.1.5.6.9 1.1.9h4.6c.5 0 1-.4 1.1-.9l1.6-6.2" />
      ) : (
        <path {...stroke} d="M12 21c-1-4-1-8 0-12m0 0c-3 0-5-1.5-5-4 3 0 4.7 1.2 5 3.5M12 9c3 0 5-1.5 5-4-3 0-4.7 1.2-5 3.5M12 15c-2 0-3.5-1-4-3 2.2-.4 3.6.6 4 3Zm0 0c2 0 3.5-1 4-3-2.2-.4-3.6.6-4 3Z" />
      )}
    </svg>
  );
}

/**
 * Кубик-фишка еды (как в настольной игре): изометрический куб с тремя
 * видимыми гранями разной яркости — верхняя со световым бликом и светлым
 * ребром, чтобы фишка читалась объёмной даже в 14 пикселях. Красный — еда
 * из кормовой базы, синий — от свойств (охота, сотрудничество…), жёлтый —
 * жир, зелёный — еда растений.
 */
const CUBE_TONES = {
  red: ["#e0685a", "#b23c2d", "#8c2f22"],
  blue: ["#6ca6cf", "#3f7199", "#30587a"],
  yellow: ["#eec871", "#bb923c", "#96762e"],
  green: ["#90c173", "#5e9043", "#4a7635"],
} as const;

export function FoodCube({
  tone,
  className,
  title,
}: {
  tone: keyof typeof CUBE_TONES;
  className?: string;
  title?: string;
}) {
  const [top, left, right] = CUBE_TONES[tone];
  const edge = "rgba(18,14,8,0.45)";
  return (
    <svg
      viewBox="0 0 20 21"
      className={cn("shrink-0", className)}
      aria-hidden={!title}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      <g stroke={edge} strokeWidth="0.6" strokeLinejoin="round">
        <polygon points="1,6.2 10,11.4 10,20.6 1,15.4" fill={left} />
        <polygon points="19,6.2 10,11.4 10,20.6 19,15.4" fill={right} />
        <polygon points="10,1 19,6.2 10,11.4 1,6.2" fill={top} />
      </g>
      {/* Блик на верхней грани — фишка выглядит лакированной. */}
      <polygon points="10,2 17.4,6.2 10,10.2 2.6,6.2" fill="#ffffff" opacity="0.24" />
      {/* Светлое ребро под верхней гранью — «кромка» куба. */}
      <polyline
        points="2.6,6.2 10,10.2 17.4,6.2"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.3"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Глиф вида растения для карточки растения (до подключения арта). */
export function PlantGlyph({ kind, className }: { kind: PlantKind; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6", className)} aria-hidden>
      {plantGlyph(kind)}
    </svg>
  );
}

function plantGlyph(kind: PlantKind) {
  switch (kind) {
    case "liana":
      return <path {...stroke} d="M6 3c6 2 5 8 2 12s-2 6 2 6m0-6c4 0 6-3 6-7 0-3-2-5-5-5" />;
    case "fungus":
      return (
        <>
          <path {...stroke} d="M4 11c0-4 3.5-7 8-7s8 3 8 7c0 1-1 2-2 2H6c-1 0-2-1-2-2Z" />
          <path {...stroke} d="M10 13v4m4-4v4m-6 0h8" />
        </>
      );
    case "carnivorous":
      return (
        <>
          <path {...stroke} d="M12 21v-6" />
          <path {...stroke} d="M12 15c-5-1-7-4-6-9 3 1 5 2 6 5 1-3 3-4 6-5 1 5-1 8-6 9Z" />
          <path {...stroke} d="M6 6l1.5 1.5M18 6l-1.5 1.5" />
        </>
      );
    case "annual":
      return (
        <>
          <path {...stroke} d="M12 21v-8" />
          <path {...stroke} d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c3 0 5-2 5-5-3 0-5 2-5 5Z" />
          <circle cx="12" cy="5" r="1.6" {...stroke} />
        </>
      );
    case "legume":
      return (
        <>
          <path {...stroke} d="M5 8c6 0 12 2 14 8-6 1-12-2-14-8Z" />
          <circle cx="10" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="13" cy="13" r="1" fill="currentColor" stroke="none" />
          <path {...stroke} d="M19 16c1-3 1-6-1-9" />
        </>
      );
    case "perennial":
      return (
        <>
          <path {...stroke} d="M12 21v-5" />
          <path {...stroke} d="M12 16c-4 0-6-3-6-7 4 0 6 3 6 7Zm0 0c4 0 6-3 6-7-4 0-6 3-6 7Z" />
        </>
      );
    case "grass":
      return <path {...stroke} d="M12 21V9m0 0C10 7 8 6 5 6c1 4 3 6 7 5Zm0-1c2-2 4-3 7-3-1 4-3 6-7 5Z" />;
    case "succulent":
      return (
        <>
          <path {...stroke} d="M12 21v-8" />
          <path {...stroke} d="M12 13c-2-1-3-3-2-6 2 1 3 3 2 6Zm0 0c2-1 3-3 2-6-2 1-3 3-2 6Zm0 0c-3 0-5-1-6-4 3 0 5 1 6 4Zm0 0c3 0 5-1 6-4-3 0-5 1-6 4Z" />
        </>
      );
    case "fruit":
      return (
        <>
          <circle cx="12" cy="14" r="6" {...stroke} />
          <path {...stroke} d="M12 8V5m0 0c-1.5-1-3-1-4 0m4 0c1.5-1 3-1 4 0" />
        </>
      );
    case "parasite":
      return (
        <>
          <path {...stroke} d="M4 20v-7m0 0c0-4 3-7 8-7" />
          <path {...stroke} d="M12 6c2 0 4 1 5 3m-5-3V3" />
          <path {...stroke} d="M17 9c2 0 3 1 3 3" />
        </>
      );
    default:
      return <circle cx="12" cy="12" r="6" {...stroke} />;
  }
}

export function SpeciesMark({
  seed,
  swimming,
  carnivore,
  bulky,
  className,
}: {
  seed: number;
  swimming?: boolean;
  carnivore?: boolean;
  bulky?: boolean;
  className?: string;
}) {
  const variant = seed % 5;
  return (
    <svg viewBox="0 0 80 48" className={cn("w-full h-auto", className)} aria-hidden>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        transform={bulky ? "translate(0 2) scale(1.05 1.12)" : undefined}
      >
        {swimming ? fish(variant, carnivore) : land(variant, carnivore)}
      </g>
    </svg>
  );
}

function land(variant: number, carnivore?: boolean) {
  if (variant === 0) {
    return (
      <>
        <path d="M14 34c8-16 22-18 36-10 6 4 10 10 16 10" />
        <path d="M22 30c2 8 4 10 4 10M36 32c1 8 3 10 3 10M48 30c2 8 5 10 5 10" />
        <path d="M62 24c6-8 10-6 12-2" />
        {carnivore ? <path d="M18 24l-6 2m2 2 6-1" /> : <circle cx="20" cy="22" r="1.2" fill="currentColor" />}
      </>
    );
  }
  if (variant === 1) {
    return (
      <>
        <path d="M12 32c10-14 30-18 46-6 4 4 8 8 10 8" />
        <path d="M26 30v12M40 30v12M54 30v10" />
        <path d="M18 22c-6-10-4-14 2-12 4 8 8 8 12 4" />
        {carnivore ? <path d="M16 24l-5 3 5 1" /> : <circle cx="18" cy="20" r="1.2" fill="currentColor" />}
      </>
    );
  }
  if (variant === 2) {
    return (
      <>
        <ellipse cx="40" cy="26" rx="22" ry="12" />
        <path d="M22 30c0 8 4 12 6 12M40 32c0 8 3 12 4 12M56 30c0 8-2 12-4 12" />
        <path d="M58 22c8-2 12 4 10 8" />
        {carnivore ? <path d="M20 24l-7 4 7 2" /> : <circle cx="22" cy="22" r="1.2" fill="currentColor" />}
      </>
    );
  }
  if (variant === 3) {
    return (
      <>
        <path d="M10 36c8-20 28-24 48-12 6 4 12 8 12 8" />
        <path d="M20 34l-2 8M34 34l2 8M50 32l4 8" />
        <path d="M14 22c-4-8 2-14 8-8" />
        {carnivore ? <path d="M14 24l-6 2" /> : <circle cx="16" cy="20" r="1.2" fill="currentColor" />}
      </>
    );
  }
  return (
    <>
      <path d="M16 34c6-16 24-20 40-8 8 6 14 8 16 6" />
      <path d="M28 32c0 8 2 12 2 12M44 32c1 8 3 12 3 12" />
      <path d="M58 24c8-10 14-4 12 2" />
      {carnivore ? <path d="M20 24l-6 4 6 1" /> : <circle cx="22" cy="22" r="1.2" fill="currentColor" />}
    </>
  );
}

function fish(variant: number, carnivore?: boolean) {
  return (
    <>
      <path d="M12 24c10-12 36-12 46 0-10 12-36 12-46 0Z" />
      <path d="M58 24l14-8v16Z" />
      <path d={variant % 2 === 0 ? "M28 18c2-6 8-8 10-6" : "M30 30c2 6 8 8 10 6"} />
      {carnivore ? <path d="M18 24l-6-3v6Z" /> : <circle cx="22" cy="22" r="1.3" fill="currentColor" />}
    </>
  );
}

export function TreeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M100 150V78" />
      <path d="M100 120H48v-28" />
      <path d="M100 120h52v-22" />
      <path d="M48 106h-22V78" />
      <path d="M48 92h22V64" />
      <path d="M152 110h22V72" />
      <path d="M152 96h-20V60" />
      <circle cx="100" cy="78" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="48" cy="92" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="26" cy="78" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="70" cy="64" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="152" cy="96" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="174" cy="72" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="132" cy="60" r="3.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

