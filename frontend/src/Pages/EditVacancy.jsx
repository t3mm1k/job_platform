import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import JobTypeChoice from "../Components/NewVacancy/JopChoiceType";
import MarketplaceSelection from "../Components/NewVacancy/MarketplaceSelection";
import PhotoUpload from "../Components/NewVacancy/PhotoUpload";
import Input from "../Components/NewVacancy/Input";
import Textarea from "../Components/NewVacancy/Textarea";
import Calendar from "../Components/EditVacancy/Calendar";
import { useDispatch, useSelector } from "react-redux";
import { backButton } from "@telegram-apps/sdk";
import getSelectedCompanyId from "../utils/storage";
import suggestion from "../utils/suggestions";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const EditVacancyForm = () => {
  const {
    id
  } = useParams();
  const YANDEX_MAPS_API_KEY = process.env.REACT_APP_YANDEX_MAPS_API_KEY;
  const navigate = useNavigate();
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.show();
    backButton.onClick(() => {
      navigate('/myvacancies');
    });
  }
  const store = useSelector(state => state);
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
  const addressInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const isTgMiniApp = store.ui.isTgMiniApp;
  useEffect(() => {
    const vacancyFromStore = store.vacancies.data.find(vacancy => vacancy._id === id);
    if (vacancyFromStore) {
      let vacancyData = {
        ...vacancyFromStore
      };
      console.log("Vacancy from store", {
        ...vacancyFromStore
      });
      setSelectedTime(vacancyFromStore.work_duration);
      setFormData(vacancyData);
      setAddressInputValue(vacancyData.address.address);
      setImagePreviews(vacancyData.photo.map(photo => `${REACT_APP_API_URL}${photo}`));
    } else {
      if (!store.vacancies.loading && !store.vacancies.error) {
        alert('Vacancy not found.');
        navigate('/myvacancies');
      }
    }
  }, [id, navigate, store.vacancies.data, store.vacancies.loading, store.vacancies.error]);
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
    setFormData(prevFormData => {
      let newValue = value;
      if (type === 'file') {
        newValue = Array.from(files);
      }
      return {
        ...prevFormData,
        [name]: newValue
      };
    });
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
    if (!isNaN(parsedValue)) {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: parsedValue
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: ''
      }));
    }
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
      } else {
        setAddressSuggestions([]);
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
    if (!formData.position) {
      newErrors.position = 'Поле "Должность" обязательно для заполнения';
    }
    if (!formData.salary) {
      newErrors.salary = 'Поле "Ставка" обязательно для заполнения';
    }
    if (!formData.payment) {
      newErrors.payment = 'Поле "Выплаты" обязательно для заполнения';
    }
    if (!formData.address.address) {
      newErrors.address = 'Поле "Адрес" обязательно для заполнения';
    }
    if (!formData.marketplace) {
      newErrors.marketplace = 'Поле "Маркетплейс" обязательно для заполнения';
    }
    if (formData.vacancy_type === 'full-time') {
      if (!formData.schedule) {
        newErrors.schedule = 'Поле "График работы" обязательно для заполнения';
      }
    } else if (formData.vacancy_type === 'part-time') {
      if (!formData.work_duration) {
        newErrors.work_duration = 'Поле "Продолжительность работы" обязательно для заполнения';
      }
      if (!formData.dates || formData.dates.length === 0) {
        newErrors.dates = 'Поле "Свободные даты" обязательно для заполнения';
      }
    }
    console.log(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'photo' || key === 'dates') continue;
      if (key === 'address') {
        for (const addressKey in formData.address) {
          formDataToSend.append(`address_${addressKey}`, formData.address[addressKey]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
    if (formData.photo && Array.isArray(formData.photo)) {
      formData.photo.forEach(fileOrPath => {
        if (typeof fileOrPath === 'string') {
          formDataToSend.append('existing_files', fileOrPath);
        } else if (fileOrPath instanceof File) {
          formDataToSend.append('files', fileOrPath);
        }
      });
    }
    if (formData.dates && Array.isArray(formData.dates)) {
      formData.dates.forEach(date => {
        console.log('date', date);
        formDataToSend.append('dates', date);
      });
    }
    try {
      const response = await fetch(`${REACT_APP_API_URL}/vacancies/${id}`, {
        method: 'PUT',
        body: formDataToSend
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Vacancy updated successfully:', data);
        navigate('/myvacancies');
      } else {
        console.error('Error updating vacancy:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        alert('Ошибка при обновлении вакансии.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Произошла ошибка при сети.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const isPartTime = formData.vacancy_type === 'part-time';
  const handleMarketplaceBlur = () => {
    if (!formData.marketplace) {
      setFormData(prev => ({
        ...prev,
        marketplace: MarketplaceSelection.suggestions ? MarketplaceSelection.suggestions[0] : ""
      }));
    }
  };
  return <div className="flex flex-col w-full px-6 bg-[var(--first-background-color)] text-white font-bold overflow-x-scroll py-[20px]" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <header className="relative flex items-center mb-5">
                {isTgMiniApp === false && <button className="flex items-center justify-center gap-[5px] text-[0.8rem] font-normal" onClick={() => navigate(-1)}>
                        <img src="/img/icons/arrow-left.svg" alt="Назад" />
                        Назад
                    </button>}
                <h1 className="whitespace-nowrap text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Редактировать вакансию</h1>
            </header>

            {}
            {}
            {}
            {}

            <div style={{
      maxHeight: isPartTime ? '500px' : '0',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
      opacity: isPartTime ? '1' : '0',
      visibility: isPartTime ? 'visible' : 'hidden',
      marginBottom: isPartTime ? '15px' : '0px'
    }} className="flex flex-col gap-[15px]">
                <div>
                    <label className={`block mb-1 text-[8px] opacity-50 ${errors.work_duration ? 'text-[#EE003B]  opacity-100' : ''}`}>Варианты продолжительности работы*</label>

                    <div className={`grid grid-cols-2 grid-rows-2 gap-[7px]`}>
                        <button className={`toggle-button justify-center ${selectedTime === "1-day" ? "active" : ""}`} value="1-day" onClick={handleTimeButtonClick}>
                            1 день
                        </button>
                        <button className={`toggle-button justify-center ${selectedTime === "1-week" ? "active" : ""}`} value="1-week" onClick={handleTimeButtonClick}>
                            До 1 недели
                        </button>
                        <button className={`toggle-button justify-center ${selectedTime === "1-month" ? "active" : ""}`} value="1-month" onClick={handleTimeButtonClick}>
                            Более 1 месяца
                        </button>
                        <button className={`toggle-button justify-center ${selectedTime === "more-1-month" ? "active" : ""}`} value="more-1-month" onClick={handleTimeButtonClick}>
                            Более 1 месяца
                        </button>
                    </div>
                </div>

                <div>
                    {}
                    {}
                </div>
            </div>

            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}

            <MarketplaceSelection selectedMarketplace={formData.marketplace} onChange={handleChange} placeholder={errors.marketplace} onBlur={handleMarketplaceBlur} />

            <PhotoUpload photos={imagePreviews} onUpload={handleImageUpload} onRemove={handleRemoveImage} />

            <Input label="Должность*" name="position" value={formData.position} placeholder={errors.position} onChange={handleChange} suggestions={suggestion.position} onBlur={() => {
      if (!formData.position && Input.suggestions) {
        setFormData(prev => ({
          ...prev,
          position: Input.suggestions[0]
        }));
      }
    }} />
            {}

            <Input label={`Ставка ${formData.vacancy_type === "part-time" ? "за смену" : "в месяц"}*`} name="salary" value={formData.salary} placeholder={errors.salary} onChange={handleNumberChange} type="number" />
            {}

            <Input label="Выплаты*" name="payment" value={formData.payment} onChange={handleChange} placeholder={errors.payment} suggestions={isPartTime ? suggestion.paymentPartTime : suggestion.paymentFullTime} onBlur={() => {
      if (!formData.payment) {
        setFormData(prev => ({
          ...prev,
          payment: Input.suggestions ? Input.suggestions[0] : ""
        }));
      }
    }} />
            {}
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

            <button className={`w-full py-[10px] font-bold rounded-[10px] text-[8px] text-black ${isSubmitting ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-white text-black'}`} onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Обновление...' : 'Обновить вакансию'}
            </button>
            <p className="text-center mt-4 text-[8px] opacity-50">* ПОМЕЧЕНЫ ПОЛЯ ОБЯЗАТЕЛЬНЫЕ К ЗАПОЛНЕНИЮ</p>

        </div>;
};
export default EditVacancyForm;
