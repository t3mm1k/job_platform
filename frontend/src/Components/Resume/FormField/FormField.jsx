import React, { useEffect } from "react";
import './FormField.css';
function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  rows,
  name,
  handleChange,
  value,
  ref
}) {
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
  return <div className="mt-0 text-white">
            <label htmlFor={id} className="block font-semibold uppercase mb-1 opacity-50 focus:opacity-100 text-[8px]">
                {label}
            </label>
            {type === 'textarea' ? <textarea id={id} name={name || id} rows={rows || 4} value={value} className="text-[8px] form-field outline-0 w-full bg-[var(--first-background-color)] border border-white opacity-50 rounded-[10px] p-3 focus:opacity-100 active:opacity-100 resize-none" placeholder={placeholder} onChange={handleChange} /> : <input type={type} id={id} name={name || id} value={value} className="text-[8px] form-field outline-0 w-full bg-[var(--first-background-color)] border border-white opacity-50 rounded-[10px] p-3 focus:opacity-100" placeholder={placeholder} onChange={handleChange} />}
        </div>;
}
export default FormField;
