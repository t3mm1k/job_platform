import { buildApiUrl } from "./url";

function apiUrl(path) {
  return buildApiUrl(process.env.REACT_APP_API_URL, path);
}
async function requestJson(path, init = {}) {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body && typeof init.body === "string" ? {
        "Content-Type": "application/json"
      } : {}),
      ...init.headers
    }
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const err = await res.json();
      if (err.detail) detail = typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail);
    } catch {}
    throw new Error(detail || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}
export function normalizeUser(raw) {
  if (!raw) return null;
  const id = raw._id ?? raw.id;
  return {
    ...raw,
    id
  };
}
export async function upsertUserFromTelegram(tgUser) {
  const payload = {
    user_id: tgUser.id,
    username: tgUser.username ?? "",
    first_name: tgUser.first_name ?? "",
    last_name: tgUser.last_name ?? "",
    name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ").trim() || (tgUser.username ?? "")
  };
  const data = await requestJson("/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return normalizeUser(data);
}
export async function getUser(userId) {
  const data = await requestJson(`/users/${userId}`);
  return normalizeUser(data);
}
export async function getVacancies(onlyActive = true, signal) {
  return requestJson(`/vacancies?only_active=${onlyActive ? "true" : "false"}`, {
    signal
  });
}
export async function createVacancy(body) {
  return requestJson("/vacancies", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
export async function uploadVacancyPhoto(vacancyId, photoUrl) {
  return requestJson(`/vacancies/${encodeURIComponent(vacancyId)}/photo`, {
    method: "POST",
    body: JSON.stringify({
      photo_url: photoUrl
    })
  });
}
export async function getResume(userId) {
  return requestJson(`/resumes/${userId}`);
}
export async function saveResume(body) {
  return requestJson("/resumes", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
export async function saveCompany(body) {
  return requestJson("/companies", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
export async function getCompanies() {
  return requestJson("/companies");
}
export async function createResponse(body) {
  return requestJson("/responses", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
export async function addFavorite(body) {
  return requestJson("/favorites", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
export async function removeFavorite(body) {
  return requestJson("/favorites", {
    method: "DELETE",
    body: JSON.stringify(body)
  });
}
export async function getFavoriteVacancyIds(userId) {
  return requestJson(`/favorites/${userId}`);
}
