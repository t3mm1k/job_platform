import React from "react";
const Textarea = ({
  label,
  name,
  value,
  onChange
}) => {
  return <div className="mb-[15px]">
            <label className="block mb-1 text-[8px] opacity-50">{label}</label>
            <textarea name={name} value={value} onChange={onChange} className="min-h-[100px] text-[10px] w-full bg-[var(--second-background-color)] text-white border border-white opacity-50 rounded-[10px] p-[10px] focus:opacity-100 active:opacity-100 resize-none  " />
        </div>;
};
export default Textarea;
