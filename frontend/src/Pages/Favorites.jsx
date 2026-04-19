import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from "react-redux";
import { setSelectedVacancy, setFavorites } from "../store/slices/userSlice";
import * as api from "../api/client";
import Header from "../Components/Favorites/Header/Header";
import VacancyItem from "../Components/Favorites/Vacancy/VacancyItem";
import { backButton } from "@telegram-apps/sdk";
const FavoritesPage = ({
  vacancies,
  isTgMiniApp
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteVacancies = useSelector(state => state.user.favorites);
  const userId = useSelector(state => state.user.id);
  const user = useSelector(state => state.user);
  const [expandedVacancyId, setExpandedVacancyId] = useState(null);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  useEffect(() => {
    const handleBackNavigation = () => {
      console.log('Back button clicked, navigating to /profile');
      navigate('/profile');
    };
    if (backButton.isSupported && backButton.mount.isAvailable()) {
      backButton.show();
      backButton.onClick(handleBackNavigation);
    } else {
      console.log('Back button not available or supported for setup.');
    }
    return () => {
      if (backButton.isSupported && backButton.isMounted) {
        backButton.offClick(handleBackNavigation);
        backButton.hide();
      }
    };
  }, [navigate]);
  useEffect(() => {
    const activeFavoriteVacancies = vacancies.filter(vacancy => favoriteVacancies.includes(vacancy._id) && vacancy.is_active === true);
    setFilteredVacancies(activeFavoriteVacancies);
  }, [vacancies, favoriteVacancies]);
  const toggleVacancyDetails = id => {
    setExpandedVacancyId(expandedVacancyId === id ? null : id);
  };
  const handleSetSelectedVacancy = vacancy => {
    dispatch(setSelectedVacancy(vacancy));
  };
  const removeAllFavorites = async () => {
    if (!userId) {
      console.error("Cannot clear favorites: User ID is missing.");
      return;
    }
    try {
      for (const vid of [...favoriteVacancies]) {
        try {
          await api.removeFavorite({
            user_id: userId,
            vacancy_id: vid
          });
        } catch (e) {
          console.warn(e);
        }
      }
      dispatch(setFavorites([]));
    } catch (error) {
      console.error("Error clearing favorites:", error);
    }
  };
  if (filteredVacancies.length === 0) {
    return <div className="bg-[var(--first-background-color)] h-screen text-white py-5 px-4 flex flex-col" style={{
      paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
    }}>
                <Header isTgMiniApp={isTgMiniApp} />
                <div className="flex-grow flex items-center justify-center">
                    <h1 className="text-center font-bold text-[16px]">
                        Добавьте вакансии в избранное
                    </h1>
                </div>
            </div>;
  }
  return <div className="bg-[var(--first-background-color)] min-h-screen overflow-y-scroll text-white px-4 pb-[70px] pt-[20px]" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <Header isTgMiniApp={isTgMiniApp} />
            {filteredVacancies.map(vacancy => <VacancyItem key={vacancy._id} vacancy={vacancy} expanded={expandedVacancyId === vacancy._id} onToggle={() => toggleVacancyDetails(vacancy._id)} setSelectedVacancy={() => handleSetSelectedVacancy(vacancy)} />)}
            {}
            <button className="text-[#EE003B] mt-5 fixed bottom-3 left-0 right-0 w-[calc(100%-32px)] mx-auto bg-[var(--first-background-color)] py-2 z-10" onClick={removeAllFavorites}>
                Очистить избранное
            </button>
        </div>;
};
const mapStateToProps = state => ({
  vacancies: state.vacancies.data,
  isTgMiniApp: state.ui.isTgMiniApp
});
export default connect(mapStateToProps)(FavoritesPage);
