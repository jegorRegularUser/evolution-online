import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, ShopContent } from "@/components/game/screens";
import { routeSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/shop")({
  head: () => routeSeoHead("/shop"),
  component: ShopPage,
});

/**
 * /shop — магазин косметики как страница (раньше был модалкой меню).
 * Каркас — FeaturePage: фон и шапка меню + кнопка «Назад»; содержимое —
 * тот же компонент, что раньше лежал в DialogShell.
 */
function ShopPage() {
  return (
    <FeaturePage>
      <ShopContent />
    </FeaturePage>
  );
}
