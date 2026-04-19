import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import getSelectedCompanyId from "../../../utils/storage";
import { setSelectedCompanyId } from "../../../store/slices/companySlice";
function Header() {
  const store = useSelector(state => state);
  const selectedCompanyId = getSelectedCompanyId();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.company.loading);
  const userCompanies = useSelector(state => state.company.userCompanies);
  const company = userCompanies.find(c => c._id === selectedCompanyId);
  useEffect(() => {
    if (selectedCompanyId && loading === "succeeded" && company === undefined) {
      dispatch(setSelectedCompanyId(null));
    }
  }, [selectedCompanyId, loading, company, dispatch]);
  return <header className=" flex relative bg-[#242424] rounded-[15px] justify-between px-[20px] py-[5px] items-center z-[100] mx-[20px]" style={{
    marginTop: "calc(max(var(--tg-content-safe-area-inset-top, 20px), 20px) + var(--tg-safe-area-inset-top, 0px))"
  }}>
            <img src="/img/icons/logo-dark.svg" alt="Логотип" />
            <div className="flex gap-2 items-center">
                {selectedCompanyId && company ? <div className="w-8 h-8 rounded-full overflow-hidden">
                        <div className="flex items-center justify-center w-full h-full bg-white">
                            <img src="/img/icons/company.svg"></img>
                        </div>
                    </div> : <img src={store.user.avatar} alt="Аватар пользователя" className="rounded-full w-[32px]" />}
                {selectedCompanyId && company ? <div className="flex flex-col max-w-[90px]">
                        <div className="text-[0.6rem] text-white font-bold uppercase">{company.accountType === 'individual' ? company.fullName : company.companyName}</div>
                    </div> : <div className="flex flex-col">
                        <span className="text-[0.6rem] text-white font-bold uppercase">{store.user.name}</span>
                        <span className="text-[0.5rem] text-white font-normal">ID: {store.user.id}</span>
                    </div>}
            </div>
        </header>;
}
export default Header;
