/**
 * Косметика места: аватар (портрет учёного или существо из магазина) и
 * рубашка карт. Общие для списка мест, чата и табло партии — волна
 * «аватары и рубашки». Ключи и арты: SCIENTIST_AVATARS/AVATAR_ART.
 */
import type { CSSProperties } from "react";
import { avatarArtOf } from "@/lib/art";
import { cosmeticById } from "@/lib/cosmetics";
import { cn } from "@/lib/utils";

/** Аватар места: круг с портретом; без арта (пусто) — инициал имени. */
export function AvatarChip({
  avatarKey,
  name,
  className,
  style,
}: {
  avatarKey: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const src = avatarArtOf(avatarKey);
  if (!src) {
    return (
      <span
        aria-hidden
        style={style}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full border border-ink/25 bg-parchment-2 text-xs font-semibold text-ink",
          className,
        )}
      >
        {(name ?? "?").trim().slice(0, 1).toUpperCase() || "?"}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      style={style}
      className={cn("size-8 shrink-0 rounded-full border border-ink/25 object-cover", className)}
    />
  );
}

/** Рубашка карты места: текстура card-back + CSS-скин каталога. */
export function CardBackChip({ itemId, className }: { itemId?: string; className?: string }) {
  const skin = itemId ? cosmeticById(itemId)?.cssClass : undefined;
  return (
    <span
      aria-hidden
      className={cn(
        "cardback-chip inline-block shrink-0 rounded-[3px] border border-ink/25 shadow-sm",
        skin ?? "cardback-skin-classic",
        className,
      )}
    />
  );
}
