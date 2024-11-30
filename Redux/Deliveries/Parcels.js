import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../Baseurl';

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: BASE_URL, // Replace with your actual base URL
});

const initialState = {
  deliveries: [],
  parcelSenders: [],
  messaging: [],
  userDeliveryHistory: [],
  userSendParcelHistory: [],
  status: 'idle',
  error: null,
};

// Helper function to get the access token
const getAccessTokenFromAsyncStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    return token || null;
  } catch (error) {
    throw error;
  }
};

// Async thunk to list drivers
export const listDrivers = createAsyncThunk(
  'delivery/listDrivers',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getAccessTokenFromAsyncStorage();
      const response = await apiClient.get('/rideapi/list-all-drivers/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk to list parcel drivers
export const listParcelDrivers = createAsyncThunk(
  'delivery/listParcelDrivers',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getAccessTokenFromAsyncStorage();
      const response = await apiClient.get(
        '/rideapi/delivery/list-parcel-senders/',
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

// Async thunk to fetch messaging
export const fetchMessaging = createAsyncThunk(
  'delivery/fetchMessaging',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getAccessTokenFromAsyncStorage();
      const response = await apiClient.get('/rideapi/delivery/messaging/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk to fetch user delivery history
export const fetchUserDeliveryHistory = createAsyncThunk(
  'delivery/fetchUserDeliveryHistory',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getAccessTokenFromAsyncStorage();
      const response = await apiClient.get(
        '/rideapi/delivery/user-delivery-history/',
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

// Async thunk to fetch user send parcel history
export const fetchSingleUserParcelHistory = createAsyncThunk(
  'delivery/fetchSingleUserParcelHistory',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getAccessTokenFromAsyncStorage();
      const response = await apiClient.get(
        '/rideapi/delivery/user-sendparcel-history/',
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

// Async thunk to send a parcel
export const sendParcel = createAsyncThunk(
  'delivery/sendParcel',
  async ({payload}, {rejectWithValue}) => {
    try {
      const token = await getAccessTokenFromAsyncStorage();
      const response = await apiClient.post(
        '/rideapi/delivery/send-parcel/',
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

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(listDrivers.pending, state => {
        state.status = 'loading';
      })
      .addCase(listDrivers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deliveries = action.payload;
      })
      .addCase(listDrivers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(listParcelDrivers.pending, state => {
        state.status = 'loading';
      })
      .addCase(listParcelDrivers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parcelSenders = action.payload;
      })
      .addCase(listParcelDrivers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMessaging.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchMessaging.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messaging = action.payload;
      })
      .addCase(fetchMessaging.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUserDeliveryHistory.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserDeliveryHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userDeliveryHistory = action.payload;
      })
      .addCase(fetchUserDeliveryHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSingleUserParcelHistory.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchSingleUserParcelHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userSendParcelHistory = action.payload;
      })
      .addCase(fetchSingleUserParcelHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(sendParcel.pending, state => {
        state.status = 'loading';
      })
      .addCase(sendParcel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle success action here if needed
      })
      .addCase(sendParcel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default deliverySlice.reducer;
