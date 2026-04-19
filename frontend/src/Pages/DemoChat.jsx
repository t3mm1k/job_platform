import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useParams, Navigate } from 'react-router-dom';
const API_BASE_URL = 'http://localhost:8000';
const getChats = async (userId, userType) => {
  const response = await fetch(`${API_BASE_URL}/get_chats/${userType}/${userId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: 'Failed to fetch chats'
    }));
    throw new Error(errorData.detail || 'Failed to fetch chats');
  }
  return response.json();
};
const getChatHistory = async (chatId, userId) => {
  const response = await fetch(`${API_BASE_URL}/get_chat_history/${chatId}/${userId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: 'Failed to fetch chat history'
    }));
    throw new Error(errorData.detail || 'Failed to fetch chat history');
  }
  return response.json();
};
const sendMessageApi = async messageData => {
  const response = await fetch(`${API_BASE_URL}/send_message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messageData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: 'Failed to send message'
    }));
    throw new Error(errorData.detail || 'Failed to send message');
  }
  return response.json();
};
const connectUserWebSocket = (userId, onMessageCallback) => {
  const ws = new WebSocket(`ws://localhost:8000/users/${userId}`);
  ws.onopen = () => console.log(`User WebSocket connected for user ${userId}`);
  ws.onmessage = event => onMessageCallback(JSON.parse(event.data));
  ws.onerror = error => console.error(`User WebSocket error for user ${userId}:`, error);
  ws.onclose = () => console.log(`User WebSocket disconnected for user ${userId}`);
  return ws;
};
const connectChatsWebSocket = (userId, onChatCallback) => {
  const ws = new WebSocket(`ws://localhost:8000/chats/${userId}`);
  ws.onopen = () => console.log(`Chats WebSocket connected for user ${userId}`);
  ws.onmessage = event => onChatCallback(JSON.parse(event.data));
  ws.onerror = error => console.error(`Chats WebSocket error for user ${userId}:`, error);
  ws.onclose = () => console.log(`Chats WebSocket disconnected for user ${userId}`);
  return ws;
};
const ChatListItem = ({
  chat,
  baseChatPath
}) => {
  return <Link to={`${baseChatPath}/${chat.id}`} className="flex items-center p-3 hover:bg-gray-100 border-b border-gray-200 no-underline text-gray-800 transition-colors duration-150">
            <img src={chat.avatar || '/img/icons/default_avatar.svg'} alt={chat.chat_name} className="w-12 h-12 rounded-full mr-3 object-cover" />
            <div className="flex-grow overflow-hidden">
                <div className="font-semibold truncate">{chat.chat_name}</div>
                {chat.last_message && <div className="text-sm text-gray-500 truncate">
                        {chat.last_message.text}
                    </div>}
            </div>
        </Link>;
};
const MessageItem = ({
  message,
  currentUserId
}) => {
  const isCurrentUser = message.from_user === currentUserId;
  const messageDate = new Date(message.timestamp * 1000);
  const alignment = isCurrentUser ? 'ml-auto' : 'mr-auto';
  const bgColor = isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800';
  return <div className={`flex mb-3 max-w-[75%] sm:max-w-[65%] ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`py-2 px-3 rounded-xl shadow ${bgColor} ${alignment}`}>
                <p className="text-sm leading-snug break-words">{message.text}</p>
                <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                    {messageDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
                    {isCurrentUser && <span className={`ml-1 ${message.read ? 'text-blue-300' : 'text-blue-200/70'}`}>
                            {message.read ? '✓✓' : '✓'}
                        </span>}
                </div>
            </div>
        </div>;
};
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>;
const ChatListPage = ({
  currentUserId,
  currentUserType,
  baseChatPath
}) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUserChats = useCallback(async () => {
    if (!currentUserId || !currentUserType) {
      setError("User ID or User Type is not provided.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const fetchedChats = await getChats(currentUserId, currentUserType);
      fetchedChats.sort((a, b) => (b.last_message?.timestamp || b.created_at) - (a.last_message?.timestamp || a.created_at));
      setChats(fetchedChats);
      setError(null);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentUserType]);
  useEffect(() => {
    fetchUserChats();
    if (!currentUserId) return;
    const ws = connectChatsWebSocket(currentUserId, newChatData => {
      console.log("New chat received via WebSocket:", newChatData);
      setChats(prevChats => {
        const existingChatIndex = prevChats.findIndex(c => c.id === newChatData.id);
        if (existingChatIndex > -1) {
          const updatedChats = [...prevChats];
          updatedChats[existingChatIndex] = {
            ...updatedChats[existingChatIndex],
            ...newChatData
          };
          return updatedChats.sort((a, b) => (b.last_message?.timestamp || b.created_at) - (a.last_message?.timestamp || a.created_at));
        } else {
          return [...prevChats, newChatData].sort((a, b) => (b.last_message?.timestamp || b.created_at) - (a.last_message?.timestamp || a.created_at));
        }
      });
    });
    return () => {
      if (ws) ws.close();
    };
  }, [fetchUserChats, currentUserId]);
  if (loading) return <div className="text-center p-10 text-gray-500">Загрузка чатов...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Ошибка: {error}</div>;
  return <div className="max-w-2xl mx-auto my-5">
            <h1 className="text-2xl font-semibold text-center mb-6 text-gray-700">Ваши чаты</h1>
            {chats.length === 0 ? <div className="text-center p-10 text-gray-500">У вас пока нет чатов.</div> : <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {chats.map(chat => <ChatListItem key={chat.id} chat={chat} baseChatPath={baseChatPath} />)}
                </div>}
        </div>;
};
const ChatDetailPage = ({
  currentUserId,
  baseChatPath
}) => {
  const {
    chatId
  } = useParams();
  const [chatDetails, setChatDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const fetchHistory = useCallback(async () => {
    if (!currentUserId || !chatId) {
      setError("User ID or Chat ID is not provided.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getChatHistory(chatId, currentUserId);
      setChatDetails(data.chat);
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching chat history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chatId, currentUserId]);
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (!currentUserId) return;
    const ws = connectUserWebSocket(currentUserId, incomingMessage => {
      console.log("Message received via WebSocket:", incomingMessage);
      if (incomingMessage.chat_id === chatId) {
        setMessages(prevMessages => {
          if (!prevMessages.find(m => m.id === incomingMessage.id)) {
            return [...prevMessages, incomingMessage];
          }
          return prevMessages.map(m => m.id === incomingMessage.id ? {
            ...m,
            ...incomingMessage
          } : m);
        });
      } else if (incomingMessage.id && incomingMessage.chat_id === chatId && incomingMessage.read === true) {
        setMessages(prevMessages => prevMessages.map(m => m.id === incomingMessage.id ? {
          ...m,
          read: true
        } : m));
      }
    });
    return () => {
      if (ws) ws.close();
    };
  }, [chatId, currentUserId]);
  const handleSendMessage = async e => {
    e.preventDefault();
    if (!newMessage.trim() || !chatDetails || !currentUserId) return;
    const messageData = {
      from_user: currentUserId,
      to_user: currentUserId === chatDetails.employer_id ? chatDetails.job_seeker_id : chatDetails.employer_id,
      text: newMessage,
      chat_id: chatId,
      timestamp: Math.floor(Date.now() / 1000)
    };
    try {
      setSending(true);
      const sentMessage = await sendMessageApi(messageData);
      setMessages(prevMessages => [...prevMessages, sentMessage]);
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Не удалось отправить сообщение.");
    } finally {
      setSending(false);
    }
  };
  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Загрузка чата...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Ошибка: {error}</div>;
  if (!chatDetails) return <div className="flex justify-center items-center h-screen text-gray-500">Чат не найден.</div>;
  return <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-20px)] sm:h-[calc(100vh-40px)] my-0 sm:my-5 bg-white shadow-lg rounded-none sm:rounded-lg overflow-hidden">
            {}
            <div className="flex items-center p-3 sm:p-4 bg-gray-100 border-b border-gray-300">
                <Link to={baseChatPath} className="text-blue-600 hover:text-blue-700 mr-3 p-1 rounded-full hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                <img src={chatDetails.avatar || '/img/icons/default_avatar.svg'} alt={chatDetails.chat_name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                <h2 className="text-lg font-semibold text-gray-700 truncate">{chatDetails.chat_name}</h2>
            </div>

            {}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
                {messages.map(msg => <MessageItem key={msg.id} message={msg} currentUserId={currentUserId} />)}
                <div ref={messagesEndRef} />
            </div>

            {}
            <form onSubmit={handleSendMessage} className="flex items-center p-2 sm:p-3 border-t border-gray-300 bg-gray-100">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Введите сообщение..." className="flex-grow p-2 sm:p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" disabled={sending} />
                <button type="submit" disabled={sending || !newMessage.trim()} className="ml-2 sm:ml-3 p-2 sm:p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                    {sending ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg> : <SendIcon />}
                </button>
            </form>
        </div>;
};
const ChatModule = ({
  currentUserId,
  currentUserType,
  baseAppPath = "/chats"
}) => {
  if (!currentUserId || !currentUserType) {
    return <div className="p-10 text-center text-red-600 font-semibold">
                Ошибка: ID пользователя или тип пользователя не предоставлены для модуля чата.
            </div>;
  }
  return <Routes>
            <Route path="/" element={<ChatListPage currentUserId={currentUserId} currentUserType={currentUserType} baseChatPath={baseAppPath} />} />
            <Route path="/:chatId" element={<ChatDetailPage currentUserId={currentUserId} baseChatPath={baseAppPath} />} />
            <Route path="*" element={<Navigate to={baseAppPath} replace />} />
        </Routes>;
};
const HomePage = () => <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Главная страница приложения</h1>
        <p className="mb-6 text-gray-600">Это пример главной страницы.</p>
        <Link to="/my-chats" className="text-blue-600 hover:text-blue-800 underline font-medium">
            Перейти к чатам (Пользователь 1)
        </Link>
        <br />
        <Link to="/other-chats" className="mt-4 text-blue-600 hover:text-blue-800 underline font-medium">
            Перейти к чатам (Пользователь 2, Работодатель)
        </Link>
    </div>;
const App = () => {
  const loggedInUserId = 1;
  const loggedInUserType = 'job_seeker';
  const otherUserId = 2;
  const otherUserType = 'employer';
  const navLinkClasses = ({
    isActive
  }) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;
  return <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <NavLink to="/" className={navLinkClasses}>
                                    Главная
                                </NavLink>
                                <NavLink to="/my-chats" className={navLinkClasses}>
                                    Мои Чаты
                                </NavLink>
                                <NavLink to="/other-chats" className={navLinkClasses}>
                                    Чаты (User 2)
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        {}
                        <Route path="/my-chats/*" element={<ChatModule currentUserId={loggedInUserId} currentUserType={loggedInUserType} baseAppPath="/my-chats" />} />
                        {}
                        <Route path="/other-chats/*" element={<ChatModule currentUserId={otherUserId} currentUserType={otherUserType} baseAppPath="/other-chats" />} />
                        {}
                    </Routes>
                </main>
            </div>
        </BrowserRouter>;
};
export default App;
