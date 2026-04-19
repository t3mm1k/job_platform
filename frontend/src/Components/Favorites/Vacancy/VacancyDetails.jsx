import { useNavigate } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteVacancy } from "../../../store/slices/userSlice";
import * as api from "../../../api/client";
const VacancyDetails = ({
  vacancy,
  setSelectedVacancy
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.id);
  const onMoreDetails = () => {
    setSelectedVacancy(vacancy);
    navigate(`/vacancy/${vacancy._id}`);
  };
  const onRemoveFromFavorites = async () => {
    if (!vacancy || !userId) return;
    const vacancyId = vacancy._id;
    try {
      await api.removeFavorite({
        user_id: userId,
        vacancy_id: vacancyId
      });
      dispatch(toggleFavoriteVacancy(vacancyId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };
  return <div className="py-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex flex-col items-left">
                    <p className="text-white opacity-50 text-[8px] uppercase font-semibold">Тип занятости</p>
                    <p className="text-white text-xs font-semibold">{vacancy.vacancy_type === "part-time" ? "Подработка" : "Постоянная работа"}</p>
                </div>
                <div className="flex flex-col items-left">
                    <p className="text-white opacity-50 text-[8px] uppercase font-semibold">Должность</p>
                    <p className="text-white text-xs font-semibold">{vacancy.position || 'Не указано'}</p>
                </div>
            </div>
            <div className="flex flex-col items-left">
                <p className="text-white opacity-50 text-[8px] uppercase font-semibold">Место работы</p>
                <p className="text-white text-xs font-semibold">
                    {vacancy.address.address}
                </p>
            </div>
            <div className="flex gap-2 mt-2 font-bold text-[8px]">
                <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-xl flex items-center gap-2 w-1/2 justify-center" onClick={onRemoveFromFavorites}>
                    <img src="/img/icons/heart.svg" alt="Remove" className="w-5 h-5" />
                    Удалить
                </button>
                <button className="bg-white text-black py-2 px-4 rounded-xl w-1/2 text-center" onClick={onMoreDetails}>
                    Подробнее
                </button>
            </div>
        </div>;
};
export default VacancyDetails;
