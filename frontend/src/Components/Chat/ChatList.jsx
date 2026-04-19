import React from 'react';
import ChatListItem from './ChatListItem';
import { Link } from "react-router-dom";
function ChatList({
  chats,
  onSelectChat,
  currentChatId,
  loading,
  error
}) {
  if (loading) {
    return <div className="w-1/3 border-r border-gray-300 p-4 text-center text-gray-500">
                Загрузка чатов...
            </div>;
  }
  if (error) {
    return <div className="w-1/3 border-r border-gray-300 p-4 text-center text-red-500">
                Ошибка загрузки чатов: {error}
            </div>;
  }
  return <div className="w-full md:w-1/3 border-r border-gray-300 bg-white flex flex-col">
            <header className="flex items-center p-3 absolute top-0 left-0 right-0 bg-[var(--first-background-color)] z-10" style={{
      paddingTop: "max(calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px)), 20px)"
    }}>
                <h1 className="whitespace-nowrap text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Чаты</h1>
            </header>
            <div className="flex-grow overflow-y-auto">
                {chats.length === 0 && <p className="p-4 text-center text-gray-500">Нет доступных чатов.</p>}
                {chats.map(chat => <ChatListItem key={chat._id} chat={chat} onSelectChat={onSelectChat} isActive={chat.id === currentChatId} />)}
            </div>
        </div>;
}
export default ChatList;
