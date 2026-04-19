import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, setYear, setMonth, subDays, parse, isEqual } from 'date-fns';
import { ru } from 'date-fns/locale';
const Calendar = ({
  onDateChange,
  highlightedDates = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.getMonth());
  const parsedHighlightedDates = useMemo(() => {
    return highlightedDates.map(dateStr => parse(dateStr, 'dd.MM.yyyy', new Date())).filter(date => !isNaN(date));
  }, [highlightedDates]);
  const [selectedDatesSet, setSelectedDatesSet] = useState(() => new Set(parsedHighlightedDates.map(date => date.getTime())));
  useEffect(() => {
    const newTimestamps = new Set(parsedHighlightedDates.map(date => date.getTime()));
    if (!isEqualSets(selectedDatesSet, newTimestamps)) {
      setSelectedDatesSet(newTimestamps);
    }
  }, [parsedHighlightedDates]);
  const isHighlighted = useCallback(day => selectedDatesSet.has(day.getTime()), [selectedDatesSet]);
  const handleDateClick = useCallback(day => {
    const timestamp = day.getTime();
    setSelectedDatesSet(prev => {
      const newSet = new Set(prev);
      newSet.has(timestamp) ? newSet.delete(timestamp) : newSet.add(timestamp);
      return newSet;
    });
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const datesArray = Array.from(selectedDatesSet).map(timestamp => format(new Date(timestamp), 'dd.MM.yyyy'));
      onDateChange(datesArray);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [selectedDatesSet, onDateChange]);
  const monthOptions = useMemo(() => Array.from({
    length: 12
  }, (_, i) => ({
    value: i,
    label: format(new Date(2000, i, 1), "LLLL", {
      locale: ru
    })
  })), []);
  const yearOptions = useMemo(() => Array.from({
    length: 10
  }, (_, i) => new Date().getFullYear() - 5 + i), []);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const emptyDaysAtStart = (firstDayOfMonth.getDay() + 6) % 7;
  const startDate = subDays(firstDayOfMonth, emptyDaysAtStart);
  const lastDate = subDays(lastDayOfMonth, -(7 - (lastDayOfMonth.getDay() === 0 ? 7 : lastDayOfMonth.getDay())));
  const calendarDates = eachDayOfInterval({
    start: startDate,
    end: lastDate
  });
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const handleYearChange = event => {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
    setCurrentMonth(setYear(currentMonth, year));
  };
  const handleMonthChange = event => {
    const month = parseInt(event.target.value);
    setSelectedMonth(month);
    setCurrentMonth(setMonth(currentMonth, month));
  };
  return <div className="bg-[var(--second-background-color)] rounded-[11px] p-[15px] flex flex-col gap-[12px]">
            <div className="flex justify-between flex-grow">
                <div className="flex gap-[0.7rem] w-full text-[12px] text-center">
                    <select className="date-select" value={selectedMonth} onChange={handleMonthChange} style={{
          width: 0
        }}>
                        {monthOptions.map(month => <option key={month.value} value={month.value}>
                                {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
                            </option>)}
                    </select>
                    <select className="date-select" value={selectedYear} onChange={handleYearChange} style={{
          width: 0
        }}>
                        {yearOptions.map(year => <option key={year} value={year}>
                                {year}
                            </option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-[0.6rem]">
                {daysOfWeek.map(day => <div key={day} className="bg-white text-[var(--second-background-color)] text-center font-normal rounded-[0.6rem]">
                        {day}
                    </div>)}
            </div>

            <div className="grid grid-cols-7 gap-2 text-[12px]">
                {calendarDates.map((day, index) => {
        const isOtherMonth = day < firstDayOfMonth || day > lastDayOfMonth;
        return <div key={index} onClick={() => handleDateClick(day)} className={`font-medium text-center rounded-[0.6rem] px-2 py-1 cursor-pointer transition-colors ${isOtherMonth ? 'opacity-50' : ''}`} style={{
          background: isHighlighted(day) ? 'linear-gradient(180deg, #28EA61 0%, #1CB742 100%)' : 'var(--calendar-day-bg, #2D2D2D)',
          color: isHighlighted(day) ? 'white' : 'white'
        }}>
                            {format(day, "d")}
                        </div>;
      })}
            </div>
        </div>;
};
const isEqualSets = (a, b) => {
  if (a.size !== b.size) return false;
  for (const item of a) if (!b.has(item)) return false;
  return true;
};
export default React.memo(Calendar);
