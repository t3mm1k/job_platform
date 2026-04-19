import React, { useState } from "react";
const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  suggestions = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleInputChange = e => {
    onChange(e);
    if (suggestions.length > 0) {
      setShowSuggestions(e.target.value.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };
  return <div className="mb-[15px] relative">
            <label className={`block mb-1 text-[8px] opacity-50 ${placeholder ? 'text-[#EE003B] opacity-100' : ''}`}>{label}</label>
            <input type={type} name={name} value={value} onChange={handleInputChange} className={`text-[10px] w-full bg-[var(--second-background-color)] text-white border ${placeholder ? "border-[#EE003B]" : "border-white"} opacity-50 rounded-[10px] p-[10px] focus:opacity-100 active:opacity-100 resize-none`} onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} onFocus={() => setShowSuggestions(suggestions.length > 0 && value.length > 0)} />
            {showSuggestions && <div className="absolute top-full left-0 right-0 mt-1 bg-[#3a3a3a] rounded-[10px] border border-white/20 overflow-hidden shadow-lg max-h-[300px] overflow-y-auto z-10">
                    {suggestions.map((suggestion, index) => <div key={index} className="search-prompt flex flex-col px-[10px] py-[5px] border-b border-white/10 cursor-pointer hover:bg-[#444]" onClick={() => {
        onChange({
          target: {
            name: name,
            value: suggestion
          }
        });
        setShowSuggestions(false);
      }}>
                            <p className="font-bold text-[8px] text-white">{suggestion}</p>
                        </div>)}
                </div>}
        </div>;
};
export default Input;
