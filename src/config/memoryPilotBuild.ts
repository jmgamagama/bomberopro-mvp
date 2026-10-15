/** Solo la preview de esta rama activa automáticamente la experiencia sencilla. */
export function isMemoryPilotPreview(env: Record<string, string | undefined>): boolean {
  return env.VERCEL_ENV === 'preview' && env.VERCEL_GIT_COMMIT_REF === 'codex/feat-memory-pilot';
}
