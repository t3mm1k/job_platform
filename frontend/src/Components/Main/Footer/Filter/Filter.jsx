import React, { useEffect } from 'react';
import './Filter.css';
import { connect } from 'react-redux';
import { setVacancyTypeFilter, setTimeFilter, setMarketplacesFilter, setCityFilter, setPositionFilter, filterData, resetFilters, fetchVacancies } from '../../../../store/slices/vacanciesSlice';
import CityFilter from './FilterComponents/CityFilter';
import PositionFilter from './FilterComponents/PositionFilter';
import TimeFilter from "./FilterComponents/TimeFilter";
import VacancyTypeFilter from "./FilterComponents/VacancyTypeFilter";
import MarketplacesFilter from "./FilterComponents/MarketplacesFilter";
function FilterComponent({
  data,
  filters,
  isFilterOpen,
  setVacancyTypeFilter,
  setTimeFilter,
  setMarketplacesFilter,
  setCityFilter,
  setPositionFilter,
  filterData,
  resetFilters,
  fetchVacancies,
  closeFilters
}) {
  const uniqueCities = [...new Set(data.map(item => item?.address?.city).filter(Boolean))];
  const uniquePositions = [...new Set(data.map(item => item?.position).filter(Boolean))];
  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);
  const handleVacancyTypeChange = newValue => {
    setVacancyTypeFilter(newValue);
    filterData();
  };
  const handleTimeChange = newValue => {
    setTimeFilter(newValue);
    filterData();
  };
  const handleCityChange = event => {
    setCityFilter(event.target.value);
    filterData();
  };
  const handlePositionChange = event => {
    setPositionFilter(event.target.value);
    filterData();
  };
  const handleMarketplaceChange = event => {
    const selectedMarketplace = event.currentTarget.value;
    const isAlreadySelected = filters.marketplaces.includes(selectedMarketplace);
    let updatedMarketplaces;
    if (isAlreadySelected) {
      updatedMarketplaces = filters.marketplaces.filter(mp => mp !== selectedMarketplace);
    } else {
      updatedMarketplaces = [...filters.marketplaces, selectedMarketplace];
    }
    setMarketplacesFilter(updatedMarketplaces);
    filterData();
  };
  const timeFilterStyle = {
    maxHeight: filters.vacancy_type === "part-time" ? '100px' : '0px',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out'
  };
  return <div className={`filters-container ${!isFilterOpen ? 'collapsed' : ''}`}>
            <div className='filters-content'>
                <VacancyTypeFilter selectedVacancyType={filters.vacancy_type} onChange={handleVacancyTypeChange} />

                <div style={timeFilterStyle}>
                    <TimeFilter selectedTime={filters.time} onChange={handleTimeChange} />
                </div>

                <MarketplacesFilter selectedMarketplaces={filters.marketplaces} onChange={handleMarketplaceChange} />

                <span className="separator block opacity-[10%] h-px border-[white] border-[solid] border"></span>

                <CityFilter cities={uniqueCities} selectedCity={filters.city} onChange={handleCityChange} />

                <span className="separator block opacity-[10%] h-px border-[white] border-[solid] border"></span>

                <PositionFilter positions={uniquePositions} selectedPosition={filters.position} onChange={handlePositionChange} />

            </div>
        </div>;
}
const mapStateToProps = state => ({
  filters: state.vacancies.filters,
  data: state.vacancies.data,
  isFilterOpen: state.ui.isFilterOpen
});
const mapDispatchToProps = {
  setVacancyTypeFilter,
  setTimeFilter,
  setMarketplacesFilter,
  setCityFilter,
  setPositionFilter,
  filterData,
  resetFilters,
  fetchVacancies
};
const Filter = connect(mapStateToProps, mapDispatchToProps)(FilterComponent);
export default Filter;
