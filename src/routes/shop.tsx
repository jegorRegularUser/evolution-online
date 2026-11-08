import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, ShopContent } from "@/components/game/screens";

export const Route = createFileRoute("/shop")({ component: ShopPage });

/**
 * /shop — магазин косметики как страница (раньше был модалкой меню).
 * Каркас — FeaturePage: фон и шапка меню + кнопка «Назад»; содержимое —
 * тот же компонент, что раньше лежал в DialogShell.
 */
function ShopPage() {
  return (
    <FeaturePage titleKey="shop.title">
      <ShopContent />
    </FeaturePage>
  );
}
