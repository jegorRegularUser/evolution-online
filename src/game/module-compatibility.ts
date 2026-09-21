import type { EnabledModules } from "./types.ts";

/** Undated publisher FAQ (rightgames.ru faq.docx, file dated 2019-08-01, revision 3).
 * Grass and Fungi is incompatible with Plants and Random Mutations.
 * Validate new settings/start only; never normalize persisted games silently.
 */
export function moduleCompatibilityError(modules: EnabledModules, lang: "ru" | "en" = "ru"): string | null {
  if (!modules.fungi || (!modules.plants && !modules.randomMutations)) return null;
  return lang === "en"
    ? "Grass and Fungi cannot be combined with Plants or Random Mutations. Turn off the incompatible modules before starting."
    : "«Трава и грибы» несовместима с «Растениями» и «Случайными мутациями». Выключите несовместимые дополнения перед началом партии.";
}

export function assertModuleCompatibility(modules: EnabledModules): void {
  const error = moduleCompatibilityError(modules);
  if (error) throw new Error(error);
}
