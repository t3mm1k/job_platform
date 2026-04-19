import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCompanies } from '../store/slices/companySlice';
import Header from "../Components/Profile/Header/Header";
import OptionsForm from "../Components/Profile/OptionsForm/OptionsForm";
import AccountSwitcher from "../Components/Profile/AccountSwitcher/AccountSwitcher";
import UserInfo from "../Components/Profile/UserInfo/UserInfo";
import Policy from "../Components/Profile/Policy/Policy";
import CompanySelector from "../Components/Profile/CompanySelector/CompanySelector";
import BluredScreen from "../Components/Profile/BluredScreen/BluredScreen";
import { backButton } from "@telegram-apps/sdk";
import { useNavigate } from "react-router-dom";
import getSelectedCompanyId from "../utils/storage";
import Loader from "../Components/LoadingAnimation";
export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allCompanies = useSelector(state => state.company.allCompanies);
  const isTgMiniApp = useSelector(state => state.ui.isTgMiniApp);
  const loading = useSelector(state => state.company.loading);
  const error = useSelector(state => state.company.error);
  const isShowCompanySelector = useSelector(state => state.company.isShowCompanySelector);
  const selectedCompanyId = getSelectedCompanyId();
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.onClick(() => {
      navigate("/", {
        replace: true,
        relative: "route"
      });
    });
    backButton.show();
  }
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        await dispatch(fetchAllCompanies()).unwrap();
      } catch (err) {
        console.error("Failed to load companies:", err);
      }
    };
    loadCompanies();
  }, [dispatch]);
  if (loading === 'pending') {
    return <div className="flex items-center justify-center h-full">
                <Loader />
            </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Ошибка загрузки данных: {error}</div>
            </div>;
  }
  return <div className="w-full px-[15px] overflow-hidden flex flex-col gap-4 font-bold py-[20px] text-[0.8rem] relative h-full" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <BluredScreen />
            <Header isTgMiniApp={isTgMiniApp} />
            <UserInfo selectedCompanyId={selectedCompanyId} />
            <AccountSwitcher selectedCompanyId={selectedCompanyId} />
            <OptionsForm selectedCompanyId={selectedCompanyId} />
            <Policy />
            <CompanySelector isShow={isShowCompanySelector} companies={allCompanies} />
        </div>;
}
