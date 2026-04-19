import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SearchPromt from "./SearchPromt";
import './Search.css';
import { updateSearchPrompts, setSearchValue, setSearchResult } from '../../../../store/slices/searchSlice';
function Search({
  isSearchOpen,
  updateSearchPrompts,
  searchPrompts,
  searchValue,
  setSearchValue,
  setSearchResult
}) {
  useEffect(() => {
    if (!window.ymaps3 || !window.ymaps3.ready) return;
    async function ymapsReadyWrapper() {
      await window.ymaps3.ready;
    }
    ymapsReadyWrapper();
  }, []);
  const handleInputChange = event => {
    const value = event.target.value;
    setSearchValue(value);
    if (value.trim() === "") {
      updateSearchPrompts([]);
      return;
    }
    async function getSuggestions() {
      if (!window.ymaps3) return;
      await window.ymaps3.ready;
      try {
        const searchResult = await window.ymaps3.search({
          searchOptions: {
            suggest: true
          },
          text: value
        });
        const prompts = searchResult.map(item => ({
          main: item.properties.name,
          adInfo: item.properties.description || '',
          coordinates: item.geometry.coordinates
        }));
        updateSearchPrompts(prompts.slice(0, 5));
      } catch (error) {
        console.error("Search error:", error);
      }
    }
    getSuggestions();
  };
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchPrompts.length > 0) {
        const firstPrompt = searchPrompts[0];
        const adInfoPart = firstPrompt.adInfo ? `${firstPrompt.adInfo}, ` : '';
        const fullText = `${adInfoPart}${firstPrompt.main}`;
        handlePromptClick(fullText, firstPrompt.coordinates);
      }
    }
  };
  const handlePromptClick = (promptValue, coordinates) => {
    setSearchValue(promptValue);
    setSearchResult(coordinates);
    updateSearchPrompts([]);
  };
  return <div className={`search ${!isSearchOpen ? 'collapsed' : ''}`}>
            <div className="flex flex-col px-[10px] py-[10px]">
                <div>
                    {searchPrompts.map((el, index) => <SearchPromt key={index} main={el.main} adInfo={el.adInfo} onClick={() => handlePromptClick(`${el.adInfo ? `${el.adInfo}, ` : ''}${el.main}`, el.coordinates)} />)}
                </div>
                <input type="text" className="search-input gap-2.5 border p-2.5 rounded-[10px] bg-[#242424] font-bold text-[8px] placeholder-white/50" placeholder="Поиск" value={searchValue} onChange={handleInputChange} onKeyDown={handleKeyDown} />
            </div>
        </div>;
}
const mapStateToProps = state => ({
  isSearchOpen: state.ui.isSearchOpen,
  searchPrompts: state.search.searchPrompts,
  searchValue: state.search.searchValue
});
const mapDispatchToProps = {
  updateSearchPrompts,
  setSearchValue,
  setSearchResult
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
