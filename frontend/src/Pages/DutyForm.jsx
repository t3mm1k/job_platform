import React, { useState } from 'react';
import Input from "../Components/NewVacancy/Input";
import Textarea from "../Components/NewVacancy/Textarea";
import MarketplaceSelection from "../Components/NewVacancy/MarketplaceSelection";
import { useDispatch, useSelector } from "react-redux";
import { backButton } from "@telegram-apps/sdk";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/slices/userSlice";
const OnDutyEmployeeForm = () => {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [formData, setFormData] = useState({
    fio: '',
    number: '',
    experience: '',
    rate: '',
    city: '',
    marketplace: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useSelector(state => state.user.id);
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.show();
    backButton.onClick(() => {
      navigate('/profile');
    });
  }
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const handleToggleChange = event => {
    const newIsOnDuty = event.target.checked;
    setIsOnDuty(newIsOnDuty);
    if (!newIsOnDuty) {
      setFormData({
        fio: '',
        number: '',
        experience: '',
        rate: '',
        marketplace: ''
      });
      setErrors({});
    }
  };
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: String(value)
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleNumberChange = e => {
    const {
      name,
      value
    } = e.target;
    if (value === '' || /^\d*$/.test(value)) {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };
  const handleMarketplaceChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fio.trim()) newErrors.fio = 'ФИО обязательно для заполнения';
    if (!formData.city.trim()) newErrors.city = 'Город обязателен для заполнения';
    if (!formData.number.trim()) {
      newErrors.number = 'Номер телефона обязателен для заполнения';
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(formData.number)) {
      newErrors.number = 'Некорректный формат номера телефона';
    }
    if (!formData.experience.trim()) newErrors.experience = 'Опыт работы обязателен для заполнения';
    const rate = parseFloat(formData.rate);
    if (formData.rate.trim() === '' || isNaN(rate) || rate <= 0) {
      newErrors.rate = 'Ставка за смену обязательна и должна быть больше нуля';
    }
    if (!formData.marketplace) newErrors.marketplace = 'Маркетплейс обязателен для выбора';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const dataToSubmit = {
      _id: String(userId),
      ...formData
    };
    console.log("Отправка данных дежурного сотрудника:", dataToSubmit);
    try {
      const response = await fetch(`${REACT_APP_API_URL}/switch_duty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });
      if (!response.ok) throw new Error('Ошибка сервера');
      alert('Вы успешно встали на дежурство!');
      const userWithoutDutyActive = structuredClone(user);
      userWithoutDutyActive.duty_active = true;
      dispatch(setUser(userWithoutDutyActive));
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert('Произошла ошибка при попытке встать на дежурство. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const mainContainerStyle = "flex flex-col w-full p-5 bg-[var(--first-background-color)] text-white rounded-lg shadow-md";
  const titleStyle = "text-[1rem] font-semibold text-white text-center";
  return <div className={mainContainerStyle} style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <h2 className={titleStyle}>Дежурный сотрудник</h2>

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

                <form onSubmit={handleSubmit}>
                    <Input label="ГОРОД*" name="city" value={formData.city} onChange={handleChange} placeholder={errors.city} />
                    <Input label="ФИО*" name="fio" value={formData.fio} onChange={handleChange} placeholder={errors.fio} />
                    <Input label="Номер телефона*" name="number" type="tel" value={formData.number} onChange={handleChange} placeholder={errors.number} />

                    {}
                    <div className="mb-[15px]">
                        <label className={`block mb-1 text-[8px] opacity-50 ${errors.experience ? 'text-[#EE003B] opacity-100' : ''}`}>
                            Опыт работы*
                        </label>
                        <Textarea name="experience" value={formData.experience} onChange={handleChange} />
                        {}
                    </div>

                    <Input label="Ставка за смену (₽)*" name="rate" type="number" value={formData.rate} onChange={handleNumberChange} placeholder={errors.rate} />
                    <MarketplaceSelection selectedMarketplace={formData.marketplace} onChange={handleMarketplaceChange} placeholder={errors.marketplace} />

                    <div className="mt-[10px]"> {}
                        <p className="text-[8px] opacity-70 mb-2 text-center px-1"> {}
                            Нажимая кнопку «Встать на дежурство», вы подтверждаете потенциальную готовность выйти на смену до конца текущего дня.
                        </p>
                        <button type="submit" disabled={isSubmitting} className={`w-full py-[10px] font-bold rounded-[10px] text-[8px] transition-opacity duration-200 ease-in-out ${isSubmitting ? 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-70' : 'bg-white text-black hover:opacity-90'}`}>
                            {isSubmitting ? 'ОБРАБОТКА...' : 'ВСТАТЬ НА ДЕЖУРСТВО'}
                        </button>
                    </div>
                </form>
        </div>;
};
export default OnDutyEmployeeForm;
