import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { backButton } from '@telegram-apps/sdk';
import { useGeolocated } from "react-geolocated";
import Header from "../Components/Main/Header/Header";
import Footer from "../Components/Main/Footer/Footer";
import Map from "../Components/Main/Map/Map";
import ConfirmAddressModal from "../Components/Main/LocationModals/ConfirmAddressModal";
import EnterAddressModal from "../Components/Main/LocationModals/EnterAddressModal";
import { setCenter } from "../store/slices/vacanciesSlice";
import { useNavigate } from "react-router-dom";
const MOSCOW_CENTER = [37.588144, 55.733842];
const LOCATION_CONFIRMED_KEY = 'locationConfirmed';
const ROLE_SELECTION_COUNT_KEY = 'roleSelectionCount';
const ROLE_SELECTION_CONFIRM_KEY = 'roleSelectionConfirmed';
export default function Main() {
  const navigate = useNavigate();
  const initialLocationConfirmed = sessionStorage.getItem(LOCATION_CONFIRMED_KEY) === 'true';
  const roleSelectionCount = parseInt(localStorage.getItem(ROLE_SELECTION_COUNT_KEY) || '0', 10);
  const initialRoleConfirmed = sessionStorage.getItem(ROLE_SELECTION_CONFIRM_KEY) === 'true';
  const needsRoleSelectionInitially = !initialRoleConfirmed && roleSelectionCount < 10;
  const [roleConfirmed, setRoleConfirmed] = useState(initialRoleConfirmed);
  const [showRoleSelection, setShowRoleSelection] = useState(needsRoleSelectionInitially);
  const [showLocationModals, setShowLocationModals] = useState(!needsRoleSelectionInitially);
  const [locationStage, setLocationStage] = useState(initialLocationConfirmed ? 'confirmed' : 'idle');
  const [detectedAddress, setDetectedAddress] = useState(null);
  const [autoCoords, setAutoCoords] = useState(null);
  const [showMainUI, setShowMainUI] = useState(initialRoleConfirmed && initialLocationConfirmed);
  const [ymapsReady, setYmapsReady] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const dispatch = useDispatch();
  const currentCenter = useSelector(state => state.vacancies.center);
  const locationProcessed = useRef(initialLocationConfirmed);
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.hide();
  }
  useEffect(() => {
    const checkYmaps = () => {
      if (window.ymaps3 && window.ymaps3.ready) {
        window.ymaps3.ready.then(() => setYmapsReady(true));
      }
    };
    checkYmaps();
  }, []);
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    error: geolocationError
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false
    },
    userDecisionTimeout: 10000,
    watchPosition: false
  });
  console.log("useGeolocated hook state:", {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    geolocationError
  });
  const reverseGeocode = useCallback(async coords => {
    if (!ymapsReady || !coords) return null;
    const geoCoords = [coords.longitude, coords.latitude];
    try {
      const results = await window.ymaps3.search({
        text: geoCoords
      });
      console.log("Reverse Geocode Results:", results);
      if (results && results[0]) {
        const name = results[0].properties.name || '';
        const description = results[0].properties.description || '';
        let addressString = name;
        if (description && !description.toLowerCase().includes(name.toLowerCase().split(',')[0])) {
          addressString = `${name}, ${description}`;
        }
        return addressString;
      }
    } catch (geocodeError) {
      console.warn("Ошибка ymaps3.search (reverse geocode):", geocodeError);
    }
    return 'Не удалось определить адрес';
  }, [ymapsReady]);
  const handleLocationFallback = useCallback(message => {
    console.warn("Location Fallback:", message);
    if (locationProcessed.current) return;
    setLocationError(message);
    dispatch(setCenter(MOSCOW_CENTER));
    setLocationStage('confirmed');
    locationProcessed.current = true;
    sessionStorage.setItem(LOCATION_CONFIRMED_KEY, 'true');
    setShowMainUI(true);
    setShowRoleSelection(false);
    setShowLocationModals(false);
  }, [dispatch]);
  useEffect(() => {
    console.log("Location Processing Effect Triggered. ymapsReady:", ymapsReady, "locationProcessed:", locationProcessed.current, "initialLocationConfirmed:", initialLocationConfirmed);
    if (!ymapsReady || locationProcessed.current) {
      if (!showRoleSelection && initialLocationConfirmed && !showMainUI) {
        console.log("Локация подтверждена в сессии, роль не требуется/завершена. Показ основного UI.");
        if (!currentCenter) {
          dispatch(setCenter(MOSCOW_CENTER));
        }
        if (locationStage !== 'confirmed') setLocationStage('confirmed');
        setShowMainUI(true);
        locationProcessed.current = true;
      }
      return;
    }
    if (initialLocationConfirmed) {
      console.log("Локация уже подтверждена в сессии (внутри эффекта), пропускаем обработку.");
      if (!currentCenter) dispatch(setCenter(MOSCOW_CENTER));
      setLocationStage('confirmed');
      locationProcessed.current = true;
      if (!needsRoleSelectionInitially) setShowMainUI(true);
      return;
    }
    if (locationStage === 'idle' || locationStage === 'requesting') {
      if (locationStage === 'idle') setLocationStage('requesting');
      console.log("Обработка состояния геолокации...");
      if (!isGeolocationAvailable) {
        handleLocationFallback("Геолокация не поддерживается вашим браузером.");
        return;
      }
      if (!isGeolocationEnabled) {
        if (geolocationError && geolocationError.code === 1) {
          handleLocationFallback("Доступ к геолокации запрещен. Используется центр Москвы.");
        } else if (geolocationError) {
          handleLocationFallback(`Ошибка геолокации: ${geolocationError.message}. Используется центр Москвы.`);
        } else {
          console.log("Ожидание разрешения геолокации или ошибка...");
        }
        if (geolocationError) return;
      }
      if (geolocationError && !locationProcessed.current) {
        handleLocationFallback(`Ошибка геолокации: ${geolocationError.message}`);
        return;
      }
      if (coords) {
        console.log("Геолокация получена:", coords);
        const currentCoords = [coords.longitude, coords.latitude];
        setAutoCoords(currentCoords);
        reverseGeocode(coords).then(addressString => {
          console.log("Определен адрес:", addressString);
          setDetectedAddress(addressString || 'Не удалось определить адрес');
          setLocationStage('confirming_auto');
        }).catch(err => {
          console.error("Ошибка при обратном геокодировании:", err);
          setDetectedAddress('Ошибка определения адреса');
          setLocationStage('confirming_auto');
        });
        return;
      }
      console.log("Все еще в состоянии запроса геолокации...");
    }
  }, [ymapsReady, coords, isGeolocationAvailable, isGeolocationEnabled, geolocationError, locationStage, initialLocationConfirmed, reverseGeocode, handleLocationFallback, dispatch, currentCenter, showMainUI, showRoleSelection, needsRoleSelectionInitially]);
  const confirmLocation = coordsToConfirm => {
    if (locationProcessed.current) return;
    console.log("Подтверждение локации:", coordsToConfirm || "Москва (по умолчанию)");
    dispatch(setCenter(coordsToConfirm || MOSCOW_CENTER));
    setLocationStage('confirmed');
    locationProcessed.current = true;
    sessionStorage.setItem(LOCATION_CONFIRMED_KEY, 'true');
    setShowMainUI(true);
    setShowRoleSelection(false);
    setShowLocationModals(false);
  };
  const handleConfirmAutoAddress = () => {
    confirmLocation(autoCoords);
  };
  const handleChooseOtherAddress = () => {
    setLocationStage('entering_manual');
  };
  const handleConfirmManualAddress = coordinates => {
    confirmLocation(coordinates);
  };
  const handleRoleSelectionComplete = () => {
    setRoleConfirmed(true);
    setShowRoleSelection(false);
    setShowLocationModals(true);
    if (locationStage === 'confirmed' && locationProcessed.current) {
      console.log("Роль выбрана, локация уже подтверждена. Показ основного UI.");
      setShowMainUI(true);
    } else {
      console.log("Роль выбрана, показ UI локации разрешен. Текущий статус локации:", locationStage);
    }
  };
  const handleEmployerSelect = () => {
    const newCount = roleSelectionCount + 1;
    localStorage.setItem(ROLE_SELECTION_COUNT_KEY, newCount.toString());
    sessionStorage.setItem(ROLE_SELECTION_CONFIRM_KEY, 'true');
    handleRoleSelectionComplete();
    navigate('/newaccount');
  };
  const handleJobSeekerSelect = () => {
    sessionStorage.setItem(ROLE_SELECTION_CONFIRM_KEY, 'true');
    handleRoleSelectionComplete();
  };
  const renderStatusOrModal = () => {
    if (!showLocationModals || locationStage === 'confirmed' || locationStage === 'idle') {
      console.log("renderStatusOrModal: Скрыто. showLocationModals:", showLocationModals, "locationStage:", locationStage);
      return null;
    }
    console.log("renderStatusOrModal: Отображение для стадии:", locationStage);
    switch (locationStage) {
      case 'requesting':
        if (!coords && !geolocationError) {
          return <div className="fixed bottom-[25px] left-[25px] right-[25px] bg-[#242424] rounded-[15px] p-[20px] z-[200] text-center">
                            <p className="text-white opacity-70">Запрос местоположения...</p>
                        </div>;
        }
        return null;
      case 'confirming_auto':
        return <ConfirmAddressModal address={detectedAddress} onConfirm={handleConfirmAutoAddress} onOther={handleChooseOtherAddress} />;
      case 'entering_manual':
        return <EnterAddressModal onConfirm={handleConfirmManualAddress} />;
      case 'error':
        return <div className="fixed bottom-[25px] left-[25px] right-[25px] bg-[#d9534f] rounded-[15px] p-[20px] z-[200] text-center">
                        <p className="text-white font-bold">Ошибка геолокации</p>
                        <p className="text-white opacity-90 text-sm mt-1">{locationError || "Не удалось определить местоположение."}</p>
                    </div>;
      default:
        return null;
    }
  };
  return <div className="flex flex-col justify-between h-full overflow-y-hidden">
            {}
            {showMainUI && <Header />}

            {}
            <Map />

            {}
            {showRoleSelection && <div className="fixed inset-0 flex items-center justify-center z-[300]">
                    <div className="fixed left-[20px] right-[20px] bg-[#242424] rounded-[15px] p-[10px] z-[200]" style={{
        bottom: "calc(max(var(--tg-safe-area-inset-bottom, 10px), 10px) + 10px)"
      }}>
                        <div className="flex flex-col gap-[20px]">
                            <p className="text-white text-[12px] uppercase font-bold text-center">Выберите вашу роль</p>
                            {}
                            <div className="flex gap-2.5 mt-2">
                                <button onClick={handleEmployerSelect} className="flex-1 bg-transparent text-white border-2 border-white rounded-[10px] py-2.5 px-4 text-[8px] font-bold uppercase" type="button">
                                    Работодатель
                                </button>
                                <button onClick={handleJobSeekerSelect} className="flex-1 bg-white text-[#242424] rounded-[10px] py-2.5 px-4 text-[8px] font-bold uppercase disabled:opacity-50" type="button">
                                    Соискатель
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}

            {}
            {renderStatusOrModal()}

            {}
            {showMainUI && <Footer />}
        </div>;
}
