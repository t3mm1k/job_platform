import React, { useState } from 'react';
import getSelectedCompanyId from "../../../utils/storage";
const DutyOptionDetails = ({
  itemData,
  onAction
}) => {
  console.log("DutyOptionDetails", itemData);
  if (!itemData || !itemData.duty_resume) {
    return <p className="p-3 text-xs text-white opacity-70">Детали не доступны.</p>;
  }
  const {
    fio,
    rate,
    city,
    experience,
    number
  } = itemData.duty_resume;
  return <div className="p-3 text-white text-xs">
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-3">
                <div className="flex flex-col">
                    <p className="opacity-50 text-[8px] uppercase font-semibold">Город</p>
                    <p className="mt-1 font-semibold">{city || 'Не указан'}</p>
                </div>
                <div className="flex flex-col">
                    <p className="opacity-50 text-[8px] uppercase font-semibold">Ставка</p>
                    <p className="mt-1 font-semibold">{rate ? `${rate} ₽ / смена` : 'Не указана'}</p>
                </div>
                <div className="flex flex-col">
                    <p className="opacity-50 text-[8px] uppercase font-semibold">Телефон</p>
                    <p className="mt-1 font-semibold">{number || 'Не указан'}</p>
                </div>
                <div className="flex flex-col col-span-2">
                    <p className="opacity-50 text-[8px] uppercase font-semibold">Опыт</p>
                    <p className="mt-1 font-semibold">{experience || 'Не указан'}</p>
                </div>
            </div>
            {onAction && <button onClick={() => onAction(itemData)} className="w-full mt-2 h-[35px] rounded-[8px] bg-white text-[var(--second-background-color)] text-[10px] font-bold">
                    Связаться {}
                </button>}
        </div>;
};
function Option(props) {
  const {
    type,
    label,
    onClick,
    unreadChatCount,
    duty_active,
    dutyItemData,
    onDutyAction,
    isCurrentUserManager
  } = props;
  const [expanded, setExpanded] = useState(false);
  const selectedCompanyId = getSelectedCompanyId();
  const handleToggleExpand = e => {
    e.stopPropagation();
    if (type === 'duty') {
      setExpanded(!expanded);
    }
  };
  const handleMainClick = () => {
    if (onClick) {
      onClick();
    }
  };
  const detailsHeight = expanded ? '1000px' : '0';
  const borderOpacity = expanded ? '0.1' : '0';
  let displayLabel = label;
  if (type === 'duty' && isCurrentUserManager) {
    displayLabel = duty_active ? "Завершить дежурство" : "Начать дежурство";
  }
  return <div className="bg-[var(--second-background-color)] rounded-[10px] overflow-hidden flex flex-col">
            {}
            <div className="flex items-center justify-between w-full px-3 py-2">
                {}
                <div className="flex items-center gap-[10px] flex-grow cursor-pointer min-w-0" onClick={handleMainClick} role="button" tabIndex={0} aria-label={displayLabel}>
                    <img src={`/img/icons/${type}.svg`} alt={type} className="w-5 h-5 flex-shrink-0" />
                    <div className="flex items-center justify-between flex-grow text-[0.9rem] min-w-0">
                        <div className="flex items-center gap-[10px]">
                            <p className="truncate">{displayLabel}</p>
                            {type === "duty" && selectedCompanyId === null && <div className={`h-[10px] w-[10px] rounded-full`} style={{
              backgroundColor: duty_active ? "#28EA61" : "#EE003B"
            }} title={duty_active ? "Активен" : "Не активен"}></div>}

                        </div>
                        {}
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            {type === "chat" && unreadChatCount > 0 && <span className="bg-red-500 text-white text-[0.7rem] font-bold px-1.5 py-0.5 rounded-full">
                                    {unreadChatCount}
                                </span>}
                        </div>
                    </div>
                </div>

                {}
                <div className="flex-shrink-0 ml-2">
                    {type === "duty" && selectedCompanyId === null ? <button onClick={handleToggleExpand} className="p-1 -m-1 rounded-full hover:bg-white/10 focus:bg-white/10 focus:outline-none" aria-expanded={expanded} aria-label="Развернуть/свернуть детали">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform duration-[300ms] transition-transform text-white ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button> : type !== "chat" ? <img src="/img/icons/arrow-right.svg" alt="" className=" text-white/70" /> : null}
                </div>
            </div>

            {}
            {type === 'duty' && <div className="mx-2" style={{
      transition: 'max-height 0.3s ease-out, opacity 0.3s ease-out, border-top-width 0.2s ease-out',
      maxHeight: detailsHeight,
      opacity: expanded ? 1 : 0,
      overflow: 'hidden',
      borderTop: expanded ? `1px solid rgba(255, 255, 255, ${borderOpacity})` : `0px solid rgba(255, 255, 255, 0)`,
      boxSizing: 'border-box'
    }}>
                    {}
                    {expanded && !isCurrentUserManager && <DutyOptionDetails itemData={dutyItemData} onAction={onDutyAction} />}
                    {expanded && isCurrentUserManager && <div className="p-3 text-white text-xs">
                            <p className="mb-2">
                                {duty_active ? "Вы сейчас на дежурстве." : "Вы сейчас не на дежурстве."}
                            </p>
                            <button onClick={() => onDutyAction(dutyItemData)} className="w-full mt-1 h-[35px] rounded-[8px] bg-white text-[var(--second-background-color)] text-[10px] font-bold">
                                {duty_active ? "Завершить дежурство" : "Начать дежурство"}
                            </button>
                        </div>}
                </div>}
        </div>;
}
export default Option;
