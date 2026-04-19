import React from 'react';
import { connect } from 'react-redux';
import { toggleFilterVisibility, toggleSearchVisibility } from '../../../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import getSelectedCompanyId from "../../../../utils/storage";
function FooterButtonsComponent({
  toggleFilterVisibility,
  toggleSearchVisibility,
  isFilterOpen,
  filters
}) {
  const navigate = useNavigate();
  const selectedCompanyId = getSelectedCompanyId();
  const filterCount = Object.values(filters).reduce((count, filterValue) => {
    if (Array.isArray(filterValue)) {
      return count + filterValue.length;
    } else if (filterValue) {
      return count + 1;
    }
    return count;
  }, 0);
  const filterText = filterCount > 0 ? `(${filterCount})` : "";
  return <div className={`flex px-[10px] z-[200] py-[10px] bg-[#242424] mt-0`}>
            <button className={`footer-button flex flex-col items-center font-bold uppercase gap-[2px] text-[8px] ${selectedCompanyId === null ? "px-[10px]" : ""}`} onClick={() => {
      selectedCompanyId === null ? toggleSearchVisibility() : navigate('myvacancies');
    }} type="button">
                <img src={selectedCompanyId !== null ? "/img/icons/myvacancies.svg" : "/img/icons/search.svg"} alt="Поиск" />
                <span>{selectedCompanyId !== null ? "Мои вакансии" : "Поиск"}</span>
            </button>

            {selectedCompanyId === null ? <div className="flex-grow flex justify-center">
                    <div className={`footer-button flex items-center font-bold uppercase px-[10px] text-[0.5rem] border-solid border border-white rounded-[10px] py-[5px] justify-center gap-0 ${isFilterOpen ? 'bg-white text-black' : 'bg-[var(--second-background-color)] text-white'}`} onClick={() => {
        toggleFilterVisibility();
      }} type="button" style={{
        maxWidth: "120px"
      }}>
                        <img src="/img/icons/filter_big.svg" alt="Фильтр" className={`${isFilterOpen ? 'icons-dark' : 'none'} mr-[10px]`} />
                        <p className="flex">Фильтры {filterText}</p>
                    </div>
                </div> : <div className="relative flex-grow flex justify-center">
                    <div className={`footer-button flex items-center font-bold uppercase px-[10px] py-[5px] text-[0.5rem] border-solid border border-white rounded-[10px] justify-center gap-[10px] bg-[var(--second-background-color)] text-white`} onClick={() => {
        navigate('newvacancy');
      }} type="button">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 6L12.5 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M18.5 12L6.5 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p className="flex">Создать вакансию</p>
                    </div>
                </div>}



            <button className={`footer-button flex flex-col items-center font-bold uppercase gap-[2px] text-[0.5rem] ${selectedCompanyId === null ? "px-[10px]" : ""}`} onClick={() => navigate('/profile')}>
                <img src="/img/icons/user_circle.svg" alt="Профиль" />
                <span>Профиль</span>
            </button>
        </div>;
}
const mapStateToProps = state => ({
  isFilterOpen: state.ui.isFilterOpen,
  filters: state.vacancies.filters
});
const mapDispatchToProps = {
  toggleFilterVisibility,
  toggleSearchVisibility
};
const FooterButtons = connect(mapStateToProps, mapDispatchToProps)(FooterButtonsComponent);
export default FooterButtons;
