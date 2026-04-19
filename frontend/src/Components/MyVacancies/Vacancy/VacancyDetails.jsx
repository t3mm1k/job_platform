import React from 'react';
import { useNavigate } from 'react-router-dom';
const VacancyDetails = ({
  vacancy,
  setSelectedVacancy
}) => {
  const navigate = useNavigate();
  const onMoreDetails = () => {
    setSelectedVacancy(vacancy);
    navigate(`/vacancy/${vacancy._id}`);
  };
  return <div className="py-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex flex-col items-left">
                    <p className="text-white opacity-50 text-[8px] uppercase font-semibold">Тип занятости</p>
                    <p className="text-white text-xs font-semibold">
                        {vacancy.vacancy_type === 'part-time' ? 'Подработка' : 'Постоянная работа'}
                    </p>
                </div>
                <div className="flex flex-col items-left">
                    <p className="text-white opacity-50 text-[8px] uppercase font-semibold">Должность</p>
                    <p className="text-white text-xs font-semibold">{vacancy.position || 'Не указано'}</p>
                </div>
            </div>
            <div className="flex flex-col items-left">
                <p className="text-white opacity-50 text-[8px] uppercase font-semibold">Место работы</p>
                <p className="text-white text-xs font-semibold">{vacancy.address?.address || 'Не указано'}</p>
            </div>
            <div className="flex gap-2 mt-2 font-bold text-[8px]">
                <button className="bg-white text-black py-2 px-4 rounded-xl w-full text-center" onClick={onMoreDetails}>
                    Подробнее
                </button>
            </div>
        </div>;
};
export default VacancyDetails;
