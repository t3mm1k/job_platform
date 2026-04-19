import React from 'react';
function PositionFilter({
  positions,
  selectedPosition,
  onChange
}) {
  return <div className="filter-section">
            <select className="filter-select" id="position" value={selectedPosition} onChange={onChange}>
                <option className="text-[0.8rem]" value="">Выберите должность</option>
                {positions.map(position => <option className="text-[0.8rem]" key={position} value={position}>{position}</option>)}
            </select>
        </div>;
}
export default PositionFilter;
