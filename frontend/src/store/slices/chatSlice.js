import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE_URL = process.env.REACT_APP_API_URL;
const sortChats = chats => {
  return [...chats].sort((a, b) => {
    const timeA = a.last_message?.timestamp || a.created_at || 0;
    const timeB = b.last_message?.timestamp || b.created_at || 0;
    return timeB - timeA;
  });
};
export const fetchChats = createAsyncThunk('chat/fetchChats', async ({
  userId,
  userType
}, {
  rejectWithValue
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_chats/${userType}/${userId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'Не удалось загрузить чаты'
      }));
      throw new Error(errorData.detail || 'Не удалось загрузить чаты');
    }
    const chats = await response.json();
    return sortChats(chats);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
export const fetchChatHistory = createAsyncThunk('chat/fetchChatHistory', async ({
  chatId,
  userId
}, {
  rejectWithValue
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_chat_history/${chatId}/${userId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'Не удалось загрузить историю чата'
      }));
      throw new Error(errorData.detail || 'Не удалось загрузить историю чата');
    }
    const data = await response.json();
    const processedMessages = (data.messages || []).map(msg => ({
      ...msg,
      id: String(msg._id)
    }));
    return {
      chat: data.chat,
      messages: processedMessages,
      chatId: data.chat._id
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
export const sendMessage = createAsyncThunk('chat/sendMessage', async (messageData, {
  rejectWithValue
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send_message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'Не удалось отправить сообщение'
      }));
      throw new Error(errorData.detail || 'Не удалось отправить сообщение');
    }
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
const initialState = {
  chats: [],
  messagesByChatId: {},
  currentChatDetails: null,
  chatsListStatus: 'idle',
  chatsListError: null,
  chatHistoryStatus: 'idle',
  chatHistoryError: null,
  sendMessageStatus: 'idle',
  sendMessageError: null
};
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    wsMessageReceived: (state, action) => {
      const {
        message: incomingMessage
      } = action.payload;
      const chatId = incomingMessage.chat_id;
      if (!state.messagesByChatId[chatId]) {
        state.messagesByChatId[chatId] = [];
      }
      const messagesInChat = state.messagesByChatId[chatId];
      if (incomingMessage.type === "message") {
        if (!messagesInChat.find(m => m._id === incomingMessage._id)) {
          messagesInChat.push(incomingMessage);
          console.log(`[WS] Добавлено сообщение с _id: ${incomingMessage._id}, текст: "${incomingMessage.text}" в чат ${chatId}`);
        } else {
          console.log(`[WS] Сообщение с _id: ${incomingMessage._id} уже существует в чате ${chatId}, пропущено.`);
        }
      } else if (incomingMessage.type === "read_receipt" || incomingMessage.type === "read") {
        const messageIdsToMarkRead = incomingMessage.message_ids || [];
        state.messagesByChatId[chatId] = messagesInChat.map(m => messageIdsToMarkRead.includes(m._id) ? {
          ...m,
          read: true
        } : m);
        console.log(`[WS] Обновлен статус прочтения для сообщений в чате ${chatId}:`, messageIdsToMarkRead);
      }
      const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
      if (chatIndex > -1 && incomingMessage.type === "message") {
        state.chats[chatIndex].last_message = {
          text: incomingMessage.text,
          timestamp: incomingMessage.timestamp
        };
      }
      state.chats = sortChats(state.chats);
    },
    wsChatUpdated: (state, action) => {
      const updatedData = action.payload;
      console.log("[WS Chats] Получены данные для обновления списка чатов:", updatedData);
      if (updatedData.type === "message" && updatedData.chat_id) {
        const chatId = updatedData.chat_id;
        const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
        if (chatIndex > -1) {
          state.chats[chatIndex].last_message = {
            text: updatedData.text,
            timestamp: updatedData.timestamp,
            sender_id: updatedData.from_user
          };
          state.chats[chatIndex].unread_count = (state.chats[chatIndex].unread_count || 0) + 1;
          console.log(`[WS Chats] Обновлено last_message для чата ${chatId}.`);
          if (!state.messagesByChatId[chatId]) {
            state.messagesByChatId[chatId] = [];
          }
          if (!state.messagesByChatId[chatId].find(m => m._id === updatedData._id)) {
            state.messagesByChatId[chatId].push(updatedData);
            console.log(`[WS Chats] Сообщение (_id: ${updatedData._id}) добавлено в messagesByChatId['${chatId}']`);
          }
        } else {
          console.warn(`[WS Chats] Получено сообщение для чата ${chatId}, но чат не найден в списке. Сообщение:`, updatedData);
        }
      } else if (updatedData._id && !updatedData.type) {
        const existingChatIndex = state.chats.findIndex(c => c._id === updatedData._id);
        if (existingChatIndex > -1) {
          state.chats[existingChatIndex] = {
            ...state.chats[existingChatIndex],
            ...updatedData
          };
          console.log(`[WS Chats] Обновлены метаданные для чата ${updatedData._id}.`);
        } else {
          state.chats.push({
            unread_count: 0,
            ...updatedData
          });
          console.log(`[WS Chats] Добавлен новый чат ${updatedData._id}.`);
        }
      } else {
        console.warn("[WS Chats] Получены непонятные данные для обновления:", updatedData);
      }
      state.chats = sortChats(state.chats);
    },
    clearCurrentChatDetails: state => {
      state.currentChatDetails = null;
      state.chatHistoryStatus = 'idle';
      state.chatHistoryError = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchChats.pending, state => {
      state.chatsListStatus = 'loading';
      state.chatsListError = null;
    }).addCase(fetchChats.fulfilled, (state, action) => {
      state.chatsListStatus = 'succeeded';
      state.chats = action.payload;
    }).addCase(fetchChats.rejected, (state, action) => {
      state.chatsListStatus = 'failed';
      state.chatsListError = action.payload;
    }).addCase(fetchChatHistory.pending, state => {
      state.chatHistoryStatus = 'loading';
      state.chatHistoryError = null;
    }).addCase(fetchChatHistory.fulfilled, (state, action) => {
      state.chatHistoryStatus = 'succeeded';
      state.currentChatDetails = action.payload.chat;
      state.messagesByChatId[action.payload.chatId] = action.payload.messages;
    }).addCase(fetchChatHistory.rejected, (state, action) => {
      state.chatHistoryStatus = 'failed';
      state.chatHistoryError = action.payload;
    }).addCase(sendMessage.pending, state => {
      state.sendMessageStatus = 'loading';
      state.sendMessageError = null;
    }).addCase(sendMessage.fulfilled, (state, action) => {
      state.sendMessageStatus = 'succeeded';
      console.log("[SendMessage API] Сообщение успешно обработано API:", action.payload);
    }).addCase(sendMessage.rejected, (state, action) => {
      state.sendMessageStatus = 'failed';
      state.sendMessageError = action.payload;
      console.error("[SendMessage API] Ошибка:", action.payload);
    });
  }
});
export const {
  wsMessageReceived,
  wsChatUpdated,
  clearCurrentChatDetails
} = chatSlice.actions;
export const selectAllChats = state => state.chat.chats;
export const selectChatsListStatus = state => state.chat.chatsListStatus;
export const selectChatsListError = state => state.chat.chatsListError;
export const selectCurrentChatDetails = state => state.chat.currentChatDetails;
export const selectMessagesForCurrentChat = state => {
  const currentChatId = state.chat.currentChatDetails?._id;
  if (currentChatId && state.chat.messagesByChatId[currentChatId]) {
    return state.chat.messagesByChatId[currentChatId];
  }
  return [];
};
export const selectAllMessagesByChatId = state => state.chat.messagesByChatId;
export const selectChatHistoryStatus = state => state.chat.chatHistoryStatus;
export const selectChatHistoryError = state => state.chat.chatHistoryError;
export const selectSendMessageStatus = state => state.chat.sendMessageStatus;
export const selectSendMessageError = state => state.chat.sendMessageError;
export default chatSlice.reducer;
