import './App.css';
import Main from "./Pages/Main";
import Vacancy from "./Pages/Vacancy";
import Profile from "./Pages/Profile";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Resume from "./Pages/Resume";
import React, { useEffect, useState } from "react";
import Favorites from "./Pages/Favorites";
import NewVacancy from "./Pages/NewVacancy";
import CreateAccount from "./Pages/CreateAccount";
import { init, initData } from "@telegram-apps/sdk";
import { useDispatch } from "react-redux";
import { setIsTgMiniApp } from "./store/slices/uiSlice";
import MyVacancies from "./Pages/MyVacancies";
import MyCompany from "./Pages/MyCompany";
import { useSelector } from "react-redux";
import { setUser, setFavorites } from "./store/slices/userSlice";
import LoadingAnimation from "./Components/LoadingAnimation";
import { fetchAllCompanies } from "./store/slices/companySlice";
import Oferta from "./Pages/Oferta";
import Policy from "./Pages/Policy";
import PreviewScreen from "./Pages/Preview";
import * as api from "./api/client";
function buildResumeState(raw, userRow) {
  if (raw) {
    return {
      first_name: raw.first_name ?? userRow?.first_name ?? "",
      last_name: raw.last_name ?? userRow?.last_name ?? "",
      phone: raw.phone ?? "",
      experience: raw.experience ?? "",
      desired_salary: raw.desired_salary ?? "",
      additional_info: raw.additional_info ?? ""
    };
  }
  return {
    first_name: userRow?.first_name ?? "",
    last_name: userRow?.last_name ?? "",
    phone: "",
    experience: "",
    desired_salary: "",
    additional_info: ""
  };
}
export default function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const isTgMiniApp = useSelector(state => state.ui.isTgMiniApp);
  useEffect(() => {
    const previewTimer = setTimeout(() => {
      setShowPreview(false);
    }, 1500);
    const initializeApp = async () => {
      try {
        init();
        dispatch(setIsTgMiniApp(true));
        initData.restore();
        const telegramUser = initData.user();
        if (!telegramUser) {
          console.error("Telegram user data not found.");
          return;
        }
        const userData = await api.upsertUserFromTelegram(telegramUser);
        let resume = null;
        let favoriteIds = [];
        try {
          resume = await api.getResume(telegramUser.id);
        } catch {
          resume = null;
        }
        try {
          favoriteIds = await api.getFavoriteVacancyIds(telegramUser.id);
        } catch {
          favoriteIds = [];
        }
        dispatch(setUser({
          ...userData,
          resume: buildResumeState(resume, userData)
        }));
        dispatch(setFavorites(Array.isArray(favoriteIds) ? favoriteIds : []));
        await dispatch(fetchAllCompanies()).unwrap();
      } catch (error) {
        console.error("Error initializing app:", error);
        alert(error.message);
        dispatch(setIsTgMiniApp(false));
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
    return () => clearTimeout(previewTimer);
  }, [dispatch]);
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Enter') {
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleBlur = () => {
      console.log("handleBlurScroll");
      window.scrollTo(0, 0);
    };
    document.addEventListener('blur', handleBlur, true);
    return () => {
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);
  if (showPreview) {
    return <PreviewScreen />;
  }
  return <>
            {isTgMiniApp === false ? <div className="bg-[var(--first-background-color)] h-screen text-white py-5 px-4 flex flex-col" style={{
      paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
    }}>
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <h1 className="text-center font-bold text-[16px]">
                            Доступно в телеграме
                        </h1>
                        <a href="https://t.me/sinwhiljob_bot">Перейти</a>
                    </div>
                </div> : isLoading ? <LoadingAnimation /> : <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Main />} />
                            <Route path="/vacancy/:id" element={<Vacancy />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/resume" element={<Resume />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/newvacancy" element={<NewVacancy />} />
                            <Route path="/newaccount" element={<CreateAccount />} />
                            <Route path="/myvacancies" element={<MyVacancies />} />
                            <Route path="/mycompany" element={<MyCompany />} />
                            <Route path="/oferta" element={<Oferta />} />
                            <Route path="/policy" element={<Policy />} />
                        </Routes>
                    </BrowserRouter>}
        </>;
}
