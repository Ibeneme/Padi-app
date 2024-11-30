import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from '../Baseurl';

const initialState = {
  wallet: [],
  status: 'idle',
  error: null,
};

// createAsyncThunk for creating a wallet
export const createWallet = createAsyncThunk(
  'delivery/createWallet',
  async (payload, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log(payload, token, 'access_token');
      const response = await axios.post(
        `${BASE_URL}/rideapi/wallet/create-wallet/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// createAsyncThunk for fetching the wallet
export const getWallet = createAsyncThunk(
  'delivery/getWallet',
  async (payload, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log(payload, token, 'access_token');
      const response = await axios.get(
        `${BASE_URL}/rideapi/wallet/get-wallet/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getTransactions = createAsyncThunk(
  'delivery/getTransactions',
  async (payload, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log(payload, token, 'access_token');
      const response = await axios.get(
        `${BASE_URL}/rideapi/user_profile/transactions/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const createWalletSlice = createSlice({
  name: 'createWallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createWallet.pending, state => {
        state.status = 'loading';
      })
      .addCase(createWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    builder
      .addCase(getWallet.pending, state => {
        state.status = 'loading';
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    builder
      .addCase(getTransactions.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default createWalletSlice.reducer;
