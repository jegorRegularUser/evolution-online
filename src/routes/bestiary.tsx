import { createFileRoute } from "@tanstack/react-router";
import { BestiariumContent, FeaturePage } from "@/components/game/screens";

export const Route = createFileRoute("/bestiary")({ component: BestiaryPage });

/**
 * /bestiary — бестиарий натуралиста как страница (раньше был модалкой меню).
 * Каркас — FeaturePage: фон и шапка меню + кнопка «Назад»; содержимое —
 * тот же компонент, что раньше лежал в DialogShell.
 */
function BestiaryPage() {
  return (
    <FeaturePage titleKey="bestiarium.title">
      <BestiariumContent />
    </FeaturePage>
  );
}
