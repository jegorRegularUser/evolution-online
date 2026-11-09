import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CampaignContent, FeaturePage } from "@/components/game/screens";

export const Route = createFileRoute("/campaign")({ component: CampaignPage });

/**
 * /campaign — кампания-рогалик как страница (фундамент: забег за эпоху
 * вместо списка миссий). Каркас — FeaturePage. Успешный старт забега уводит
 * в меню (/): локальную партию подхватывает GameApp и открывает стол без
 * лобби — кампания живёт на чистом движке, без серверных комнат.
 */
function CampaignPage() {
  const navigate = useNavigate();
  return (
    <FeaturePage titleKey="campaign.title">
      <CampaignContent onStarted={() => navigate({ to: "/" })} />
    </FeaturePage>
  );
}
