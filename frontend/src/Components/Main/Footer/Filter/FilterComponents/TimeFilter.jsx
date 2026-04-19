import React from "react";
function TimeFilter({
  selectedTime,
  onChange
}) {
  const handleTimeButtonClick = event => {
    const newValue = event.currentTarget.value;
    const updatedValue = selectedTime === newValue ? "" : newValue;
    onChange(updatedValue);
  };
  return <div className={`grid grid-cols-2 grid-rows-2 gap-[7px]`}>
            <button className={`toggle-button justify-center ${selectedTime === "1-day" ? "active" : ""}`} value="1-day" onClick={handleTimeButtonClick}>
                1 день
            </button>
            <button className={`toggle-button justify-center ${selectedTime === "1-week" ? "active" : ""}`} value="1-week" onClick={handleTimeButtonClick}>
                До 1 недели
            </button>
            <button className={`toggle-button justify-center ${selectedTime === "1-month" ? "active" : ""}`} value="1-month" onClick={handleTimeButtonClick}>
                До 1 месяца
            </button>
            <button className={`toggle-button justify-center ${selectedTime === "more-1-month" ? "active" : ""}`} value="more-1-month" onClick={handleTimeButtonClick}>
                Более 1 месяца
            </button>
        </div>;
}
export default TimeFilter;
