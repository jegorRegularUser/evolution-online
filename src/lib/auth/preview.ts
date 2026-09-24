/**
 * Общие настройки OAuth для live-preview (server-only — NEVER import from the client).
 *
 * Preview-клиент живёт в secret store брокера. Секрет намеренно не хранится в
 * исходниках: сервер читает его из окружения, а при отсутствии переменной
 * отключает федеративный вход с понятным сообщением.
 */
export const PREVIEW_CLIENT_ID_ENV = "GROK_PREVIEW_CLIENT_ID" as const;
export const PREVIEW_CLIENT_SECRET_ENV = "GROK_PREVIEW_CLIENT_SECRET" as const;

function readEnvValue(
  key: string,
  environment: NodeJS.ProcessEnv,
): string | undefined {
  const value = environment[key]?.trim();
  return value || undefined;
}

/** Читает preview client id только из окружения. */
export function readPreviewClientId(
  environment: NodeJS.ProcessEnv = process.env,
): string | undefined {
  return readEnvValue(PREVIEW_CLIENT_ID_ENV, environment);
}

/** Читает preview-секрет только из окружения; пустое значение считается unset. */
export function readPreviewClientSecret(
  environment: NodeJS.ProcessEnv = process.env,
): string | undefined {
  return readEnvValue(PREVIEW_CLIENT_SECRET_ENV, environment);
}

/** Общий issuer auth-брокера (OIDC discovery находится под ним). */
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";

/**
 * Хосты, чьи callback принимает preview-клиент. Better Auth выводит реальный
 * origin live-preview из host запроса и проверяет его по этому списку, поэтому
 * `redirect_uri` остаётся конкретным callback-адресом preview-хоста.
 */
export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
