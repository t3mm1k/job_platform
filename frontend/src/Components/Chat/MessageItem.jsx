import React from 'react';
function MessageItem({
  message,
  currentUserId
}) {
  const isCurrentUser = message.from_user === currentUserId;
  const messageDate = new Date(message.timestamp * 1000);
  const alignment = isCurrentUser ? 'justify-end' : 'self-start';
  const bgColor = isCurrentUser ? 'bg-[#3A3A3A] text-white' : 'bg-[var(--second-background-color)] text-white/80';
  return <div className={`flex mb-3 ${alignment}`}>
            <div className={`py-2 px-3 rounded-xl shadow ${bgColor} max-w-[75%] break-words`}>
                <p className="text-sm leading-snug">{message.text}</p>
                <div className={`flex items-center justify-end text-xs mt-1 opacity-50`}>
                    <span>{messageDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
                        {isCurrentUser && (message.read ? <svg className="ml-1" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg> : <svg className="ml-1" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" /></svg>)}
                </div>
            </div>
        </div>;
}
export default MessageItem;
