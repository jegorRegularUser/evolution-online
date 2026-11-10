import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/components/game/game-app";
import { routeSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => routeSeoHead("/"),
  component: Home,
});

function Home() {
  return <GameApp />;
}
