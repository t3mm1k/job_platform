import React from "react";
const JobTypeChoice = ({
  selectedVacancyType,
  onChange
}) => {
  const handleVacancyTypeButtonClick = e => {
    onChange({
      target: {
        name: "vacancy_type",
        value: e.target.value
      }
    });
  };
  return <div className="flex justify-between gap-[7px] mb-[15px]">
            <button className={`toggle-button ${selectedVacancyType === "full-time" ? "active" : ""}`} value="full-time" onClick={handleVacancyTypeButtonClick}>
                <span className={`circle ${selectedVacancyType === "full-time" ? "active" : ""}`}></span>
                Постоянная работа
            </button>
            <button className={`toggle-button ${selectedVacancyType === "part-time" ? "active" : ""}`} value="part-time" onClick={handleVacancyTypeButtonClick}>
                <span className={`circle ${selectedVacancyType === "part-time" ? "active" : ""}`}></span>
                Временная работа
            </button>
        </div>;
};
export default JobTypeChoice;
