import React from "react";
import VacancyHeader from "./VacancyHeader";
import VacancyDetails from "./VacancyDetails";
const VacancyItem = ({
  vacancy,
  expanded,
  onToggle,
  setSelectedVacancy,
  toggleFavoriteVacancy
}) => {
  const detailsHeight = expanded ? '1000px' : '0';
  const borderOpacity = expanded ? '0.1' : '0';
  return <div className="bg-[var(--second-background-color)] rounded-[10px] mb-4 overflow-hidden flex flex-col">
            <VacancyHeader vacancy={vacancy} expanded={expanded} onToggle={onToggle} />
            <div className="mx-4" style={{
      transition: 'max-height 0.5s ease-out',
      maxHeight: detailsHeight,
      overflow: 'hidden',
      borderTop: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
      boxSizing: 'border-box'
    }}>
                <VacancyDetails vacancy={vacancy} setSelectedVacancy={setSelectedVacancy} toggleFavoriteVacancy={toggleFavoriteVacancy} />
            </div>
        </div>;
};
export default VacancyItem;
