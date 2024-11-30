import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { NEW_BASE_URL } from '../NewBaseurl/NewBaseurl';

// Define your API URL
const API_URL = `${NEW_BASE_URL}/api/drivers`; // Update with your actual API URL

// Async Thunks for making API calls

// 1. Fetch all drivers
export const fetchDrivers = createAsyncThunk(
  'drivers/fetchDrivers',
  async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
      console.log('Fetch Drivers Response:', response.data); // Log successful response
      return response.data;
    } catch (error) {
      console.error(
        'Fetch Drivers Error:',
        error.response?.data || error.message,
      ); // Log error
      throw error; // Propagate the error
    }
  },
);

// 2. Fetch a specific driver by ID
export const fetchDriverById = createAsyncThunk(
  'drivers/fetchDriverById',
  async id => {
    try {
      const response = await axios.get(`${API_URL}/get/${id}`);
      console.log('Fetch Driver By ID Response:', response.data); // Log successful response
      return response.data;
    } catch (error) {
      console.error(
        'Fetch Driver By ID Error:',
        error.response?.data || error.message,
      ); // Log error
      throw error; // Propagate the error
    }
  },
);

// 3. Create a new driver
export const createDriver = createAsyncThunk(
  'drivers/createDriver',
  async driverData => {
    try {
      console.log(driverData, 'driverData');
      const response = await axios.post(`${API_URL}/create`, driverData);
      console.log('Create Driver Response:', response.data); // Log successful response
      return response.data;
    } catch (error) {
      console.error(
        'Create Driver Error:',
        error.response?.data || error.message,
      ); // Log error
      throw error; // Propagate the error
    }
  },
);

// 4. Update an existing driver
export const updateDriver = createAsyncThunk(
  'drivers/updateDriver',
  async ({id, driverData}) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, driverData);
      console.log('Update Driver Response:', response.data); // Log successful response
      return response.data;
    } catch (error) {
      console.error(
        'Update Driver Error:',
        error.response?.data || error.message,
      ); // Log error
      throw error; // Propagate the error
    }
  },
);

// 5. Delete a driver
export const deleteDriver = createAsyncThunk(
  'drivers/deleteDriver',
  async id => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      console.log('Delete Driver Response: Driver ID:', id); // Log successful deletion
      return id;
    } catch (error) {
      console.error(
        'Delete Driver Error:',
        error.response?.data || error.message,
      ); // Log error
      throw error; // Propagate the error
    }
  },
);

// 6. Fetch drivers by userId
export const fetchDriversByUserId = createAsyncThunk(
  'drivers/fetchDriversByUserId',
  async (_, {rejectWithValue}) => {
    try {
      // Get user_id from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id'); // Get 'user_id' from AsyncStorage

      if (!userId) {
        return rejectWithValue('No user_id found in AsyncStorage');
      }

      // Make the API call with the fetched user_id
      const response = await axios.get(`${API_URL}/getByUserId/${userId}`);
      console.log('Fetch Drivers By User ID Response:', response.data); // Log successful response
      return response.data; // Return the data on success
    } catch (error) {
      console.error(
        'Fetch Drivers By User ID Error:',
        error.response?.data || error.message,
      ); // Log error
      return rejectWithValue(error.response?.data || error.message); // Propagate error message
    }
  },
);

// Initial state for the slice
const initialState = {
  drivers: [],
  selectedDriver: null,
  status: 'idle', // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

// Create the slice
const driverSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    resetSelectedDriver: state => {
      state.selectedDriver = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all drivers
      // Fetch driver by ID
      .addCase(fetchDriverById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedDriver = action; // Store the action
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Create driver
      .addCase(createDriver.pending, state => {
        state.status = 'loading';
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure that state.drivers is an array
        if (Array.isArray(state.drivers)) {
          state.drivers.push(action.payload); // Add new driver
        } else {
          state.drivers = [action.payload]; // If it's undefined, initialize it as an array
        }
      })
      .addCase(createDriver.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Update driver
      .addCase(updateDriver.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.drivers.findIndex(
          driver => driver._id === action.payload._id,
        );
        if (index !== -1) {
          state.drivers[index] = action.payload; // Store the action.payload
        }
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Delete driver
      .addCase(deleteDriver.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Check if drivers is an array before applying the filter
        if (Array.isArray(state.drivers)) {
          state.drivers = state.drivers.filter(
            driver => driver._id !== action.payload
          );
        }
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch drivers by userId
      .addCase(fetchDriversByUserId.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchDriversByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.drivers = action.payload; // Store the action.payload
      })
      .addCase(fetchDriversByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {resetSelectedDriver} = driverSlice.actions;

// // Export async thunks
// export { fetchDrivers, fetchDriverById, createDriver, updateDriver, deleteDriver, fetchDriversByUserId };

// Export the reducer
export default driverSlice.reducer;
