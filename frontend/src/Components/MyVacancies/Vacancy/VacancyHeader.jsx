import React from "react";
import { calculateDays } from "../../../utils/Dates";
const VacancyHeader = ({
  vacancy,
  expanded,
  onToggle,
  opacity = "opacity-100"
}) => {
  console.log(vacancy.created_at);
  const daysToEnd = calculateDays(vacancy.time_until_end);
  let logoSrc = '';
  switch (vacancy.marketplace) {
    case 'Wildberries':
      logoSrc = '/img/marketplace-logo/Wildberries.png';
      break;
    case 'Yandex':
      logoSrc = '/img/marketplace-logo/Yandex.png';
      break;
    case 'Ozon':
      logoSrc = '/img/marketplace-logo/Ozon.png';
      break;
    case 'Avito':
      logoSrc = '/img/marketplace-logo/Avito.png';
      break;
    case 'Boxberry':
      logoSrc = '/img/marketplace-logo/Boxberry.png';
      break;
    case 'Others':
      logoSrc = '/img/marketplace-logo/Others.png';
      break;
    default:
      logoSrc = '/img/marketplace-logo/Others.png';
  }
  return <div className={`flex items-center justify-between p-3 cursor-pointer mx-2 ${opacity}`} onClick={onToggle}>
            <div className="flex items-center gap-3">
                <img src={logoSrc} alt={vacancy.marketplace} className="w-[30px] h-[30px] rounded-full object-cover " />
                <div className="text-white">
                    <h2 className="font-bold uppercase text-[8px]">{vacancy.marketplace}</h2>
                    <p className="font-regular text-[8px]">{vacancy.salary} ₽ {vacancy.vacancy_type === "part-time" ? "/ за смену" : "/ в месяц"}</p>
                </div>
            </div>

            <div className="flex items-center gap-[4px]">
                <h2 className="font-bold uppercase text-[8px] opacity-50">Осталось {daysToEnd.remaining.days} {daysToEnd.remaining.daysWord}</h2>

                {(vacancy.confirmed || vacancy.under_revision) && <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform duration-[550ms] transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>}
            </div>


        </div>;
};
export default VacancyHeader;
