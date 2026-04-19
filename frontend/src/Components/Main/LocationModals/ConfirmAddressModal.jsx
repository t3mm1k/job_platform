import React, { useEffect } from 'react';
function ConfirmAddressModal({
  address,
  onConfirm,
  onOther
}) {
  useEffect(() => {
    const handleBlur = () => {};
    document.addEventListener('blur', handleBlur, true);
    return () => {
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);
  return (<div className="fixed left-[20px] right-[20px] bg-[#242424] rounded-[15px] p-[10px] z-[200]" style={{
      bottom: "calc(max(var(--tg-safe-area-inset-bottom, 10px), 10px) + 10px)"
    }}>
            <div className="flex flex-col gap-[20px]">
                <div>
                    <p className="text-white text-[8px] uppercase font-bold text-center">Покажем вакансии рядом с вами, если они есть</p>
                    <p className="text-white text-[8px] uppercase font-bold text-center">ВАШ ТЕКУЩИЙ АДРЕС:</p>
                </div>
                <p className="text-white font-bold text-[12px] uppercase min-h-[20px] text-center"> {}
                    {address || "Определение адреса..."}
                </p>
                {}
                <div className="flex gap-2.5 mt-2">
                    <button onClick={onOther} className="flex-1 bg-transparent text-white border-2 border-white rounded-[10px] py-2.5 px-4 text-[8px] font-bold uppercase" type="button">
                        ДРУГОЙ АДРЕС
                    </button>
                    <button onClick={onConfirm} className="flex-1 bg-white text-[#242424] rounded-[10px] py-2.5 px-4 text-[8px] font-bold uppercase disabled:opacity-50" type="button" disabled={!address}>
                        ПОДТВЕРДИТЬ
                    </button>
                </div>
            </div>
        </div>
  );
}
export default ConfirmAddressModal;
