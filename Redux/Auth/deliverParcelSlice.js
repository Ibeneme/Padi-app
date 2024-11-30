import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {NEW_BASE_URL} from '../NewBaseurl/NewBaseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  parcels: [],
  loading: false,
  error: null,
};

// Async thunks for API requests

// 1. Fetch all parcels
export const fetchAllParcels = createAsyncThunk(
  'parcels/fetchAll',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${NEW_BASE_URL}/api/deliver/deliverparcels`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 2. Fetch parcels by userId
export const fetchUserParcels = createAsyncThunk(
  'parcels/fetchUser',
  async (_, {rejectWithValue}) => {
    try {
      // Fetch the userId from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');

      if (!userId) {
        throw new Error('User ID not found in storage.');
      }

      // Make the API request
      const response = await axios.get(
        `${NEW_BASE_URL}/api/deliver/deliverparcels/user/${userId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 2. Fetch parcels by userId
export const allFetchUserParcels = createAsyncThunk(
  'parcels/allFetchUserParcels',
  async (_, {rejectWithValue}) => {
    try {
      // Fetch the userId from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');

      if (!userId) {
        throw new Error('User ID not found in storage.');
      }

      // Make the API request
      const response = await axios.get(
        `${NEW_BASE_URL}/api/deliver/deliverparcels-all`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 3. Add a new parcel
export const addParcel = createAsyncThunk(
  'parcels/addParcel',
  async (parcelData, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${NEW_BASE_URL}/api/deliver/deliverparcels`,
        parcelData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 4. Update an existing parcel
export const updateParcel = createAsyncThunk(
  'parcels/updateParcel',
  async ({id, parcelData}, {rejectWithValue}) => {
    try {
      const response = await axios.put(
        `${NEW_BASE_URL}/api/deliver/deliverparcels/${id}`,
        parcelData,
      );
      return response.data.updatedParcel;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 5. Delete a parcel
export const deleteParcel = createAsyncThunk(
  'parcels/deleteParcel',
  async (id, {rejectWithValue}) => {
    try {
      const response = await axios.delete(
        `${NEW_BASE_URL}/api/deliver/deliverparcels/${id}`,
      );
      return response.data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
// Slice definition
const deliverParcelSlice = createSlice({
  name: 'parcels',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch all parcels
      .addCase(fetchAllParcels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = action.payload;
      })
      .addCase(fetchAllParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch parcels by userId
      .addCase(fetchUserParcels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = action.payload;
      })
      .addCase(fetchUserParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch parcels by all
      .addCase(allFetchUserParcels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allFetchUserParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = action.payload;
      })
      .addCase(allFetchUserParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add a new parcel
      .addCase(addParcel.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels.push(action.payload);
      })
      .addCase(addParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update an existing parcel
      .addCase(updateParcel.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = state.parcels.map(parcel =>
          parcel._id === action.payload._id ? action.payload : parcel,
        );
      })
      .addCase(updateParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete a parcel
      .addCase(deleteParcel.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = state.parcels.filter(
          parcel => parcel._id !== action.payload,
        );
      })
      .addCase(deleteParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default deliverParcelSlice.reducer;
