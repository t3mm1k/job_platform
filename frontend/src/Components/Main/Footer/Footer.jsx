import React from 'react';
import { connect } from 'react-redux';
import Search from "./Search/Search";
import FooterButtons from "./FooterButtons/FooterButtons";
import ClusterSelection from "./ClusterSelection/ClusterSelection";
import Filter from "./Filter/Filter";
import { Link } from "react-router-dom";
function FooterComponent({
  isFilterOpen,
  isClusterSelectionOpen
}) {
  return <footer className="block relative rounded-[15px] mx-[20px] w-auto overflow-hidden bg-[#242424]" style={{
    marginBottom: "calc(max(var(--tg-safe-area-inset-bottom, 10px), 10px) + 10px)"
  }}>
            <Filter />
            <div className="flex flex-col w-full">
                <ClusterSelection />
                <Search />
                <FooterButtons />
            </div>
        </footer>;
}
const mapStateToProps = state => ({
  isFilterOpen: state.ui.isFilterOpen,
  isClusterSelectionOpen: state.ui.isClusterSelectionOpen
});
export default connect(mapStateToProps)(FooterComponent);
