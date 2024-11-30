// src/features/chat/chatSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const SOCKET_SERVER_URL = 'http://localhost:3000'; // Replace with your server URL

export const getChatID = createAsyncThunk(
  'chat/getChatID',
  async (users, {rejectWithValue}) => {
    try {
      console.log(users, 'users');
      const response = await axios.post(
        'http://localhost:3000/api/createChat',
        {users},
      );
      return response.data.chatID;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getChatMessaging = createAsyncThunk(
  'chat/getChatMessaging',
  async (chatID, {rejectWithValue}) => {
    try {
      console.log(chatID, 'chatID');
      const response = await axios.get(`http://localhost:3000/api/${chatID}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getChatMessagingByUser = createAsyncThunk(
  'chat/getChatMessagingByUser',
  async (chatID, {rejectWithValue}) => {
    try {
      console.log(chatID, 'chatID');
      const response = await axios.get(
        `http://localhost:3000/api/chats/${chatID}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);


const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatID: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getChatID.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getChatID.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatID = action.payload;
      })
      .addCase(getChatID.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })


      .addCase(getChatMessagingByUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getChatMessagingByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatID = action.payload;
      })
      .addCase(getChatMessagingByUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })


      .addCase(getChatMessaging.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getChatMessaging.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatID = action.payload;
      })
      .addCase(getChatMessaging.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
