import { createFileRoute } from "@tanstack/react-router";
import { ChallengesContent, FeaturePage } from "@/components/game/screens";

export const Route = createFileRoute("/challenges")({ component: ChallengesPage });

/**
 * /challenges — «Вызовы» как страница (раньше были модалкой меню).
 * Каркас — FeaturePage: фон и шапка меню + кнопка «Назад»; содержимое —
 * тот же компонент, что раньше лежал в DialogShell.
 */
function ChallengesPage() {
  return (
    <FeaturePage titleKey="challenges.title">
      <ChallengesContent />
    </FeaturePage>
  );
}
