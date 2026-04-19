import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { backButton } from "@telegram-apps/sdk";
import getSelectedCompanyId from "../utils/storage";
import * as api from "../api/client";
const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  name,
  error
}) => <div className="mb-[15px]">
        <label className={`block mb-1 text-[8px]  ${error ? 'text-[#EE003B] opacity-100' : 'opacity-50'}`}>{label}</label>
        <input type={type} className={`text-[10px] w-full bg-[var(--second-background-color)] text-white border ${error ? "border-[#EE003B]" : "border-white"} opacity-50 rounded-[10px] p-[10px] focus:opacity-100 active:opacity-100 resize-none`} placeholder={placeholder} value={value} onChange={onChange} name={name} />
        {}
    </div>;
const ToggleButton = ({
  isActive,
  onClick,
  children
}) => <button className={`toggle-button flex-grow w-0 ${isActive ? 'active' : ''}`} onClick={onClick}>
        <span className={`circle ${isActive ? 'active' : ''}`}></span>
        {children}
    </button>;
const AddressSuggestionItem = ({
  suggestion,
  onClick
}) => <div className="search-prompt flex flex-col px-[10px] py-[5px] border-b border-white/10 cursor-pointer hover:bg-[#444]" onClick={onClick}>
        <p className="font-bold text-[10px] uppercase text-white">{suggestion.main}</p>
        <p className="opacity-70 text-[8px] text-white/80">{suggestion.adInfo}</p>
    </div>;
