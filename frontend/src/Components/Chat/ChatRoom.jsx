import React, { useState, useEffect, useRef, useCallback } from 'react';
import MessageItem from './MessageItem';
function ChatRoom({
  chatId,
  currentUserId,
  currentChat,
  initialMessages,
  onSendMessage,
  isLoadingMessages,
  loadMessagesError,
  onLoadMoreMessages
}) {
  const [newMessageText, setNewMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, []);
  useEffect(() => {
    if (initialMessages.length > 0) {
      scrollToBottom();
    }
  }, [initialMessages, scrollToBottom]);
  const handleSendMessage = e => {
    e.preventDefault();
    if (!newMessageText.trim() || !chatId || !currentChat) return;
    const toUserId = currentUserId === currentChat.job_seeker_id ? currentChat.employer_id : currentChat.job_seeker_id;
    const messagePayload = {
      chat_id: chatId,
      from_user: currentUserId,
      to_user: toUserId,
      text: newMessageText,
      timestamp: new Date().toISOString(),
      read: false
    };
    onSendMessage(messagePayload);
    setNewMessageText('');
  };
  if (!chatId) {
    return <div className="flex-grow flex items-center justify-center text-gray-500 bg-gray-50">
                Выберите чат для начала общения
            </div>;
  }
  return <div className="flex-grow flex flex-col bg-gray-50">
            {}
            <div className="p-4 border-b border-gray-300 bg-white">
                <h3 className="font-semibold text-gray-700">
                    {currentChat ? currentChat.chat_name : 'Загрузка...'}
                </h3>
                {}
            </div>

            {}
            <div className="flex-grow p-4 overflow-y-auto space-y-2">
                {isLoadingMessages && <p className="text-center text-gray-500">Загрузка сообщений...</p>}
                {loadMessagesError && <p className="text-center text-red-500">Ошибка: {loadMessagesError}</p>}
                {!isLoadingMessages && initialMessages.length === 0 && <p className="text-center text-gray-500">Нет сообщений в этом чате. Начните диалог!</p>}
                {initialMessages.map(msg => <MessageItem key={msg._id} message={msg} currentUserId={currentUserId} />)}
                <div ref={messagesEndRef} /> {}
            </div>

            {}
            <div className="p-4 border-t border-gray-300 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input type="text" value={newMessageText} onChange={e => setNewMessageText(e.target.value)} placeholder="Введите сообщение..." className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mr-2" disabled={!currentChat} />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50" disabled={!newMessageText.trim() || !currentChat}>
                        Отправить
                    </button>
                </form>
            </div>
        </div>;
}
export default ChatRoom;
