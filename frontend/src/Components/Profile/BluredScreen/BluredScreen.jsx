import { toggleIsShowCompanySelector } from "../../../store/slices/companySlice";
import { connect } from "react-redux";
function BluredScreenComponent({
  isShowCompanySelector,
  toggleIsShowCompanySelector
}) {
  const handleClick = () => {
    if (isShowCompanySelector) {
      toggleIsShowCompanySelector();
    }
  };
  return <div className={`fixed inset-0 bg-black/80 z-10 ${isShowCompanySelector ? "" : "hidden"}`} onClick={handleClick}>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="fixed z-20 top-3 right-3" onClick={handleClick}>
                <path d="M18 6.66663L6 18.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6.66663L18 18.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>;
}
const mapStateToProps = state => ({
  isShowCompanySelector: state.company.isShowCompanySelector
});
const mapDispatchToProps = dispatch => ({
  toggleIsShowCompanySelector: () => dispatch(toggleIsShowCompanySelector())
});
export default connect(mapStateToProps, mapDispatchToProps)(BluredScreenComponent);