function formatPhone(value) {
  let cleaned = ('' + value).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = '+' + cleaned.substring(1).replace(/[^\d]/g, '');
  } else {
    cleaned = cleaned.replace(/[^\d]/g, '');
  }
  if (cleaned.startsWith('8')) {
    cleaned = '+7' + cleaned.substring(1);
  } else if (cleaned.length === 10 && cleaned.startsWith('9')) {
    cleaned = '+7' + cleaned;
  } else if (!cleaned.startsWith('+') && cleaned.length > 0) {
    cleaned = '+' + cleaned;
  }
  const match = cleaned.match(/^(\+?\d{1,1})?(\d{0,3})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/);
  if (!match) {
    return value;
  }
  let formatted = '';
  if (match[1]) formatted += match[1];
  if (match[2]) formatted += (formatted.length > 1 ? ' ' : '') + match[2];
  if (match[3]) formatted += (match[2].length === 3 ? ' ' : '') + match[3];
  if (match[4]) formatted += (match[3].length === 3 ? '-' : '') + match[4];
  if (match[5]) formatted += (match[4].length === 2 ? '-' : '') + match[5];
  return formatted.substring(0, 16);
}
const AddressInput = ({
  addressInputValue,
  addressSuggestions,
  handleAddressInputChange,
  handleAddressSuggestionClick,
  ymapsReady,
  setAddress,
  setAddressSuggestions,
  error
}) => {
  const addressInputRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setAddressSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addressInputRef, setAddressSuggestions]);
  return <div className="mb-[15px] relative" ref={addressInputRef}>
            <label className={`block mb-1 text-[8px]  ${error ? 'text-[#EE003B] opacity-100' : 'opacity-50'}`}>ЮРИДИЧЕСКИЙ АДРЕС</label>
            <input type="text" className={`form-field text-[10px] w-full bg-[var(--second-background-color)] text-white border ${error ? "border-[#EE003B]" : "border-white"} opacity-50 rounded-[10px] p-[10px] focus:opacity-100 active:opacity-100 resize-none`} placeholder="Россия, г. Москва..." value={addressInputValue} onChange={handleAddressInputChange} disabled={!ymapsReady} onBlur={() => setAddress(addressInputValue)} />
            {}
            {addressSuggestions.length > 0 && <div className="absolute top-full left-0 right-0 mt-1 bg-[#3a3a3a] rounded-[10px] border border-white/20 overflow-hidden shadow-lg max-h-[300px] overflow-y-auto z-10">
                    {addressSuggestions.map((suggestion, index) => <AddressSuggestionItem key={index} suggestion={suggestion} onClick={() => handleAddressSuggestionClick(suggestion)} />)}
                </div>}
        </div>;
};
const IndividualForm = ({
  addressInputValue,
  addressSuggestions,
  handleAddressInputChange,
  handleAddressSuggestionClick,
  ymapsReady,
  setFormData,
  formData,
  setAddressSuggestions,
  errors
}) => {
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handlePhoneChange = e => {
    const {
      name,
      value
    } = e.target;
    const formattedPhoneNumber = formatPhone(value);
    setFormData({
      ...formData,
      [name]: formattedPhoneNumber
    });
  };
  return <>
            <InputField label="ВАШЕ ФИО *" placeholder="Иванов Иван Иванович" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} error={errors.fullName} />
            <InputField label="ИНН" placeholder="771234780982" name="inn" value={formData.inn || ''} onChange={handleInputChange} error={errors.inn} />
            <InputField label="ОГРНИП" placeholder="777456092345847" name="ogrnip" value={formData.ogrnip || ''} onChange={handleInputChange} error={errors.ogrnip} />
            <AddressInput addressInputValue={addressInputValue} addressSuggestions={addressSuggestions} handleAddressInputChange={handleAddressInputChange} handleAddressSuggestionClick={handleAddressSuggestionClick} ymapsReady={ymapsReady} setAddress={address => setFormData({
      ...formData,
      legalAddress: address
    })} setAddressSuggestions={setAddressSuggestions} error={errors.legalAddress} />
            <InputField label="НОМЕР ТЕЛЕФОНА" placeholder="+7 (987) 654-32-10" name="phone" value={formData.phone || ''} onChange={handlePhoneChange} error={errors.phoneNumber} />
        </>;
};
const CompanyForm = ({
  addressInputValue,
  addressSuggestions,
  handleAddressInputChange,
  handleAddressSuggestionClick,
  ymapsReady,
  setFormData,
  formData,
  setAddressSuggestions,
  errors
}) => {
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handlePhoneChange = e => {
    const {
      name,
      value
    } = e.target;
    const formattedPhoneNumber = formatPhone(value);
    setFormData({
      ...formData,
      [name]: formattedPhoneNumber
    });
  };
  return <>
            <InputField label="ПОЛНОЕ НАИМЕНОВАНИЕ *" placeholder='Общество с ограниченной ответственностью "ПВЗшник"' name="companyName" value={formData.companyName || ''} onChange={handleInputChange} error={errors.companyName} />
            <AddressInput addressInputValue={addressInputValue} addressSuggestions={addressSuggestions} handleAddressInputChange={handleAddressInputChange} handleAddressSuggestionClick={handleAddressSuggestionClick} ymapsReady={ymapsReady} setAddress={address => setFormData({
      ...formData,
      legalAddress: address
    })} setAddressSuggestions={setAddressSuggestions} error={errors.legalAddress} />
            <InputField label="ИНН" placeholder="771234780982" name="inn" value={formData.inn || ''} onChange={handleInputChange} error={errors.inn} />
            <InputField label="КПП" placeholder="777456092345847" name="kpp" value={formData.kpp || ''} onChange={handleInputChange} error={errors.kpp} />
            <InputField label="ОГРН" placeholder="12389543234" name="ogrn" value={formData.ogrn || ''} onChange={handleInputChange} error={errors.ogrn} />
            <InputField label="НОМЕР ТЕЛЕФОНА" placeholder="+7 (987) 654-32-10" name="phone" value={formData.phone || ''} onChange={handlePhoneChange} error={errors.phoneNumber} />
        </>;
};
const MyCompany = () => {
  const navigate = useNavigate();
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.show();
    backButton.onClick(() => {
      navigate('/profile');
    });
  }
  const selectedCompanyId = getSelectedCompanyId();
  const store = useSelector(state => state);
  const company = store.company.userCompanies.find(company => company._id === selectedCompanyId);
  console.log(company);
  const [accountType, setAccountType] = useState('individual');
  const [addressInputValue, setAddressInputValue] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [ymapsReady, setYmapsReady] = useState(false);
  const [formData, setFormData] = useState(company);
  const [errors, setErrors] = useState({});
  const userId = useSelector(state => state.user.id);
  const isTgMiniApp = useSelector(state => state.ui.isTgMiniApp);
  useEffect(() => {
    if (window.ymaps3 && window.ymaps3.ready) {
      window.ymaps3.ready.then(() => setYmapsReady(true));
    }
  }, []);
  const handleAccountTypeChange = type => {
    setAccountType(type);
    setFormData({});
    setAddressInputValue('');
    setAddressSuggestions([]);
    setErrors({});
  };
  const getAddressSuggestions = useCallback(async text => {
    if (!ymapsReady || text.trim() === "") {
      setAddressSuggestions([]);
      return;
    }
    try {
      const result = await window.ymaps3.search({
        searchOptions: {
          suggest: true
        },
        text: text
      });
      const prompts = result.filter(item => item.geometry?.coordinates).map(item => ({
        main: item.properties.name,
        adInfo: item.properties.description || '',
        coordinates: item.geometry.coordinates,
        city: item.properties.city
      }));
      setAddressSuggestions(prompts.slice(0, 5));
    } catch (error) {
      console.error("Address search error:", error);
      setAddressSuggestions([]);
    }
  }, [ymapsReady]);
  const handleAddressInputChange = event => {
    const value = event.target.value;
    setAddressInputValue(value);
    getAddressSuggestions(value);
    setErrors(prevErrors => ({
      ...prevErrors,
      legalAddress: ''
    }));
  };
  const handleAddressSuggestionClick = suggestion => {
    const fullAddress = `${suggestion.adInfo ? suggestion.adInfo + ', ' : ''}${suggestion.main}`;
    setAddressInputValue(fullAddress);
    setAddressSuggestions([]);
    setFormData(prevFormData => ({
      ...prevFormData,
      legalAddress: fullAddress
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      legalAddress: ''
    }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (accountType === 'individual') {
      if (!formData.fullName) {
        newErrors.fullName = 'Поле "ФИО" обязательно для заполнения';
      }
    } else if (accountType === 'company') {
      if (!formData.companyName) {
        newErrors.companyName = 'Поле "Полное наименование" обязательно для заполнения';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (!validateForm()) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    try {
      await api.saveCompany({
        company_id: selectedCompanyId,
        creator_id: userId,
        accountType: accountType,
        phone: formData.phone && formData.phone.trim() ? formData.phone.trim() : "+70000000000",
        legalAddress: formData.legalAddress || "",
        inn: formData.inn || "",
        fullName: formData.fullName || "",
        ogrnip: formData.ogrnip || "",
        companyName: formData.companyName || "",
        kpp: formData.kpp || "",
        ogrn: formData.ogrn || ""
      });
      alert('Информация сохранена');
      navigate('/profile');
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Failed to create company. See console for details.');
    }
  };
  return <div className="flex flex-col w-full p-[20px] bg-[var(--first-background-color)] text-white font-bold overflow-x-scroll" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <header className="relative flex items-center mb-5">
                {isTgMiniApp === false && <button className="flex items-center justify-center gap-[5px] text-[0.8rem] font-normal" onClick={() => navigate(-1)}>
                        <img src="/img/icons/arrow-left.svg" alt="Назад" />
                        Назад
                    </button>}
                <h1 className="text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Создание аккаунта</h1>
            </header>

            <div className="flex justify-between gap-[7px] mb-[15px]">
                <ToggleButton isActive={accountType === 'individual'} onClick={() => handleAccountTypeChange('individual')}>
                    ИП
                </ToggleButton>
                <ToggleButton isActive={accountType === 'company'} onClick={() => handleAccountTypeChange('company')}>
                    Организация
                </ToggleButton>
            </div>

            {accountType === 'individual' ? <IndividualForm addressInputValue={addressInputValue} addressSuggestions={addressSuggestions} handleAddressInputChange={handleAddressInputChange} handleAddressSuggestionClick={handleAddressSuggestionClick} ymapsReady={ymapsReady} setFormData={setFormData} formData={formData} setAddressSuggestions={setAddressSuggestions} errors={errors} /> : <CompanyForm addressInputValue={addressInputValue} addressSuggestions={addressSuggestions} handleAddressInputChange={handleAddressInputChange} handleAddressSuggestionClick={handleAddressSuggestionClick} ymapsReady={ymapsReady} setFormData={setFormData} formData={formData} setAddressSuggestions={setAddressSuggestions} errors={errors} />}

            <p className="text-center mb-4 text-[8px] opacity-50">ЕСЛИ НЕ ХОТИТЕ ПРИНИМАТЬ ЗВОНКИ, ТО ОТКЛИКИ БУДУТ ПРИХОДИТЬ В TELEGRAM</p>
            {}
            {}
            {}

            <button className="w-full py-[10px] bg-white font-bold rounded-[10px] text-[8px] text-black" onClick={handleSave}>
                СОХРАНИТЬ
            </button>

            <p className="text-center mt-4 text-[8px] opacity-50">* ПОМЕЧЕНЫ ПОЛЯ ОБЯЗАТЕЛЬНЫЕ К ЗАПОЛНЕНИЮ</p>
        </div>;
};
export default MyCompany;
