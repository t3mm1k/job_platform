export function filterVacancies(data, filters) {
  const filteredData = [];
  if (!data) {
    return filteredData;
  }
  for (const vacancy of data) {
    let matchesFilter = true;
    const vacancyType = (vacancy.vacancy_type || "").toLowerCase();
    const vacancyCity = String(vacancy.address?.city ?? "").toLowerCase();
    const filterCity = String(filters.city).toLowerCase();
    if (filters.vacancy_type !== "" && vacancyType !== filters.vacancy_type) {
      matchesFilter = false;
      continue;
    }
    if (filters.time !== "" && filters.time !== vacancy.work_duration) {
      matchesFilter = false;
      continue;
    }
    if (!vacancy.is_active) {
      matchesFilter = false;
      continue;
    }
    if (filters.marketplaces.length > 0 && !filters.marketplaces.includes(vacancy?.marketplace)) {
      matchesFilter = false;
      continue;
    }
    if (filters.city !== "" && vacancyCity !== filterCity) {
      matchesFilter = false;
      continue;
    }
    if (filters.position !== "" && vacancy?.position !== filters.position) {
      matchesFilter = false;
      continue;
    }
    if (matchesFilter) {
      filteredData.push(vacancy);
    }
  }
  return filteredData;
}
