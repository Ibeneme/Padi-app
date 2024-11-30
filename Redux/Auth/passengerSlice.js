import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { NEW_BASE_URL } from '../NewBaseurl/NewBaseurl';

// Base URL for your backend API
const API_URL = `${NEW_BASE_URL}/api/passenger`; // Update with your actual API URL

// Action to create a new passenger request
export const createPassengerRequest = createAsyncThunk(
  'passengerRequests/create',
  async (data, {rejectWithValue}) => {
    try {
      // Retrieve userId from AsyncStorage

      console.log('Creating passenger request with data:', data);

      // Append userId to the request data before sending it
      const response = await axios.post(`${API_URL}/create`, data);

      console.log('Passenger request created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error creating passenger request:',
        error.response ? error.response.data : error.message,
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

// Action to fetch all passenger requests
export const fetchPassengerRequests = createAsyncThunk(
  'passengerRequests/fetchAll',
  async (_, {rejectWithValue}) => {
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found');
      }
      console.log('Fetching all passenger requests for user:', userId);

      // Add userId to the API request as a parameter (if needed)
      const response = await axios.get(`${API_URL}/user/${userId}`);

      console.log('Fetched passenger requests:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching passenger requests:',
        error.response ? error.response.data : error.message,
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

// Action to fetch passenger requests by userId
export const fetchPassengerRequestsByUserId = createAsyncThunk(
  'passengerRequests/fetchByUserId',
  async (_, {rejectWithValue}) => {
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found');
      }
      console.log('Fetching passenger requests for userId:', userId);

      // Use the userId to fetch data
      const response = await axios.get(`${API_URL}/user/${userId}`);

      console.log('Fetched passenger requests by userId:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching passenger requests by userId:',
        error.response ? error.response.data : error.message,
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

// Action to fetch a single passenger request by ID
export const fetchPassengerRequestById = createAsyncThunk(
  'passengerRequests/fetchById',
  async (id, {rejectWithValue}) => {
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found');
      }
      console.log(
        `Fetching passenger request with ID: ${id} for userId: ${userId}`,
      );

      // Add userId to the API request if necessary
      const response = await axios.get(`${API_URL}/${id}?userId=${userId}`);

      console.log('Fetched passenger request:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching passenger request by ID:',
        error.response ? error.response.data : error.message,
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

// Action to update a passenger request
export const updatePassengerRequest = createAsyncThunk(
  'passengerRequests/update',
  async ({id, data}, {rejectWithValue}) => {
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found');
      }
      console.log(
        `Updating passenger request with ID: ${id} for userId: ${userId}`,
      );

      // Include userId in the request data
      const response = await axios.put(`${API_URL}/${id}`, {
        ...data,
        userId: userId, // Add userId to the request data
      });

      console.log('Updated passenger request:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error updating passenger request:',
        error.response ? error.response.data : error.message,
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

// Action to delete a passenger request
export const deletePassengerRequest = createAsyncThunk(
  'passengerRequests/delete',
  async (id, {rejectWithValue}) => {
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found');
      }
      console.log(
        `Deleting passenger request with ID: ${id} for userId: ${userId}`,
      );

      // Include userId in the delete request if needed
      await axios.delete(`${API_URL}/${id}?userId=${userId}`);

      console.log(`Successfully deleted passenger request with ID: ${id}`);
      return id;
    } catch (error) {
      console.error(
        'Error deleting passenger request:',
        error.response ? error.response.data : error.message,
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

const initialState = {
  passengerRequests: [],
  loading: false,
  error: null,
};

const passengerRequestSlice = createSlice({
  name: 'passengerRequests',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createPassengerRequest.pending, state => {
        console.log('Create passenger request - loading...');
        state.loading = true;
      })
      .addCase(createPassengerRequest.fulfilled, (state, action) => {
        console.log('Create passenger request - success:', action.payload);
        state.loading = false;
        state.passengerRequests.push(action.payload);
      })
      .addCase(createPassengerRequest.rejected, (state, action) => {
        console.error('Create passenger request - error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPassengerRequests.pending, state => {
        console.log('Fetch all passenger requests - loading...');
        state.loading = true;
      })
      .addCase(fetchPassengerRequests.fulfilled, (state, action) => {
        console.log('Fetch all passenger requests - success:', action.payload);
        state.loading = false;
        state.passengerRequests = action.payload;
      })
      .addCase(fetchPassengerRequests.rejected, (state, action) => {
        console.error('Fetch all passenger requests - error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPassengerRequestsByUserId.pending, state => {
        console.log('Fetch passenger requests by userId - loading...');
        state.loading = true;
      })
      .addCase(fetchPassengerRequestsByUserId.fulfilled, (state, action) => {
        console.log(
          'Fetch passenger requests by userId - success:',
          action.payload,
        );
        state.loading = false;
        state.passengerRequests = action.payload;
      })
      .addCase(fetchPassengerRequestsByUserId.rejected, (state, action) => {
        console.error(
          'Fetch passenger requests by userId - error:',
          action.payload,
        );
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPassengerRequestById.pending, state => {
        console.log('Fetch passenger request by ID - loading...');
        state.loading = true;
      })
      .addCase(fetchPassengerRequestById.fulfilled, (state, action) => {
        console.log('Fetch passenger request by ID - success:', action.payload);
        state.loading = false;
        state.passengerRequests = [action.payload];
      })
      .addCase(fetchPassengerRequestById.rejected, (state, action) => {
        console.error('Fetch passenger request by ID - error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePassengerRequest.pending, state => {
        console.log('Update passenger request - loading...');
        state.loading = true;
      })
      .addCase(updatePassengerRequest.fulfilled, (state, action) => {
        console.log('Update passenger request - success:', action.payload);
        state.loading = false;
        state.passengerRequests = state.passengerRequests.map(request =>
          request.id === action.payload.id ? action.payload : request,
        );
      })
      .addCase(updatePassengerRequest.rejected, (state, action) => {
        console.error('Update passenger request - error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePassengerRequest.pending, state => {
        console.log('Delete passenger request - loading...');
        state.loading = true;
      })
      .addCase(deletePassengerRequest.fulfilled, (state, action) => {
        console.log('Delete passenger request - success:', action.payload);
        state.loading = false;
        state.passengerRequests = state.passengerRequests.filter(
          request => request.id !== action.payload,
        );
      })
      .addCase(deletePassengerRequest.rejected, (state, action) => {
        console.error('Delete passenger request - error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default passengerRequestSlice.reducer;
