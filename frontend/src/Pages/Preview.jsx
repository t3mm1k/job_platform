import React from "react";
const PreviewScreen = () => {
  return <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
            <img src={"./img/preview.png"} alt="Preview Screen" className="fixed" style={{
      filter: "blur(10px)"
    }} />
            <div className={"h-full w-full fixed z-[5]"} style={{
      backgroundColor: "rgba(0,0,0,0.7)"
    }}></div>

            <div className="z-10 flex flex-col items-center text-center">
                <div className=" flex items-center justify-center mb-8">
                    <img src="./img/icons/logo-dark.svg" alt={"Логотип"} className={"w-[130px]"}></img>
                </div>


                {}
                <h1 className="absolute bottom-10 drop-shadow-md text-[14px] uppercase text-white font-bold">
                    Вакансии рядом с домом
                </h1>
            </div>
        </div>;
};
export default PreviewScreen;
