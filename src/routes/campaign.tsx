import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CampaignContent, FeaturePage } from "@/components/game/screens";
import { routeSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/campaign")({
  head: () => routeSeoHead("/campaign"),
  component: CampaignPage,
});

/**
 * /campaign — кампания-рогалик как страница (фундамент: забег за эпоху
 * вместо списка миссий). Каркас — FeaturePage. Успешный старт забега уводит
 * в меню (/): локальную партию подхватывает GameApp и открывает стол без
 * лобби — кампания живёт на чистом движке, без серверных комнат.
 */
function CampaignPage() {
  const navigate = useNavigate();
  return (
    <FeaturePage>
      <CampaignContent onStarted={() => navigate({ to: "/" })} />
    </FeaturePage>
  );
}
