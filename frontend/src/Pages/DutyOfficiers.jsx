import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { backButton } from "@telegram-apps/sdk";
import getSelectedCompanyId from "../utils/storage";
import { useSelector } from "react-redux";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || '/api';
const DutyPageHeader = ({
  isTgMiniApp
}) => {
  const navigate = useNavigate();
  return <header className="relative flex items-center mb-5">
            {!isTgMiniApp && !(backButton.isSupported && backButton.isMounted) && <button className="whitespace-nowrap flex items-center justify-center gap-[5px] text-[0.8rem] font-normal" onClick={() => navigate(-1)}>
                    <img src="/img/icons/arrow-left.svg" alt="Назад" />
                    Назад
                </button>}
            <h1 className="whitespace-nowrap text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                Дежурные сотрудники
            </h1>
        </header>;
};
const DutyOfficerCardHeader = ({
  officer,
  expanded,
  onToggle
}) => {
  const getMarketplaceLogoSrc = marketplaceName => {
    switch (marketplaceName) {
      case 'Wildberries':
        return '/img/marketplace-logo/Wildberries.png';
      case 'Yandex':
        return '/img/marketplace-logo/Yandex.png';
      case 'Ozon':
        return '/img/marketplace-logo/Ozon.png';
      case 'Avito':
        return '/img/marketplace-logo/Avito.png';
      case 'Boxberry':
        return '/img/marketplace-logo/Boxberry.png';
      case 'Others':
        return '/img/marketplace-logo/Others.png';
      default:
        return '/img/marketplace-logo/Others.png';
    }
  };
  return <div className={`flex items-center justify-between p-3 cursor-pointer mx-2`} onClick={onToggle}>
            <div className="flex items-center gap-3">
                {officer.duty_resume?.marketplace && <img src={getMarketplaceLogoSrc(officer.duty_resume.marketplace)} alt={officer.duty_resume.marketplace} className="w-[35px] h-[35px] rounded-full object-cover" />}
                <div className="text-white">
                    <h2 className="font-bold uppercase text-[8px]">{officer.duty_resume?.fio || 'Имя не указано'}</h2>
                    <p className="font-regular text-[8px]">
                        {officer.duty_resume?.rate ? `${officer.duty_resume.rate} ₽ / за смену` : 'Ставка не указана'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-[4px]">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform duration-[550ms] transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>;
};
const DutyOfficerCardDetails = ({
  officer
}) => {
  const navigate = useNavigate();
  const store = useSelector(state => state);
  const handleRespond = () => {
    console.log("officer", officer);
    const response = fetch(`${REACT_APP_API_URL}/duty_respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        employer_id: store.user.id,
        respond_text: "Здравствуйте! увидел(а) вашу вакансию на Sinwhil - @sinwhiljob_bot",
        job_seeker_username: store.user.username,
        job_seeker_id: officer.id,
        company_id: getSelectedCompanyId()
      })
    }).then(response => response.json()).then(result => {
      console.log(result);
      navigate(`/chat/${result.chat_id}`);
    });
  };
  const getMarketplaceLogoSrc = marketplaceName => {
    switch (marketplaceName) {
      case 'Wildberries':
        return '/img/marketplace-logo/Wildberries.png';
      case 'Yandex':
        return '/img/marketplace-logo/Yandex.png';
      case 'Ozon':
        return '/img/marketplace-logo/Ozon.png';
      case 'Avito':
        return '/img/marketplace-logo/Avito.png';
      case 'Boxberry':
        return '/img/marketplace-logo/Boxberry.png';
      case 'Others':
        return '/img/marketplace-logo/Others.png';
      default:
        return '/img/marketplace-logo/Others.png';
    }
  };
  return <div className="py-4">
            <div className={`grid grid-cols-2 gap-x-2 gap-y-3 mb-3`}>
                <div className="flex flex-col items-left">
                    <p className="text-white opacity-50 text-[8px] uppercase font-semibold">
                        Город
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                        <p className="text-white text-xs font-semibold">
                            {officer.duty_resume?.city || 'Не указан'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-left">
                    <p className="text-white opacity-50 text-[8px] uppercase font-semibold">
                        Номер телефона
                    </p>
                    <p className="text-white text-xs font-semibold mt-1">
                        {officer.duty_resume?.number || 'Не указан'}
                    </p>
                </div>
                <div className="flex flex-col items-left col-span-2">
                    <p className="text-white opacity-50 text-[8px] uppercase font-semibold">
                        Опыт работы
                    </p>
                    <p className="text-white text-xs font-semibold mt-1">
                        {officer.duty_resume?.experience || 'Не указан'}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-4 font-bold text-[10px] justify-center">
                <button className="flex items-center justify-center flex-grow h-[40px] rounded-[10px] bg-white text-[var(--second-background-color)] gap-[5px] px-4" onClick={handleRespond}>
                    Откликнуться
                </button>
            </div>
        </div>;
};
const DutyOfficerItem = ({
  officer,
  expanded,
  onToggle
}) => {
  const detailsHeight = expanded ? '1000px' : '0';
  const borderOpacity = expanded ? '0.1' : '0';
  return <div className="bg-[var(--second-background-color)] rounded-[10px] mb-4 overflow-hidden flex flex-col">
            <DutyOfficerCardHeader officer={officer} expanded={expanded} onToggle={onToggle} />
            <div className="mx-4" style={{
      transition: 'max-height 0.5s ease-out, opacity 0.5s ease-out',
      maxHeight: detailsHeight,
      opacity: expanded ? 1 : 0,
      overflow: 'hidden',
      borderTop: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
      boxSizing: 'border-box'
    }}>
                {expanded && <DutyOfficerCardDetails officer={officer} />}
            </div>
        </div>;
};
const DutyOfficersPage = () => {
  const navigate = useNavigate();
  const [officersList, setOfficersList] = useState([]);
  const [loadingState, setLoadingState] = useState('idle');
  const [error, setError] = useState(null);
  const [expandedOfficerId, setExpandedOfficerId] = useState(null);
  const [isTgMiniApp, setIsTgMiniApp] = useState(false);
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setIsTgMiniApp(true);
    }
  }, []);
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.show();
    backButton.onClick(() => {
      navigate('/profile');
    });
  }
  useEffect(() => {
    const fetchDutyOfficersData = async () => {
      setLoadingState('pending');
      setError(null);
      try {
        const response = await fetch(`${REACT_APP_API_URL}/duty_officers`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: `HTTP error! status: ${response.status}`
          }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOfficersList(data);
        setLoadingState('succeeded');
      } catch (err) {
        console.error("Failed to fetch duty officers:", err);
        setError(err.message || 'Не удалось загрузить данные.');
        setLoadingState('failed');
      }
    };
    fetchDutyOfficersData();
  }, []);
  useEffect(() => {
    const handleBackNavigation = () => {
      navigate('/');
    };
    if (isTgMiniApp && backButton.isSupported && backButton.mount.isAvailable()) {
      backButton.show();
      backButton.onClick(handleBackNavigation);
    }
    return () => {
      if (isTgMiniApp && backButton.isSupported && backButton.isMounted) {
        backButton.offClick(handleBackNavigation);
        backButton.hide();
      }
    };
  }, [navigate, isTgMiniApp]);
  const toggleOfficerDetails = id => {
    setExpandedOfficerId(expandedOfficerId === id ? null : id);
  };
  const activeDutyOfficers = useMemo(() => {
    if (!officersList) return [];
    return officersList.filter(officer => officer.duty_active === true);
  }, [officersList]);
  if (loadingState === 'pending' || loadingState === 'idle') {
    return <div className="bg-[var(--first-background-color)] min-h-screen text-white px-4 py-[20px] flex items-center justify-center" style={{
      paddingTop: 'max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)'
    }}>
                <DutyPageHeader isTgMiniApp={isTgMiniApp} />
                <div className="flex-grow flex items-center justify-center h-[calc(100vh-100px)]">
                    <p className="font-bold">Загрузка дежурных сотрудников...</p>
                </div>
            </div>;
  }
  if (loadingState === 'failed') {
    return <div className="bg-[var(--first-background-color)] min-h-screen text-white px-4 py-[20px]" style={{
      paddingTop: 'max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)'
    }}>
                <DutyPageHeader isTgMiniApp={isTgMiniApp} />
                <div className="flex-grow flex items-center justify-center h-[calc(100vh-100px)]">
                    <p className="text-center font-bold text-red-500">Ошибка загрузки: {error}</p>
                </div>
            </div>;
  }
  if (!activeDutyOfficers || activeDutyOfficers.length === 0) {
    return <div className="bg-[var(--first-background-color)] min-h-screen text-white px-4 py-[20px]" style={{
      paddingTop: 'max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)'
    }}>
                <DutyPageHeader isTgMiniApp={isTgMiniApp} />
                <div className="flex-grow flex items-center justify-center h-[calc(100vh-100px)]">
                    <h1 className="text-center font-bold opacity-70">Нет доступных дежурных сотрудников</h1>
                </div>
            </div>;
  }
  return <div className="bg-[var(--first-background-color)] min-h-screen overflow-y-scroll text-white px-4 py-[20px]" style={{
    paddingTop: 'max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)'
  }}>
            <DutyPageHeader isTgMiniApp={isTgMiniApp} />

            {activeDutyOfficers.map(officer => <DutyOfficerItem key={officer._id} officer={officer} expanded={expandedOfficerId === officer._id} onToggle={() => toggleOfficerDetails(officer._id)} />)}
        </div>;
};
export default DutyOfficersPage;
