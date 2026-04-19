import { toggleIsShowCompanySelector } from "../../../store/slices/companySlice";
import { connect } from "react-redux";
import getSelectedCompanyId from "../../../utils/storage";
function AccountSwitcher({
  toggleIsShowCompanySelector,
  selectedCompanyId
}) {
  return <button className="flex px-3 py-2 justify-between g-[10px] bg-[var(--second-background-color)] rounded-[10px] text-[0.9rem] items-center relative z-0" onClick={() => toggleIsShowCompanySelector()}>
            {}
            {}
            {}

            {}
            {}
            <p>{selectedCompanyId ? "Переключиться на пользователя" : "Переключиться на компанию"}</p>
            <img src="/img/icons/regroup.svg" />
        </button>;
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  toggleIsShowCompanySelector: companyId => dispatch(toggleIsShowCompanySelector())
});
export default connect(mapStateToProps, mapDispatchToProps)(AccountSwitcher);
