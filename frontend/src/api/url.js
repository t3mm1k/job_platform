export function normalizeApiBase(base) {
  return String(base ?? "").replace(/\/$/, "");
}

export function joinApiPath(baseNormalized, path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${baseNormalized}${p}`;
}

export function buildApiUrl(baseEnv, path) {
  return joinApiPath(normalizeApiBase(baseEnv), path);
}
