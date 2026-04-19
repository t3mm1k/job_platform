import React from 'react';
function CityFilter({
  cities,
  selectedCity,
  onChange
}) {
  return <div className="filter-section">
            <select className="filter-select" id="city" value={selectedCity} onChange={onChange}>
                <option className="text-[0.8rem]" value="">Выберите город</option>
                {cities.map(city => <option className="text-[0.8rem]" key={city} value={city}>{city}</option>)}
            </select>
        </div>;
}
export default CityFilter;
