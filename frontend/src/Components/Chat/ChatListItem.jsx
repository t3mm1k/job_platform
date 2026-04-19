import React from 'react';
import { Link } from 'react-router-dom';
function ChatListItem({
  chat,
  baseChatPath
}) {
  return <Link to={`${baseChatPath}/${chat._id}`} className="flex items-center p-3 hover:bg-[#444] cursor-pointer border-b border-white/20 no-underline text-white transition-colors duration-150">
            <img src={chat.avatar || '/img/icons/default_avatar.svg'} alt={chat.chat_name} className="w-12 h-12 rounded-full mr-3 object-cover bg-white" />
            <div className="flex-grow overflow-hidden">
                <div className="font-semibold truncate">{chat.chat_name}</div>
                <div className="flex items-center font-bold opacity-50 text-[0.7rem] gap-[10px]">
                    <p>{chat.position}</p>
                    <p>{chat.salary}</p>
                </div>

                {chat.last_message && <div className="text-sm opacity-50 truncate">
                        {chat.last_message.text}
                    </div>}
            </div>
            {chat.unread_count > 0 && <span className={"font-bold"}>{chat.unread_count}</span>}
        </Link>;
}
export default ChatListItem;
