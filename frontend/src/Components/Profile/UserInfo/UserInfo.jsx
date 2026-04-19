import React from "react";
import { useSelector } from "react-redux";
function UserInfo({
  selectedCompanyId
}) {
  const store = useSelector(state => state);
  const company = store.company.userCompanies.find(company => company._id === selectedCompanyId);
  return <div className="flex gap-2 items-center px-2 py-2 bg-[var(--second-background-color)] rounded-[10px] relative z-0">
            {selectedCompanyId ? <div className="w-8 h-8 rounded-full overflow-hidden">
                    <div className="flex items-center justify-center w-full h-full bg-white">
                        <img src="/img/icons/company.svg"></img>
                    </div>
                </div> : <img src={store.user.avatar} alt="Аватар пользователя" className="rounded-full w-[32px]" />}
            {selectedCompanyId ? <div className="flex flex-col max-w-[90px]">
                    <div className="text-[0.6rem] text-white font-bold uppercase">{company.accountType === 'individual' ? company.fullName : company.companyName}</div>
                </div> : <div className="flex flex-col">
                    <span className="text-[0.6rem] text-white font-bold uppercase">{store.user.name}</span>
                    <span className="text-[0.5rem] text-white font-normal">ID: {store.user.id}</span>
                </div>}

        </div>;
}
export default UserInfo;
