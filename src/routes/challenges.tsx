import { createFileRoute } from "@tanstack/react-router";
import { ChallengesContent, FeaturePage } from "@/components/game/screens";
import { routeSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/challenges")({
  head: () => routeSeoHead("/challenges"),
  component: ChallengesPage,
});

/**
 * /challenges — «Вызовы» как страница (раньше были модалкой меню).
 * Каркас — FeaturePage: фон и шапка меню + кнопка «Назад»; содержимое —
 * тот же компонент, что раньше лежал в DialogShell.
 */
function ChallengesPage() {
  return (
    <FeaturePage>
      <ChallengesContent />
    </FeaturePage>
  );
}
