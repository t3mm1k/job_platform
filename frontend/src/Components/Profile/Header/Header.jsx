import { useNavigate } from "react-router-dom";
import React from "react";
function Header({
  isTgMiniApp
}) {
  const navigate = useNavigate();
  return <header className="relative flex items-center z-0">
            {isTgMiniApp === false && <button className="flex items-center justify-center gap-[5px] text-[0.8rem] font-normal" onClick={() => navigate('/')}>
                    <img src="/img/icons/arrow-left.svg" alt="Назад" />
                    Назад
                </button>}
            <h1 className="whitespace-nowrap text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Профиль</h1>
        </header>;
}
export default Header;
