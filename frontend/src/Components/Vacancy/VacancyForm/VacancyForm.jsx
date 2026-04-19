import Header from "../Header/Header";
import Marketplace from "../Marketplace/Marketplace";
import InfoLabel from "../InfoLabel/InfoLabel";
import Calendar from "../Calendar/Calendar";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import getSelectedCompanyId from "../../../utils/storage";
import { backButton } from "@telegram-apps/sdk";
import * as api from "../../../api/client";
function VacancyForm() {
  const {
    id
  } = useParams();
  const store = useSelector(state => state);
  const resume = store.user.resume;
  const navigate = useNavigate();
  const selectedCompanyId = getSelectedCompanyId();
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.show();
    backButton.onClick(() => {
      navigate(-1);
    });
  }
  const selectedVacancy = store.vacancies.data.find(vacancy => vacancy._id === id);
  const allCompanies = store.company.allCompanies;
  const company = allCompanies.find(c => c.creator_id === selectedVacancy?.employer_id);
  if (!selectedVacancy || !company) {
    navigate("/");
    return null;
  }
  const phoneRaw = company.phone || "";
  const phoneNumber = phoneRaw.replace(/-/g, "").replace(/\s/g, "");
  const isFullTime = selectedVacancy.vacancy_type === "full-time";
  const highlightedDates = selectedVacancy.dates || [];
  const addr = selectedVacancy.address?.address || "";
  const vacancyText = `${isFullTime ? "Полная занятость" : "Частичная занятость"}, ${selectedVacancy.marketplace} по адресу ${addr}`;
  let respondText = `Здравствуйте! увидел(а) вашу вакансию на Sinwhil - @sinwhiljob_bot (${vacancyText}).\n`;
  let resumeText = "Вот мое резюме:\n";
  let hasContent = false;
  if (resume.first_name) {
    resumeText += `Имя: ${resume.first_name}\n`;
    hasContent = true;
  }
  if (resume.last_name) {
    resumeText += `Фамилия: ${resume.last_name}\n`;
    hasContent = true;
  }
  if (resume.phone) {
    resumeText += `Телефон: ${resume.phone}\n`;
    hasContent = true;
  }
  if (resume.experience) {
    resumeText += `Опыт: ${resume.experience}\n`;
    hasContent = true;
  }
  if (resume.desired_salary) {
    resumeText += `Желаемая зарплата: ${resume.desired_salary}\n`;
    hasContent = true;
  }
  if (resume.additional_info) {
    resumeText += `Дополнительная информация: ${resume.additional_info}\n`;
    hasContent = true;
  }
  if (hasContent) {
    respondText += resumeText;
  }
  const onRespond = async () => {
    try {
      await api.createResponse({
        vacancy_id: selectedVacancy._id,
        user_id: store.user.id,
        message: respondText
      });
      alert("Отклик отправлен");
      navigate("/profile");
    } catch (e) {
      console.error(e);
      alert(e.message || "Ошибка при отправке отклика");
    }
  };
  const onCall = () => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    }
  };
  return <div className="flex flex-col gap-[20px] p-[20px] overflow-y-auto" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <Header />
            <Marketplace marketplace={selectedVacancy.marketplace} />
            <InfoLabel photo={selectedVacancy.photo} coordinates={selectedVacancy.address} label="Место работы" text={addr} />
            <InfoLabel label="Тип работы" text={isFullTime ? "Полная занятость" : "Частичная занятость"} />
            <InfoLabel label="Заработная плата" text={`${selectedVacancy.salary} ₽`} />
            <InfoLabel label="Должность" text={selectedVacancy.position} />

            {isFullTime ? <InfoLabel label="График работы" text={selectedVacancy.schedule} /> : <>
                    <span className="opacity-50 text uppercase text-[0.7em]">Свободные даты</span>
                    <Calendar highlightedDates={highlightedDates} />
                </>}
            <InfoLabel label="Выплаты" text={selectedVacancy.payment} />
            {selectedVacancy.scope ? <InfoLabel label="Примерный объем" text={selectedVacancy.scope} /> : null}
            {selectedVacancy.extras ? <InfoLabel label="Дополнительные сервисы, которые подключены на ПВЗ" text={selectedVacancy.extras} /> : null}
            {selectedVacancy.experience ? <InfoLabel label="Наличие опыта у сотрудника" text={selectedVacancy.experience} /> : null}
            {selectedVacancy.additionalInfo ? <InfoLabel label="Дополнительная информация" text={selectedVacancy.additionalInfo} /> : null}

            {selectedCompanyId === null && <div>
                    <p className="text-center mb-2 text-[8px] opacity-80">
                        Ваше резюме будет скопированo в буфер обмена
                    </p>
                    <div className="flex justify-between gap-[7px] mb-[15px]">
                        {phoneNumber !== "" && <button className="toggle-button flex-grow w-0 text-center" style={{
          justifyContent: "center"
        }} onClick={onCall}>
                                Позвонить
                            </button>}
                        <button className="toggle-button flex-grow w-0 active text-center" style={{
          justifyContent: "center"
        }} onClick={onRespond}>
                            Откликнуться
                        </button>
                    </div>
                </div>}
        </div>;
}
export default VacancyForm;
