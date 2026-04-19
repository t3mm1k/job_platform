import React from "react";
function VacancyTypeFilter({
  selectedVacancyType,
  onChange
}) {
  const handleVacancyTypeButtonClick = event => {
    const newValue = event.currentTarget.value;
    const updatedValue = selectedVacancyType === newValue ? "" : newValue;
    onChange(updatedValue);
  };
  return <div className="filter-section">
            <button className={`toggle-button ${selectedVacancyType === "full-time" ? "active" : ""}`} value="full-time" onClick={handleVacancyTypeButtonClick} style={{
      width: 0
    }}>
                <span className={`circle ${selectedVacancyType === "full-time" ? "active" : ""}`}></span>
                Постоянная работа
            </button>
            <button className={`toggle-button ${selectedVacancyType === "part-time" ? "active" : ""}`} value="part-time" onClick={handleVacancyTypeButtonClick} style={{
      width: 0
    }}>
                <span className={`circle ${selectedVacancyType === "part-time" ? "active" : ""}`}></span>
                Временная работа
            </button>
        </div>;
}
export default VacancyTypeFilter;
