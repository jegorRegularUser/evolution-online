import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sfx } from "@/lib/sfx";

/** Тумблер звука: сохраняется в localStorage, как и скорость игры. */
export function SoundToggle() {
  const [on, setOn] = useState(sfx.enabled);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={on ? "Выключить звук" : "Включить звук"}
      title={on ? "Выключить звук" : "Включить звук"}
      onClick={() => {
        const next = !on;
        setOn(next);
        sfx.setEnabled(next);
      }}
    >
      {on ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
    </Button>
  );
}
