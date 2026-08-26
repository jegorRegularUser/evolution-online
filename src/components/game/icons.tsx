import type { TraitId } from "@/game/types";
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
          <rect x="12" y="7" width="8" height="10" rx="1" {...stroke} opacity={0.6} />
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

const PIP_COORDS: Record<number, Array<[number, number]>> = {
  1: [[12, 12]],
  2: [
    [8, 8],
    [16, 16],
  ],
  3: [
    [8, 8],
    [12, 12],
    [16, 16],
  ],
  4: [
    [8, 8],
    [16, 8],
    [8, 16],
    [16, 16],
  ],
  5: [
    [8, 8],
    [16, 8],
    [12, 12],
    [8, 16],
    [16, 16],
  ],
  6: [
    [8, 7],
    [16, 7],
    [8, 12],
    [16, 12],
    [8, 17],
    [16, 17],
  ],
};

/** Игральная кость с настоящими очками; rolling подменяет очки дрожью. */
export function Die({ value, rolling, className }: { value: number | null; rolling?: boolean; className?: string }) {
  const shown = rolling ? ((value ?? 1) % 6) + 1 : (value ?? 1);
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-10", rolling && "die-tumble", className)}
      aria-label={`Кубик: ${value ?? "?"}`}
      role="img"
    >
      <rect x="2" y="2" width="20" height="20" rx="4.5" className="die-body" />
      {(PIP_COORDS[shown] ?? PIP_COORDS[1]!).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.9" className="die-pip" />
      ))}
    </svg>
  );
}
