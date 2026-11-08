import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CampaignContent, FeaturePage } from "@/components/game/screens";

export const Route = createFileRoute("/campaign")({ component: CampaignPage });

/**
 * /campaign — кампания «Эры» как страница (раньше была модалкой меню).
 * Каркас — FeaturePage: фон и шапка меню + кнопка «Назад». Успешный старт
 * миссии уводит в меню (/): сетевую сессию подхватывает GameApp и открывает
 * лобби — ровно то, что раньше делало закрытие модалки.
 */
function CampaignPage() {
  const navigate = useNavigate();
  return (
    <FeaturePage titleKey="campaign.title">
      <CampaignContent onStarted={() => navigate({ to: "/" })} />
    </FeaturePage>
  );
}
