import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { setSelectedVacancy } from '../store/slices/userSlice';
import { fetchVacancies } from '../store/slices/vacanciesSlice';
import Header from '../Components/MyVacancies/Header/Header';
import VacancyDetails from "../Components/MyVacancies/Vacancy/VacancyDetails";
import VacancyHeader from "../Components/MyVacancies/Vacancy/VacancyHeader";
import { backButton } from "@telegram-apps/sdk";
import getSelectedCompanyId from "../utils/storage";
const MyVacanciesComponent = ({
  vacancies,
  setSelectedVacancy,
  isTgMiniApp,
  fetchVacancies
}) => {
  const selectedCompanyId = getSelectedCompanyId();
  const navigate = useNavigate();
  const allCompanies = useSelector(s => s.company.allCompanies);
  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);
  useEffect(() => {
    const handleBackNavigation = () => {
      navigate('/');
    };
    if (backButton.isSupported && backButton.mount.isAvailable()) {
      backButton.show();
      backButton.onClick(handleBackNavigation);
    }
    return () => {
      if (backButton.isSupported && backButton.isMounted) {
        backButton.offClick(handleBackNavigation);
        backButton.hide();
      }
    };
  }, [navigate]);
  const [expandedVacancyId, setExpandedVacancyId] = useState(null);
  const {
    active,
    archived
  } = useMemo(() => {
    if (!vacancies || !selectedCompanyId) {
      return {
        active: [],
        archived: []
      };
    }
    const company = allCompanies.find(c => c._id === selectedCompanyId);
    const creatorId = company?.creator_id;
    if (creatorId == null) {
      return {
        active: [],
        archived: []
      };
    }
    const mine = vacancies.filter(v => v.employer_id === creatorId);
    return {
      active: mine.filter(v => v.is_active),
      archived: mine.filter(v => !v.is_active)
    };
  }, [vacancies, selectedCompanyId, allCompanies]);
  const toggleVacancyDetails = id => {
    setExpandedVacancyId(expandedVacancyId === id ? null : id);
  };
  const hasVacancies = active.length > 0 || archived.length > 0;
  if (!hasVacancies) {
    return <div className="bg-[var(--first-background-color)] overflow-y-scroll text-white px-4 py-[20px]" style={{
      paddingTop: 'max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)'
    }}>
                <Header isTgMiniApp={isTgMiniApp} />
                <div className="flex-grow flex items-center justify-center">
                    <h1 className="text-center font-bold">У вас нет активных вакансий</h1>
                </div>
            </div>;
  }
  const renderList = (list, title, titleClass = "", headerOpacity = "opacity-100") => list.length > 0 ? <div className={titleClass}>
                {title ? <h2 className="text-white text-lg font-semibold mb-2">{title}</h2> : null}
                {list.map(vacancy => <div key={vacancy._id} className="bg-[var(--second-background-color)] rounded-[10px] mb-4 overflow-hidden flex flex-col">
                        <VacancyHeader vacancy={vacancy} expanded={expandedVacancyId === vacancy._id} onToggle={() => toggleVacancyDetails(vacancy._id)} opacity={headerOpacity} />
                        <div className="mx-4" style={{
        transition: 'max-height 0.5s ease-out',
        maxHeight: expandedVacancyId === vacancy._id ? '1000px' : '0',
        overflow: 'hidden',
        borderTop: expandedVacancyId === vacancy._id ? '1px solid rgba(255, 255, 255, 0.1)' : '0',
        boxSizing: 'border-box'
      }}>
                            <VacancyDetails vacancy={vacancy} setSelectedVacancy={setSelectedVacancy} />
                        </div>
                    </div>)}
            </div> : null;
  return <div className="bg-[var(--first-background-color)] overflow-y-scroll text-white px-4 py-[20px]" style={{
    paddingTop: 'max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)'
  }}>
            <Header isTgMiniApp={isTgMiniApp} />
            {renderList(active, null, '', 'opacity-100')}
            {renderList(archived, 'В архиве', 'opacity-90', 'opacity-50')}
        </div>;
};
const mapStateToProps = state => ({
  vacancies: state.vacancies.data,
  isTgMiniApp: state.ui.isTgMiniApp
});
const mapDispatchToProps = dispatch => ({
  setSelectedVacancy: vacancy => dispatch(setSelectedVacancy(vacancy)),
  fetchVacancies: () => dispatch(fetchVacancies())
});
export default connect(mapStateToProps, mapDispatchToProps)(MyVacanciesComponent);
