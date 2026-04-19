import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { backButton } from "@telegram-apps/sdk";
import MessageItem from "../Components/Chat/MessageItem";
import ChatListItem from "../Components/Chat/ChatListItem";
import { fetchChats, fetchChatHistory, sendMessage, wsMessageReceived, wsChatUpdated, clearCurrentChatDetails, selectAllChats, selectChatsListStatus, selectChatsListError, selectCurrentChatDetails, selectMessagesForCurrentChat, selectChatHistoryStatus, selectChatHistoryError, selectSendMessageStatus } from '../store/slices/chatSlice';
const API_BASE_URL = process.env.REACT_APP_API_URL;
const connectUserWebSocket = (userIdForSocket, dispatch) => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsBaseUrl = API_BASE_URL.replace(/^http/, 'ws');
  const wsUrl = `${wsBaseUrl}/users/${userIdForSocket}`;
  const ws = new WebSocket(wsUrl);
  ws.onopen = () => console.log(`[WS User] Пользователь ${userIdForSocket} подключен к ${wsUrl}`);
  ws.onmessage = event => {
    const incomingMessage = JSON.parse(event.data);
    console.log("[WS User] Получено сообщение:", incomingMessage);
    dispatch(wsMessageReceived({
      message: incomingMessage
    }));
  };
  ws.onerror = error => console.error(`[WS User] Ошибка WebSocket для пользователя ${userIdForSocket} (${wsUrl}):`, error);
  ws.onclose = event => {
    console.log(`[WS User] WebSocket для пользователя ${userIdForSocket} (${wsUrl}) отключен. Код: ${event.code}, Причина: ${event.reason}`);
  };
  return ws;
};
const connectChatsWebSocket = (userId, dispatch) => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsBaseUrl = API_BASE_URL.replace(/^http/, 'ws');
  const wsUrl = `${wsBaseUrl}/chats/${userId}`;
  const ws = new WebSocket(wsUrl);
  ws.onopen = () => console.log(`[WS Chats] Пользователь ${userId} подключен к ${wsUrl} для обновлений чатов`);
  ws.onmessage = event => {
    const newChatData = JSON.parse(event.data);
    console.log("[WS Chats] Получены новые данные по чату:", newChatData);
    dispatch(wsChatUpdated(newChatData));
  };
  ws.onerror = error => console.error(`[WS Chats] Ошибка WebSocket для чатов пользователя ${userId} (${wsUrl}):`, error);
  ws.onclose = event => {
    console.log(`[WS Chats] WebSocket для чатов пользователя ${userId} (${wsUrl}) отключен. Код: ${event.code}, Причина: ${event.reason}`);
  };
  return ws;
};
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>;
export const ChatListPage = ({
  currentUserId,
  currentUserType,
  baseChatPath
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector(selectAllChats);
  const chatsStatus = useSelector(selectChatsListStatus);
  const chatsError = useSelector(selectChatsListError);
  const chatDetails = useSelector(selectCurrentChatDetails);
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.show();
    backButton.onClick(() => {
      navigate('/profile');
    });
  }
  useEffect(() => {
    if (currentUserId && currentUserType) {
      dispatch(fetchChats({
        userId: currentUserId,
        userType: currentUserType
      }));
    }
  }, [dispatch, currentUserId, currentUserType, chatDetails]);
  useEffect(() => {
    if (!currentUserId) return;
    const ws = connectChatsWebSocket(currentUserId, dispatch);
    return () => {
      if (ws) {
        console.log(`[WS Chats] Закрытие WebSocket для обновлений чатов пользователя ${currentUserId} (ChatListPage)`);
        ws.close();
      }
    };
  }, [currentUserId, dispatch]);
  if (chatsStatus === 'loading' || chatsStatus === 'idle' && !chats.length) return <div className="text-center p-10 text-gray-500">Загрузка чатов...</div>;
  if (chatsStatus === 'failed') return <div className="text-center p-10 text-red-500">Ошибка: {chatsError || 'Не удалось загрузить чаты'}</div>;
  return <div className="bg-[var(--first-background-color)] min-h-screen text-white py-5 px-4 flex flex-col" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            <header className="relative flex items-center mb-5">
                <h1 className="text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Ваши чаты</h1>
            </header>
            {chats.length === 0 && chatsStatus === 'succeeded' ? <div className="text-center p-10 text-gray-500">У вас пока нет чатов.</div> : <div className="flex-grow overflow-y-auto">
                    {chats.map(chat => <ChatListItem key={chat._id} chat={chat} baseChatPath={baseChatPath} />)}
                </div>}
        </div>;
};
export const ChatDetailPage = ({
  currentUserId
}) => {
  const {
    chatId
  } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chatDetails = useSelector(selectCurrentChatDetails);
  const messages = useSelector(selectMessagesForCurrentChat);
  const chatHistoryStatus = useSelector(selectChatHistoryStatus);
  const chatHistoryError = useSelector(selectChatHistoryError);
  const sendMessageStatus = useSelector(selectSendMessageStatus);
  const [newMessageText, setNewMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isSending = sendMessageStatus === 'loading';
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.show();
    backButton.onClick(() => {
      dispatch(clearCurrentChatDetails());
      navigate(-1);
    });
  }
  const onFocus = () => {
    setTimeout(() => {
      window.scrollBy(0, 100);
    }, 400);
  };
  const closeKeyboard = e => {
    const target = e.target;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
      if (!target.closest("input") && !target.closest("textarea")) {
        activeElement.blur();
      }
    }
  };
  useEffect(() => {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', onFocus);
    });
    document.addEventListener("touchstart", closeKeyboard);
    document.addEventListener("mousedown", closeKeyboard);
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', onFocus);
      });
      document.removeEventListener("touchstart", closeKeyboard);
      document.removeEventListener("mousedown", closeKeyboard);
    };
  }, [onFocus, closeKeyboard]);
  useEffect(() => {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => input.addEventListener('focus', onFocus));
    document.addEventListener("touchstart", closeKeyboard);
    document.addEventListener("mousedown", closeKeyboard);
    return () => {
      inputs.forEach(input => input.removeEventListener('focus', onFocus));
      document.removeEventListener("touchstart", closeKeyboard);
      document.removeEventListener("mousedown", closeKeyboard);
    };
  }, [onFocus, closeKeyboard]);
  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior
    });
  }, []);
  useEffect(() => {
    if (chatDetails && chatDetails._id !== chatId) {
      dispatch(clearCurrentChatDetails());
    }
    dispatch(fetchChatHistory({
      chatId,
      userId: currentUserId
    })).unwrap();
    console.log(chatDetails);
  }, []);
  useEffect(() => {
    if (messages.length > 0) {
      const isInitialHistoryLoad = chatHistoryStatus === 'succeeded' && messages.length > 0 && (!messagesEndRef.current || messagesEndRef.current.previousScrollHeight !== messagesEndRef.current.scrollHeight);
      scrollToBottom(isInitialHistoryLoad ? 'auto' : 'smooth');
      if (isInitialHistoryLoad && messagesEndRef.current) {
        messagesEndRef.current.previousScrollHeight = messagesEndRef.current.scrollHeight;
      }
    }
  }, [messages, scrollToBottom, chatHistoryStatus]);
  useEffect(() => {
    if (!currentUserId || !chatId) return;
    const ws = connectUserWebSocket(currentUserId, dispatch);
    return () => {
      if (ws) {
        console.log(`[WS User] Закрытие WebSocket для пользователя ${currentUserId} (ChatDetailPage)`);
        ws.close();
      }
    };
  }, [chatId, currentUserId, dispatch]);
  const handleSendMessage = useCallback(async event => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    if (!newMessageText.trim() || !chatDetails || !currentUserId || isSending) return;
    const apiMessagePayload = {
      from_user: currentUserId,
      to_user: currentUserId === chatDetails.employer_id ? chatDetails.job_seeker_id : chatDetails.employer_id,
      text: newMessageText,
      chat_id: chatId,
      timestamp: Math.floor(Date.now() / 1000)
    };
    const messageTextForRetry = newMessageText;
    setNewMessageText('');
    try {
      await dispatch(sendMessage(apiMessagePayload)).unwrap();
      console.log("Сообщение успешно отправлено API, ждем WebSocket...");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err) {
      console.error("Ошибка отправки сообщения через API:", err);
      console.warn(`Не удалось отправить сообщение: ${err.message || 'Пожалуйста, попробуйте еще раз.'}`);
      setNewMessageText(messageTextForRetry);
    }
  }, [newMessageText, chatDetails, currentUserId, isSending, chatId, dispatch]);
  if (chatHistoryStatus === 'loading' || chatHistoryStatus === 'idle' && !chatDetails && chatId) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Загрузка чата...</div>;
  }
  if (chatHistoryStatus === 'failed') {
    return <div className="flex justify-center items-center h-screen text-red-500">Ошибка: {chatHistoryError || 'Не удалось загрузить чат'}</div>;
  }
  if (!chatDetails && chatId) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Чат не найден или доступ запрещен.</div>;
  }
  if (!chatId) {
    return <div className="flex-grow flex items-center justify-center text-gray-500 bg-gray-50">
                Выберите чат для начала общения
            </div>;
  }
  return <div className="bg-[var(--first-background-color)] min-h-screen text-white flex flex-col" style={{
    paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
  }}>
            {}
            <header className="flex items-center p-3 absolute top-0 left-0 right-0 bg-[var(--first-background-color)] z-10" style={{
      paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
    }}>
                {chatDetails && chatDetails.avatar && <img className="w-[35px] h-[35px] rounded-full mr-3 object-cover bg-white" src={chatDetails.avatar} alt={chatDetails.chat_name} />}
                <div className={"flex flex-col"}>
                    <h1 className="whitespace-nowrap text-[1rem] font-semibold">{chatDetails ? chatDetails.chat_name : 'Загрузка...'}</h1>
                    <div className="flex items-center font-bold opacity-50 text-[0.7rem] gap-[10px]">
                        <p>{chatDetails.position}</p>
                        <p>{chatDetails.salary}</p>
                    </div>
                </div>
            </header>

            {}
            <div className="flex-grow overflow-y-auto p-4 mt-[60px]" style={{
      marginBottom: "60px"
    }}>
                {messages.map(msg => <MessageItem key={msg.id || msg._id} message={msg} currentUserId={currentUserId} />)}
                <div ref={messagesEndRef} /> {}
            </div>

            {}
            <form onSubmit={handleSendMessage} className="flex items-center p-2 bg-[var(--second-background-color)] fixed bottom-0 left-0 right-0 z-10">
                <input ref={inputRef} type="text" value={newMessageText} onChange={e => setNewMessageText(e.target.value)} placeholder="Введите сообщение..." className="form-field flex-grow p-2 text-[10px] bg-[var(--first-background-color)] border border-white opacity-50 rounded-[10px] resize-none text-white" disabled={isSending || !chatDetails} autoComplete="off" />
                <button type="submit" disabled={isSending || !newMessageText.trim() || !chatDetails} className="text-[color:var(--text-color)] items-center font-bold text-[8px] uppercase min-w-min p-2.5 rounded-[10px] disabled:opacity-50">
                    {isSending ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg> : <SendIcon />}
                </button>
            </form>
        </div>;
};
