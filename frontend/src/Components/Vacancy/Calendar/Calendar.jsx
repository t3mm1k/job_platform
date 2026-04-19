import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, setYear, setMonth, subDays, lastDayOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
const Calendar = ({
  highlightedDates
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.getMonth());
  useEffect(() => {
    setCurrentMonth(setYear(setMonth(new Date(), selectedMonth), selectedYear));
  }, [selectedYear, selectedMonth]);
  useEffect(() => {
    setSelectedYear(currentMonth.getFullYear());
    setSelectedMonth(currentMonth.getMonth());
  }, [currentMonth]);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const firstDayOfWeek = 1;
  const emptyDaysAtStart = (firstDayOfMonth.getDay() + 6) % 7;
  const startDate = subDays(firstDayOfMonth, emptyDaysAtStart);
  const lastDate = subDays(lastDayOfMonth, -(7 - (lastDayOfMonth.getDay() === 0 ? 7 : lastDayOfMonth.getDay())));
  const calendarDates = eachDayOfInterval({
    start: startDate,
    end: lastDate
  });
  const isHighlighted = day => {
    if (!day) {
      return false;
    }
    return highlightedDates.some(dateString => {
      const date = parseDate(dateString);
      return date && isSameDay(day, date);
    });
  };
  const parseDate = dateString => {
    try {
      const parts = dateString.split('.').map(Number);
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(year, month - 1, day);
      }
      return null;
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return null;
    }
  };
  const handleYearChange = event => {
    setSelectedYear(parseInt(event.target.value));
  };
  const handleMonthChange = event => {
    setSelectedMonth(parseInt(event.target.value));
  };
  const monthOptions = Array.from({
    length: 12
  }, (_, i) => {
    const monthDate = new Date(2000, i, 1);
    return {
      value: i,
      label: format(monthDate, "LLLL", {
        locale: ru
      })
    };
  });
  const yearOptions = Array.from({
    length: 10
  }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return year;
  });
  const isPastMonthDay = day => {
    return day < firstDayOfMonth;
  };
  const isNextMonthDay = day => {
    return day > lastDayOfMonth;
  };
  return <div className="bg-[var(--second-background-color)] rounded-[11px] p-[15px] flex flex-col gap-[12px]">
            <div className="flex justify-between flex-grow">
                <div className="flex gap-[0.7rem] w-full text-[12px] text-center">
                    <select className="date-select" value={selectedMonth} onChange={handleMonthChange} style={{
          width: 0
        }}>
                        {monthOptions.map(month => <option key={month.value} value={month.value} className="font-bold">
                                {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
                            </option>)}
                    </select>
                    <select className="date-select" value={selectedYear} onChange={handleYearChange} style={{
          width: 0
        }}>
                        {yearOptions.map(year => <option key={year} value={year} className="font-bold">
                                {year}
                            </option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-[0.6rem]">
                {daysOfWeek.map(day => <div key={day} className="bg-white  text-[var(--second-background-color)] text-center font-normal rounded-[0.6rem]">
                        {day}
                    </div>)}
            </div>

            <div className="grid grid-cols-7 gap-2 text-[12px]">
                {calendarDates.map((day, index) => <div key={index} className={`font-medium text-white text-center rounded-[0.6rem] px-2 py-1 cursor-pointer
                        ${isHighlighted(day) ? 'text-white' : isPastMonthDay(day) || isNextMonthDay(day) ? 'bg-gray-800 opacity-50' : 'bg-gray-800 hover:bg-gray-700'}
                        `} style={{
        background: isHighlighted(day) ? 'linear-gradient(180deg, #28EA61 0%, #1CB742 100%)' : 'black',
        opacity: isPastMonthDay(day) || isNextMonthDay(day) ? '0.5' : '1'
      }}>
                        {format(day, "d")}
                    </div>)}
            </div>
        </div>;
};
export default Calendar;
