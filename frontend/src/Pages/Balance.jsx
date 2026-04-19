import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserBalance } from '../store/slices/userSlice';
import { backButton } from "@telegram-apps/sdk";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const Balance = () => {
  const isTgMiniApp = useSelector(state => state.ui.isTgMiniApp);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const balance = useSelector(state => state.user.balance);
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.id);
  const [paymentInfoMessage, setPaymentInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.isMounted();
    backButton.show();
    backButton.onClick(() => {
      navigate("/profile");
    });
  }
  useEffect(() => {
    const processPendingPayments = async () => {
      if (!userId) {
        console.warn("User ID is not available.  Cannot process pending payments.");
        return;
      }
      setIsCheckingPayment(true);
      setPaymentInfoMessage('');
      try {
        const response = await fetch(`${REACT_APP_API_URL}/process_pending_payments/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to process pending payments: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }
        const results = await response.json();
        console.log("Process results:", results);
        let successMessage = "";
        let hasSuccess = false;
        for (const result of results) {
          if (result.status === 'Пополнен') {
            if (result.balance_updated) {
              const parsedAmount = parseFloat(result.amount);
              if (!isNaN(parsedAmount)) {
                dispatch(updateUserBalance(balance + parsedAmount));
                hasSuccess = true;
                successMessage = null;
              } else {
                successMessage = "Платеж прошел. Произошла ошибка при обновлении баланса, пожалуйста свяжитесь с нами";
                console.error("Invalid amount in payment processing result:", result.amount);
              }
            } else {
              successMessage = "Платеж прошел. Произошла ошибка при обновлении баланса, пожалуйста свяжитесь с нами";
            }
          } else if (result.status === "succeeded") {
            successMessage = "Платеж прошел. Страница обновится автоматически или обновите ее сами";
            setTimeout(window.location.reload(), 1000);
          } else if (result.status === 'processing_error') {
            successMessage = "Произошла ошибка при обработке платежа";
          } else {
            successMessage = null;
          }
        }
        if (hasSuccess) setPaymentInfoMessage(successMessage);else if (results.length > 0) setPaymentInfoMessage(successMessage);else setPaymentInfoMessage(null);
      } catch (error) {
        console.error('Error processing pending payments:', error);
        setPaymentInfoMessage(`Failed to process payments: ${error.message}`);
      } finally {
        setIsCheckingPayment(false);
      }
    };
    if (userId) {
      processPendingPayments();
    }
  }, [userId, dispatch, balance]);
  const handleAmountChange = event => {
    setAmount(event.target.value);
  };
  const handlePresetAmount = presetAmount => {
    setAmount(presetAmount.toString());
  };
  const handlePayWithCard = async () => {
    if (!amount) {
      alert('Пожалуйста, введите сумму для пополнения.');
      return;
    }
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      alert('Пожалуйста, введите корректную сумму.');
      return;
    }
    if (!userId) {
      alert('Не удалось получить ID пользователя. Пожалуйста, перезагрузите страницу.');
      return;
    }
    setIsLoading(true);
    setPaymentInfoMessage('');
    try {
      const response = await fetch(`${REACT_APP_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountNumber,
          description: 'Пополнение баланса',
          return_url: window.location.origin + '/balance',
          user_id: userId
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment creation failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      console.log("Payment created, redirecting to:", data.confirmation_url);
      window.location.href = data.confirmation_url;
    } catch (error) {
      console.error('Error creating payment:', error);
      setPaymentInfoMessage(`Payment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="bg-[var(--first-background-color)] h-screen text-white py-5 px-4 flex flex-col gap-[20px]" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <header className="relative flex items-center mb-5">
                {isTgMiniApp === false && <button className="flex items-center justify-center gap-[5px] text-[0.8rem]" onClick={() => navigate("/profile")}>
                        <img src="/img/icons/arrow-left.svg" alt="Назад" />
                        Назад
                    </button>}
                <h1 className="whitespace-nowrap text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Избранное</h1>
            </header>

            {}
            <div className="flex flex-col w-full gap-[10px]">
                <div className="bg-[var(--second-background-color)] flex justify-between px-[16px] py-[7px] rounded-[10px]">
                    <div className="flex items-center justify-center gap-[5px]">
                        <img src="img/icons/balance.svg" alt="Баланс" />
                        <span className="text-[14px] font-bold">Текущий баланс</span>
                    </div>
                    <span className="text-[17px] font-bold">{`${balance} ₽`}</span>
                </div>
                <p className="text-[8px] text-center">Введите сумму пополнения или выберите из заготовленных вариантов</p>
                {paymentInfoMessage && !isLoading && !isCheckingPayment && <div className="text-[8px] text-center">
                        {paymentInfoMessage}
                    </div>}
            </div>
            {}
            {}
            {}
            {}
            {}
            {}



            {}
            <input type="number" placeholder="Введите необходимую сумму" className="text-[8px] form-field outline-0 w-full bg-[var(--first-background-color)] border border-white opacity-50 rounded-[10px] p-3 focus:opacity-100" value={amount} onChange={handleAmountChange} />

            <div className="grid grid-cols-3 gap-[15px] w-full">
                <button className={`toggle-button justify-center ${amount === '100' ? 'active' : ''}`} style={{
        fontSize: "14px",
        borderWidth: "0px"
      }} onClick={() => handlePresetAmount(100)}>
                    100 ₽
                </button>
                <button className={`toggle-button justify-center ${amount === '250' ? 'active' : ''}`} style={{
        fontSize: "14px",
        borderWidth: "0px"
      }} onClick={() => handlePresetAmount(250)}>
                    250 ₽
                </button>
                <button className={`toggle-button justify-center ${amount === '500' ? 'active' : ''}`} style={{
        fontSize: "14px",
        borderWidth: "0px"
      }} onClick={() => handlePresetAmount(500)}>
                    500 ₽
                </button>
                <button className={`toggle-button justify-center ${amount === '1000' ? 'active' : ''}`} style={{
        fontSize: "14px",
        borderWidth: "0px"
      }} onClick={() => handlePresetAmount(1000)}>
                    1.000 ₽
                </button>
                <button className={`toggle-button justify-center ${amount === '1500' ? 'active' : ''}`} style={{
        fontSize: "14px",
        borderWidth: "0px"
      }} onClick={() => handlePresetAmount(1500)}>
                    1.500 ₽
                </button>
                <button className={`toggle-button justify-center ${amount === '5000' ? 'active' : ''}`} style={{
        fontSize: "14px",
        borderWidth: "0px"
      }} onClick={() => handlePresetAmount(5000)}>
                    5.000 ₽
                </button>
            </div>

            {}
            <button className="toggle-button justify-center active max-h-[40px]" onClick={handlePayWithCard}>
                ОПЛАТИТЬ КАРТОЙ
            </button>

            {}
            <div className="text-center flex flex-col gap-0 fixed justify-center w-[calc(100vw-30px)] bottom-4 font-normal underline opacity-50">
                <Link to="/oferta">Публичная оферта</Link>
            </div>

        </div>;
};
export default Balance;
