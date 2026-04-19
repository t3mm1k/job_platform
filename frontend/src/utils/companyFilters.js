export function filterCompaniesByCreatorId(companies, userId) {
  return (companies || []).filter(company => company.creator_id === userId);
}
