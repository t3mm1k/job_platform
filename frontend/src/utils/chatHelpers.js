export function sortChatsByRecent(chats) {
  return [...(chats || [])].sort((a, b) => {
    const timeA = a.last_message?.timestamp || a.created_at || 0;
    const timeB = b.last_message?.timestamp || b.created_at || 0;
    return timeB - timeA;
  });
}

export function withStringMessageIds(messages) {
  return (messages || []).map(msg => ({
    ...msg,
    id: String(msg._id)
  }));
}
