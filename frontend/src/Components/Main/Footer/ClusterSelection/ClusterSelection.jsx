import React from 'react';
import { connect } from 'react-redux';
import Option from "./Option";
import './ClusterSelection.css';
import { setSelectedVacancy } from "../../../../store/slices/userSlice";
import { setIsClusterSelectionOpen } from "../../../../store/slices/uiSlice";
function ClusterSelection({
  isClusterSelectionOpen,
  clusterData,
  setSelectedVacancy
}) {
  return <div className={`cluster-selection ${!isClusterSelectionOpen ? 'collapsed' : ''}`}>
            <div className="flex flex-col px-[10px] bg-[#242424]">
                {clusterData.map((item, index) => <Option key={index} vacancy={item.properties} setSelectedVacancy={setSelectedVacancy} setIsClusterSelectionOpen={setIsClusterSelectionOpen} />)}
            </div>
        </div>;
}
const mapDispatchToProps = dispatch => ({
  setSelectedVacancy: data => dispatch(setSelectedVacancy(data)),
  setIsClusterSelectionOpen: value => dispatch(setIsClusterSelectionOpen(value))
});
const mapStateToProps = state => ({
  isClusterSelectionOpen: state.ui.isClusterSelectionOpen,
  clusterData: state.vacancies.clusterData
});
export default connect(mapStateToProps, mapDispatchToProps)(ClusterSelection);
