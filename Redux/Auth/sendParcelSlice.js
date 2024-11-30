import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {NEW_BASE_URL} from '../NewBaseurl/NewBaseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = `${NEW_BASE_URL}/api/parcel`; // Adjust the base URL as needed

// Async thunks for CRUD operations

// 1. Create a parcel
export const createParcel = createAsyncThunk(
  'sendParcel/createParcel',
  async (parcelData, {rejectWithValue}) => {
    try {
      const response = await axios.post(API_URL, parcelData);
      console.log('Create Parcel Response:', response.data); // Log the response
      return response.data;
    } catch (error) {
      console.error(
        'Create Parcel Error:',
        error.response?.data || error.message,
      ); // Log the error
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 2. Fetch all parcels
export const fetchParcels = createAsyncThunk(
  'sendParcel/fetchParcels',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get(API_URL);
      console.log('Fetch Parcels Response:', response.data); // Log the response
      return response.data;
    } catch (error) {
      console.error(
        'Fetch Parcels Error:',
        error.response?.data || error.message,
      ); // Log the error
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 3. Fetch a parcel by ID
export const fetchParcelById = createAsyncThunk(
  'sendParcel/fetchParcelById',
  async (id, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      console.log('Fetch Parcel By ID Response:', response.data); // Log the response
      return response.data;
    } catch (error) {
      console.error(
        'Fetch Parcel By ID Error:',
        error.response?.data || error.message,
      ); // Log the error
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 4. Update a parcel
export const updateParcel = createAsyncThunk(
  'sendParcel/updateParcel',
  async ({id, updatedData}, {rejectWithValue}) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      console.log('Update Parcel Response:', response.data); // Log the response
      return response.data;
    } catch (error) {
      console.error(
        'Update Parcel Error:',
        error.response?.data || error.message,
      ); // Log the error
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 5. Delete a parcel
export const deleteParcelforUser = createAsyncThunk(
  'sendParcel/deleteParcelforUser',
  async (id, {rejectWithValue}) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log('Delete Parcel Response:', response.data); // Log the response
      return {id, message: 'Parcel deleted successfully'};
    } catch (error) {
      console.error(
        'Delete Parcel Error:',
        error.response?.data || error.message,
      ); // Log the error
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchParcelsByUserId = createAsyncThunk(
  'sendParcel/fetchParcelsByUserId',
  async (_, {rejectWithValue}) => {
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        return rejectWithValue('User ID not found in AsyncStorage');
      }

      // Make the API request with the retrieved userId
      const response = await axios.get(`${API_URL}/user/${userId}`);
      console.log('Fetch Parcels By User ID Response:', response.data); // Log the response
      return response.data;
    } catch (error) {
      console.error(
        'Fetch Parcels By User ID Error:',
        error.response?.data || error.message,
      ); // Log the error
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Initial state
const initialState = {
  parcels: [],
  parcel: null,
  loading: false,
  error: null,
};

// Slice
const sendParcelSlice = createSlice({
  name: 'sendParcel',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Create parcel
      .addCase(createParcel.pending, state => {
        state.loading = true;
      })
      .addCase(createParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels.push(action.payload);
        state.error = null;
      })
      .addCase(createParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all parcels
      .addCase(fetchParcels.pending, state => {
        state.loading = true;
      })
      .addCase(fetchParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = action.payload;
        state.error = null;
      })
      .addCase(fetchParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch parcel by ID
      .addCase(fetchParcelById.pending, state => {
        state.loading = true;
      })
      .addCase(fetchParcelById.fulfilled, (state, action) => {
        state.loading = false;
        state.parcel = action.payload;
        state.error = null;
      })
      .addCase(fetchParcelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update parcel
      .addCase(updateParcel.pending, state => {
        state.loading = true;
      })
      .addCase(updateParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = state.parcels.map(parcel =>
          parcel._id === action.payload._id ? action.payload : parcel,
        );
        state.error = null;
      })
      .addCase(updateParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchParcelsByUserId.pending, state => {
        state.loading = true;
      })
      .addCase(fetchParcelsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = action.payload.data; // Assuming the response has a 'data' property
        state.error = null;
      })
      .addCase(fetchParcelsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete parcel
      .addCase(deleteParcelforUser.pending, state => {
        state.loading = true;
      })
      .addCase(deleteParcelforUser.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = state.parcels.filter(
          parcel => parcel._id !== action.payload.id,
        );
        state.error = null;
      })
      .addCase(deleteParcelforUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearError} = sendParcelSlice.actions;

export default sendParcelSlice.reducer;
