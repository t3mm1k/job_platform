import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchValue, updateSearchPrompts, setSearchResult } from '../../../store/slices/searchSlice';
function EnterAddressModal({
  onConfirm
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [selectedAddressString, setSelectedAddressString] = useState('');
  const [ymapsReady, setYmapsReady] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (window.ymaps3 && window.ymaps3.ready) {
      window.ymaps3.ready.then(() => setYmapsReady(true));
    }
    return () => {
      dispatch(updateSearchPrompts([]));
    };
  }, [dispatch]);
  const getSuggestions = useCallback(async text => {
    if (!ymapsReady || text.trim() === "") {
      setSuggestions([]);
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
        coordinates: item.geometry.coordinates
      }));
      setSuggestions(prompts.slice(0, 5));
    } catch (error) {
      console.error("Ошибка поиска адреса:", error);
      setSuggestions([]);
    }
  }, [ymapsReady]);
  const handleInputChange = event => {
    const value = event.target.value;
    setInputValue(value);
    setSelectedCoords(null);
    setSelectedAddressString('');
    getSuggestions(value);
  };
  const handleSuggestionClick = prompt => {
    const fullAddress = `${prompt.adInfo ? prompt.adInfo + ', ' : ''}${prompt.main}`;
    setInputValue(fullAddress);
    setSelectedCoords(prompt.coordinates);
    setSelectedAddressString(fullAddress);
    setSuggestions([]);
  };
  const handleConfirmClick = () => {
    if (selectedCoords && selectedAddressString) {
      dispatch(setSearchValue(selectedAddressString));
      dispatch(setSearchResult(selectedCoords));
      dispatch(updateSearchPrompts([]));
      onConfirm(selectedCoords);
    } else {
      console.warn("Пожалуйста, выберите адрес из подсказок.");
    }
  };
  return (<div className="fixed left-[25px] right-[25px] bg-[#242424] rounded-[15px] p-[10px] z-[200]" style={{
      bottom: "calc(max(var(--tg-safe-area-inset-bottom, 10px), 10px) + 10px)"
    }}>
            <div className="flex flex-col gap-4">
                {}
                <span className="text-white text-[8px] uppercase font-bold text-center">УКАЖИТЕ ВАШ ТЕКУЩИЙ АДРЕС</span>

                {}
                <div className="relative">
                    {}
                    <input type="text" className="w-full bg-transparent text-white border border-white/50 rounded-[10px] p-2.5 text-[8px] placeholder-white/50 focus:outline-none focus:border-white/70" placeholder="НАЧНИТЕ ВВОДИТЬ АДРЕС" value={inputValue} onChange={handleInputChange} />
                    {}
                    {suggestions.length > 0 && <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#3a3a3a] rounded-[10px] border border-white/20 overflow-hidden shadow-lg max-h-[300px] overflow-y-auto">
                            {suggestions.map((prompt, index) => <div key={index} className="search-prompt flex flex-col px-[10px] py-[5px] border-b border-white/10 cursor-pointer hover:bg-[#444]" onClick={() => handleSuggestionClick(prompt)}>
                                    <p className="font-bold text-[10px] uppercase text-white">{prompt.main}</p>
                                    <p className="opacity-70 text-[8px] text-white/80">{prompt.adInfo}</p>
                                </div>)}
                        </div>}
                </div>

                {}
                <button onClick={handleConfirmClick} className="w-full bg-white text-[#242424] rounded-[10px] p-[10px] text-[8px] font-bold uppercase" type="button" disabled={!selectedCoords || !selectedAddressString}>
                    ПОДТВЕРДИТЬ
                </button>
            </div>
        </div>
  );
}
export default EnterAddressModal;
