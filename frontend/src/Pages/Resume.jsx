import React from "react";
import Header from "../Components/Profile/Header/Header";
import Option from "../Components/Profile/Option/Option";
import Marketplace from "../Components/Vacancy/Marketplace/Marketplace";
import OptionsForm from "../Components/Profile/OptionsForm/OptionsForm";
import AccountSwitcher from "../Components/Profile/AccountSwitcher/AccountSwitcher";
import UserInfo from "../Components/Profile/UserInfo/UserInfo";
import Policy from "../Components/Profile/Policy/Policy";
import ResumeForm from "../Components/Resume/ResumeForm/ResumeForm";
import { backButton } from "@telegram-apps/sdk";
import { useNavigate } from "react-router-dom";
export default function () {
  const navigate = useNavigate();
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.show();
    backButton.onClick(() => {
      navigate('/profile');
    });
  }
  return <div className="w-full px-[15px] overflow-auto flex flex-col gap-4 font-bold text-[0.8rem] py-[20px]" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 10px)"
  }}>
            <ResumeForm />
        </div>;
}
