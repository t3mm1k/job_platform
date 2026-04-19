import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import JobTypeChoice from "../Components/NewVacancy/JopChoiceType";
import MarketplaceSelection from "../Components/NewVacancy/MarketplaceSelection";
import PhotoUpload from "../Components/NewVacancy/PhotoUpload";
import Input from "../Components/NewVacancy/Input";
import Textarea from "../Components/NewVacancy/Textarea";
import Calendar from "../Components/NewVacancy/Calendar";
import { useDispatch, useSelector } from "react-redux";
import { backButton } from "@telegram-apps/sdk";
import getSelectedCompanyId from "../utils/storage";
import suggestion from "../utils/suggestions";
import * as api from "../api/client";
const NewVacancyForm = () => {
  const YANDEX_MAPS_API_KEY = process.env.REACT_APP_YANDEX_MAPS_API_KEY;
  const navigate = useNavigate();
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.show();
    backButton.onClick(() => {
      navigate('/');
    });
  }
  const store = useSelector(state => state);
  const allCompanies = useSelector(state => state.company.allCompanies);
  const [formData, setFormData] = useState({
    "vacancy_type": "full-time",
    "photo": [],
    "address": {
      "latitude": 0,
      "longitude": 0,
      "city": "",
      "address": ""
    },
    "marketplace": "",
    "position": "",
    "salary": "",
    "schedule": "",
    "dates": [],
    "work_duration": "",
    "payment": "",
    "experience": "",
    "extras": "",
    "scope": "",
    "additionalInfo": "",
    "employer_id": getSelectedCompanyId(),
    "phone_number": "",
    "is_active": true
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [addressInputValue, setAddressInputValue] = useState(formData.address.address);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressInputRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const isTgMiniApp = store.ui.isTgMiniApp;
  useEffect(() => {
    const handleClickOutside = event => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        if (addressSuggestions.length > 0) {
          const suggestion = addressSuggestions[0];
          const fullAddress = `${suggestion.description || ''}${suggestion.name}`;
          setFormData(prevFormData => ({
            ...prevFormData,
            address: {
              ...prevFormData.address,
              latitude: suggestion.latitude,
              longitude: suggestion.longitude,
              address: fullAddress,
              city: suggestion.city || ''
            }
          }));
          setAddressInputValue(fullAddress);
          setErrors(prevErrors => ({
            ...prevErrors,
            address: ''
          }));
        }
        setAddressSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dispatch, addressSuggestions, formData.address.address]);
  const handleChange = e => {
    const {
      name,
      value,
      type,
      files
    } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'file' ? Array.from(files) : value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };
  const handleNumberChange = e => {
    const {
      name,
      value
    } = e.target;
    const parsedValue = parseInt(value, 10);
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: isNaN(parsedValue) ? '' : parsedValue
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };
  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    setFormData(prevFormData => ({
      ...prevFormData,
      photo: [...prevFormData.photo, ...files]
    }));
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };
  const handleRemoveImage = indexToRemove => {
    setFormData(prevFormData => ({
      ...prevFormData,
      photo: prevFormData.photo.filter((_, index) => index !== indexToRemove)
    }));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };
  const handleTimeButtonClick = e => {
    const {
      value
    } = e.target;
    setSelectedTime(value);
    setFormData(prevFormData => ({
      ...prevFormData,
      work_duration: value
    }));
  };
  const onFocus = () => {
    setTimeout(() => {
      window.scrollBy(0, 100);
    }, 300);
  };
  const closeKeyboard = e => {
    const target = e.target;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
      if (!target.closest("input") && !target.closest("textarea")) {
        activeElement.blur();
      }
    }
  };
  useEffect(() => {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', onFocus);
    });
    document.addEventListener("touchstart", closeKeyboard);
    document.addEventListener("mousedown", closeKeyboard);
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', onFocus);
      });
      document.removeEventListener("touchstart", closeKeyboard);
      document.removeEventListener("mousedown", closeKeyboard);
    };
  }, [onFocus, closeKeyboard]);
  const handleDatesChange = useCallback(newDates => {
    setFormData(prevFormData => ({
      ...prevFormData,
      dates: newDates
    }));
  }, []);
  const getAddressSuggestions = useCallback(async text => {
    if (text.trim() === "") {
      setAddressSuggestions([]);
      return;
    }
    try {
      const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_MAPS_API_KEY}&geocode=${text}&format=json&results=5`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      if (data.response.GeoObjectCollection.featureMember) {
        const suggestions = data.response.GeoObjectCollection.featureMember.map(item => {
          const geoObject = item.GeoObject;
          const address = geoObject.metaDataProperty.GeocoderMetaData.Address;
          return {
            name: geoObject.name,
            description: geoObject.description,
            latitude: geoObject.Point.pos.split(" ")[1],
            longitude: geoObject.Point.pos.split(" ")[0],
            city: address.Components.find(c => c.kind === 'locality')?.name || ''
          };
        });
        setAddressSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Address search error:", error);
      setAddressSuggestions([]);
    }
  }, [YANDEX_MAPS_API_KEY]);
  const handleAddressInputChange = event => {
    const value = event.target.value;
    setAddressInputValue(value);
    getAddressSuggestions(value);
    setErrors(prevErrors => ({
      ...prevErrors,
      address: ''
    }));
  };
  const handleAddressSuggestionClick = suggestion => {
    const fullAddress = `${suggestion.description} ${suggestion.name}`;
    setAddressInputValue(fullAddress);
    setAddressSuggestions([]);
    setFormData(prevFormData => ({
      ...prevFormData,
      address: {
        ...prevFormData.address,
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
        address: fullAddress,
        city: suggestion.city || ''
      }
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      address: ''
    }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.position) newErrors.position = 'Поле "Должность" обязательно';
    if (!formData.salary) newErrors.salary = 'Поле "Ставка" обязательно';
    if (!formData.payment) newErrors.payment = 'Поле "Выплаты" обязательно';
    if (!formData.address.address) newErrors.address = 'Поле "Адрес" обязательно';
    if (!formData.marketplace) newErrors.marketplace = 'Поле "Маркетплейс" обязательно';
    if (formData.vacancy_type === 'full-time' && !formData.schedule) {
      newErrors.schedule = 'Поле "График работы" обязательно';
    } else if (formData.vacancy_type === 'part-time') {
      if (!formData.work_duration) newErrors.work_duration = 'Поле "Продолжительность" обязательно';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) {
      alert('Заполните все обязательные поля');
      return;
    }
    const selectedCompanyId = getSelectedCompanyId();
    const employerCompany = allCompanies.find(c => c._id === selectedCompanyId);
    const employerId = employerCompany?.creator_id;
    if (employerId == null) {
      alert('Выберите компанию в профиле');
      return;
    }
    setIsSubmitting(true);
    const descriptionParts = [formData.scope && `Объём: ${formData.scope}`, formData.extras && `Доп. сервисы: ${formData.extras}`, formData.additionalInfo && formData.additionalInfo].filter(Boolean);
    const description = descriptionParts.join("\n\n") || (formData.position ? `Вакансия: ${formData.position}` : "Вакансия");
    const fileToDataUrl = file => new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    try {
      const created = await api.createVacancy({
        employer_id: employerId,
        position: formData.position,
        description,
        salary: String(formData.salary),
        vacancy_type: formData.vacancy_type,
        schedule: formData.schedule || "",
        work_duration: formData.work_duration || "",
        payment: formData.payment,
        experience: formData.experience || "",
        marketplace: formData.marketplace,
        address: {
          latitude: Number(formData.address.latitude) || 0,
          longitude: Number(formData.address.longitude) || 0,
          city: formData.address.city || "",
          address: formData.address.address || ""
        }
      });
      for (const file of formData.photo) {
        const url = await fileToDataUrl(file);
        await api.uploadVacancyPhoto(created._id, url);
      }
      alert('Вакансия опубликована');
      navigate('/');
    } catch (error) {
      console.error('Ошибка создания:', error);
      alert(error.message || 'Ошибка при создании вакансии');
    } finally {
      setIsSubmitting(false);
    }
  };
  const isPartTime = formData.vacancy_type === 'part-time';
  const handleMarketplaceBlur = () => {
    if (!formData.marketplace) {
      setFormData(prev => ({
        ...prev,
        marketplace: MarketplaceSelection.suggestions?.[0] || ""
      }));
    }
  };
  return <div className="flex flex-col w-full px-6 bg-[var(--first-background-color)] text-white font-bold overflow-x-scroll py-[20px]" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <header className="relative flex items-center mb-5">
                {isTgMiniApp === false && <button className="whitespace-nowrap flex items-center justify-center gap-[5px] text-[0.8rem] font-normal" onClick={() => navigate(-1)}>
                        <img src="/img/icons/arrow-left.svg" alt="Назад" />
                        Назад
                    </button>}
                <h1 className="text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    Новая вакансия
                </h1>
            </header>

            <JobTypeChoice selectedVacancyType={formData.vacancy_type} onChange={handleChange} />

            <div style={{
      maxHeight: isPartTime ? '500px' : '0',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
      opacity: isPartTime ? '1' : '0',
      visibility: isPartTime ? 'visible' : 'hidden',
      marginBottom: isPartTime ? '15px' : '0px'
    }}>
                <div>
                    <label className={`block mb-1 text-[8px] ${errors.work_duration ? 'text-[#EE003B]' : 'opacity-50'}`}>
                        Варианты продолжительности работы*
                    </label>
                    <div className="grid grid-cols-2 grid-rows-2 gap-[7px]">
                        {["1-day", "1-week", "1-month", "more-1-month"].map(value => <button key={value} className={`toggle-button justify-center ${selectedTime === value ? "active" : ""}`} value={value} onClick={handleTimeButtonClick}>
                                {value === "1-day" && "1 день"}
                                {value === "1-week" && "До 1 недели"}
                                {value === "1-month" && "Более 1 месяца"}
                                {value === "more-1-month" && "Более 1 месяца"}
                            </button>)}
                    </div>
                </div>

                <div className="mt-3">
                    <label className={`block mb-1 text-[8px] ${errors.dates ? 'text-[#EE003B]' : 'opacity-50'}`}>
                        Укажите свободные даты*
                    </label>
                    <Calendar onDateChange={handleDatesChange} />
                </div>
            </div>

            <div className="relative mb-[15px]" ref={addressInputRef}>
                <label className={`block mb-1 text-[8px] ${errors.address ? 'text-[#EE003B]' : 'opacity-50'}`}>
                    Адрес *
                </label>
                <input type="text" className={`text-[10px] w-full bg-[var(--second-background-color)] text-white border ${errors.address ? "border-[#EE003B]" : "border-white opacity-50"} rounded-[10px] p-[10px] focus:opacity-100 active:opacity-100`} placeholder="Начните вводить адрес" value={addressInputValue} onChange={handleAddressInputChange} />
                {addressSuggestions.length > 0 && <div className="absolute top-full left-0 right-0 mt-1 bg-[#3a3a3a] rounded-[10px] border border-white/20 z-10">
                        {addressSuggestions.map((suggestion, index) => <div key={index} className="px-[10px] py-[5px] border-b border-white/10 cursor-pointer hover:bg-[#444]" onClick={() => handleAddressSuggestionClick(suggestion)}>
                                <p className="font-bold text-[10px] uppercase">{suggestion.name}</p>
                                <p className="opacity-70 text-[8px]">{suggestion.description}</p>
                            </div>)}
                    </div>}
            </div>

            <MarketplaceSelection selectedMarketplace={formData.marketplace} onChange={handleChange} placeholder={errors.marketplace} onBlur={handleMarketplaceBlur} />

            <PhotoUpload photos={imagePreviews} onUpload={handleImageUpload} onRemove={handleRemoveImage} />

            <Input label="Должность*" name="position" value={formData.position} placeholder={errors.position} onChange={handleChange} suggestions={suggestion.position} />

            <Input label={`Ставка ${isPartTime ? "за смену" : "в месяц"}*`} name="salary" value={formData.salary} placeholder={errors.salary} onChange={handleNumberChange} type="number" />

            <Input label="Выплаты*" name="payment" value={formData.payment} onChange={handleChange} placeholder={errors.payment} suggestions={isPartTime ? suggestion.paymentPartTime : suggestion.paymentFullTime} />

            <Input label="График работы*" name="schedule" value={formData.schedule} onChange={handleChange} placeholder={errors.schedule} suggestions={isPartTime ? suggestion.schedulePartTime : suggestion.scheduleFullTime} onBlur={() => {
      if (!formData.schedule) {
        setFormData(prev => ({
          ...prev,
          schedule: Input.suggestions ? Input.suggestions[0] : ""
        }));
      }
    }} />
            <Input label="Примерный объем работы (например, 100 штрих-кодов в день)" name="scope" value={formData.scope} onChange={handleChange} />
            {formData.position === "Оператор ПВЗ" && <Textarea label="Дополнительные сервисы, которые подключены на ПВЗ" name="extras" value={formData.extras} onChange={handleChange} />}

            <Textarea label="Наличие опыта у сотрудника" name="experience" value={formData.experience} onChange={handleChange} />

            <Textarea label="Дополнительная информация" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />

            {}
            {}
            {}
            <p className="text-center mb-2 text-[8px] opacity-80">
                {`Вакансия будет активна в течение ${isPartTime ? "14-ти" : "30-ти"} дней`}
            </p>

            <button className={`w-full py-[10px] font-bold rounded-[10px] text-[8px] bg-white text-black ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleSubmit} disabled={isSubmitting}>
                СОЗДАТЬ ВАКАНСИЮ
            </button>

            <p className="text-center mt-4 text-[8px] opacity-50">
                * ПОМЕЧЕНЫ ПОЛЯ ОБЯЗАТЕЛЬНЫЕ К ЗАПОЛНЕНИЮ
            </p>
        </div>;
};
export default NewVacancyForm;
