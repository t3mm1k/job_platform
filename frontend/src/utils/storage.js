export default function getSelectedCompanyId() {
  const raw = localStorage.getItem("selectedCompanyId");
  if (raw == null || raw === "" || raw === "null") {
    return null;
  }
  return raw;
}
