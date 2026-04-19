export function readSelectedCompanyId() {
  const raw = localStorage.getItem("selectedCompanyId");
  if (raw == null || raw === "" || raw === "null") {
    return null;
  }
  return raw;
}

export function persistSelectedCompanyId(value) {
  if (value == null || value === "") {
    localStorage.removeItem("selectedCompanyId");
  } else {
    localStorage.setItem("selectedCompanyId", String(value));
  }
}
