import React from "react";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { toggleFavoriteVacancy } from "../../../store/slices/userSlice";
import * as api from "../../../api/client";
function HeaderComponent({
  vacancy,
  favoritesVacancies,
  isTgMiniApp,
  userId,
  allCompanies
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const company = allCompanies.find(c => c.creator_id === vacancy.employer_id);
  const companyName = company ? company.accountType === 'individual' ? company.fullName : company.companyName : "Компания";
  const isFavoriteVacancy = v => {
    if (!v) return false;
    return favoritesVacancies.includes(v._id);
  };
  const handleToggleFavorite = async () => {
    if (!vacancy || !userId) return;
    const vacancyId = vacancy._id;
    try {
      if (isFavoriteVacancy(vacancy)) {
        await api.removeFavorite({
          user_id: userId,
          vacancy_id: vacancyId
        });
      } else {
        await api.addFavorite({
          user_id: userId,
          vacancy_id: vacancyId
        });
      }
      dispatch(toggleFavoriteVacancy(vacancyId));
    } catch (error) {
      console.error("Ошибка при обновлении избранного:", error);
    }
  };
  return <header className={`relative flex z-0 items-end ${isTgMiniApp ? 'justify-end' : 'justify-between'}`}>
            {isTgMiniApp === false && <button className="flex items-center justify-center gap-[5px] text-[0.8rem]" onClick={() => navigate(-1)}>
                    <img src="/img/icons/arrow-left.svg" alt="Назад" />
                    Назад
                </button>}
            <h1 className="whitespace-nowrap text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{companyName}</h1>
            <svg width="22" height="19" viewBox="0 0 22 19" fill={isFavoriteVacancy(vacancy) ? "white" : "none"} stroke="white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" onClick={handleToggleFavorite} style={{
      cursor: 'pointer'
    }} className="ml-[34px]">
                <path d="M3.45067 10.5748L10.4033 17.1061C10.6428 17.3311 10.7625 17.4435 10.9037 17.4713C10.9673 17.4837 11.0327 17.4837 11.0963 17.4713C11.2375 17.4435 11.3572 17.3311 11.5967 17.1061L18.5493 10.5748C20.5055 8.73722 20.743 5.71322 19.0978 3.59269L18.7885 3.19397C16.8203 0.657206 12.8696 1.08264 11.4867 3.98028C11.2913 4.38959 10.7087 4.38959 10.5133 3.98028C9.13037 1.08264 5.17972 0.65721 3.21154 3.19397L2.90219 3.5927C1.25695 5.71323 1.4945 8.73722 3.45067 10.5748Z" />
            </svg>
        </header>;
}
const mapStateToProps = state => ({
  favoritesVacancies: state.user.favorites,
  vacancy: state.user.selectedVacancy,
  isTgMiniApp: state.ui.isTgMiniApp,
  userId: state.user.id,
  allCompanies: state.company.allCompanies
});
export default connect(mapStateToProps)(HeaderComponent);
