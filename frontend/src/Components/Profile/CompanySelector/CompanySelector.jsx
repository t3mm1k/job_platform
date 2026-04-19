import React from 'react';
import { connect } from 'react-redux';
import { setSelectedCompanyId, toggleEditMode, toggleIsShowCompanySelector } from '../../../store/slices/companySlice';
import { useNavigate } from "react-router-dom";
import getSelectedCompanyId from "../../../utils/storage";
const truncateText = (text, maxLength = 25) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
function CompanySelectorComponent({
  userCompanies,
  user,
  setSelectedCompanyId,
  toggleEditMode,
  isEditMode,
  isShowCompanySelector,
  toggleIsShowCompanySelector
}) {
  const selectedCompanyId = getSelectedCompanyId();
  const navigate = useNavigate();
  const selectorStyle = {
    maxHeight: isShowCompanySelector ? '500px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out'
  };
  const handleNewCompanyClick = () => {
    if (userCompanies.length === 3) {
      alert('Можно добавить не больше 3 компаний');
      return;
    }
    toggleIsShowCompanySelector();
    navigate('/newaccount');
  };
  const addCompanyButtonHeight = isEditMode ? '0' : '50px';
  const addCompanyButtonOverflow = isEditMode ? 'hidden' : 'visible';
  return <div className="bg-[var(--second-background-color)] rounded-t-2xl overflow-hidden shadow-lg fixed bottom-0 w-screen mx-[-15px] z-30" style={selectorStyle}>
            <ul className="">
                <li key={user.id} className=" py-3 mx-4" style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
                    <button onClick={() => setSelectedCompanyId(null)} className="flex items-center justify-between w-full" style={{
          textAlign: 'left'
        }}>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                                <div className="flex items-center justify-center w-full h-full bg-white">
                                    <img src={user.avatar} alt={"Изображение пользователя"} />
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-200">
                                {truncateText(`${user.name}`)}
                            </span>
                        </div>
                        <div>
                            {selectedCompanyId == null || selectedCompanyId === '' ? <img src="/img/icons/selected_checkbox.svg" alt="Выбранная компания" /> : <img src="/img/icons/checkbox.svg" alt="Невыбранная компания" />}
                        </div>
                    </button>
                </li>
                {userCompanies.map((company, index, array) => <li key={company._id} className="py-3 mx-4" style={{
        borderBottom: index === array.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
      }}>
                        <button onClick={() => setSelectedCompanyId(company._id)} className="flex items-center justify-between w-full" style={{
          textAlign: 'left'
        }}>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                                    <div className="flex items-center justify-center w-full h-full bg-white">
                                        <img src="/img/icons/company.svg" alt={"Компания"} />
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-200">
                                    {truncateText(company.accountType === 'individual' ? company.fullName : company.companyName)}
                                </span>
                            </div>
                            <div>
                                {company._id === selectedCompanyId ? <img src="/img/icons/selected_checkbox.svg" alt="Выбранная компания" /> : <img src="/img/icons/checkbox.svg" alt="Невыбранная компания" />}
                            </div>
                        </button>
                    </li>)}
            </ul>

            <div className="px-4 py-3 text-[0.6rem] font-bold">
                <div style={{
        maxHeight: addCompanyButtonHeight,
        overflow: addCompanyButtonOverflow,
        transition: 'max-height 0.3s ease-in-out'
      }}>
                    <button onClick={handleNewCompanyClick} className="block w-full bg-white text-black py-3 rounded-xl mb-3">
                        ДОБАВИТЬ КОМПАНИЮ
                    </button>
                </div>

                <button onClick={toggleEditMode} className="block w-full bg-[var(--second-background-color)] border border-white text-white py-3 rounded-xl">
                    {isEditMode ? "ВЕРНУТЬСЯ К ВЫБОРУ" : "НАСТРОЙКИ"}
                </button>
            </div>
        </div>;
}
const mapStateToProps = state => ({
  userCompanies: state.company.userCompanies,
  user: state.user,
  isShowCompanySelector: state.company.isShowCompanySelector,
  isEditMode: state.company.isEditMode
});
const mapDispatchToProps = dispatch => ({
  setSelectedCompanyId: companyId => dispatch(setSelectedCompanyId(companyId)),
  toggleEditMode: () => dispatch(toggleEditMode()),
  toggleIsShowCompanySelector: () => dispatch(toggleIsShowCompanySelector())
});
export default connect(mapStateToProps, mapDispatchToProps)(CompanySelectorComponent);
