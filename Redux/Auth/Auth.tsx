import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NEW_BASE_URL} from '../NewBaseurl/NewBaseurl';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${NEW_BASE_URL}/api/auth/register`,
        userData,
      );
      console.log(response.data, 'Registration Response');
      return response.data;
    } catch (error) {
      console.error(error, 'Registration Error');
      return error;
    }
  },
);

const accessToken = AsyncStorage.getItem('access_token');
console.log(accessToken, 'accessToken');

// Other Thunks (Placeholder)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, thunkAPI) => {
    try {
      const {phone_number, password} = loginData;

      // Make the API call to the backend
      const response = await axios.post(`${NEW_BASE_URL}/api/auth/login`, {
        phone_number,
        password,
      });

      console.log(response.data, 'Login Responses');

      const access = response?.data?.accessToken;
      const refresh = response?.data?.refreshToken;
      const userId = response?.data?.user?._id; // Get the user ID from the response

      if (access) {
        // Store tokens and user ID in AsyncStorage
        await AsyncStorage.setItem('access_token', access);
        await AsyncStorage.setItem('refresh_token', refresh);
        await AsyncStorage.setItem('phone_number', phone_number);
        await AsyncStorage.setItem('password', password);

        // Store user ID in AsyncStorage
        await AsyncStorage.setItem('user_id', userId);
      }

      // Return user data only if `accessToken` is set
      if (access) {
        return response.data;
      } else {
        throw new Error('AccessToken not provided.');
      }
    } catch (error) {
      console.error(error, 'Login Error');
      return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
    }
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (phone_number, {rejectWithValue}) => {
    console.log(phone_number, 'phone_number');
    try {
      const response = await axios.post(
        `${NEW_BASE_URL}/api/auth/change-password`,
        {
          phone_number,
        },
      );
      return response.data; // response contains success and message
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle error from API
    }
  },
);

// Async Thunks
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (phoneNumber, thunkAPI) => {
    try {
      const response = await axios.post(`${NEW_BASE_URL}/api/auth/resend-otp`, {
        phone_number: phoneNumber,
      });
      console.log(response.data, 'OTP Resend Response');
      return response.data;
    } catch (error) {
      console.error(error, 'OTP Resend Error');
      return error;
    }
  },
);

// Async Thunks
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',

  async ({phoneNumber, otp}, thunkAPI) => {
    console.log(phoneNumber, otp, 'jjj');
    try {
      const response = await axios.post(`${NEW_BASE_URL}/api/auth/verify-otp`, {
        phone_number: phoneNumber,
        otp,
      });
      console.log(response.data, 'OTP Verify Response');
      return response.data;
    } catch (error) {
      console.error(error, 'OTP Verify Error');
      return error;
    }
  },
);

export const verifyToken = createAsyncThunk('auth/verifyToken', async () => {});
export const verifyOTPPassword = createAsyncThunk(
  'auth/verifyOTPPassword',

  async ({phoneNumber, otp}, thunkAPI) => {
    console.log(phoneNumber, otp, 'jjj');
    try {
      const response = await axios.post(`${NEW_BASE_URL}/api/auth/verify-otp`, {
        phone_number: phoneNumber,
        otp,
      });
      console.log(response.data, 'OTP Verify Response');
      return response.data;
    } catch (error) {
      console.error(error, 'OTP Verify Error');
      return error;
    }
  },
);

// Fetch user details by ID
export const fetchUserById = createAsyncThunk(
  'auth/fetchUserById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${NEW_BASE_URL}/api/auth/user/${id}`);
      console.log(response.data, 'Fetch User Response');
      return response.data; // Return user details
    } catch (error) {
      console.error(error.response?.data || error.message, 'Fetch User Error');
      return thunkAPI.rejectWithValue(
        error.response?.data || {message: 'Failed to fetch user details.'},
      );
    }
  },
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, thunkAPI) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token'); // Retrieve access token
      if (!accessToken) {
        return thunkAPI.rejectWithValue('Access token not found');
      }
      console.log(accessToken, 'accessTokenaccessToken');
      const response = await axios.get(`${NEW_BASE_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response, 'responseresponse');
      return response.data; // Return user details
    } catch (error) {
      //console.error(error.response?.data || error.message, 'Fetch User Error');
      return error;
    }
  },
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async () => {},
);

// Thunk to reset password
export const passwordReset = createAsyncThunk(
  'auth/passwordReset',
  async ({phone_number, new_password}, thunkAPI) => {
    try {
      const response = await axios.post(
        `${NEW_BASE_URL}/api/auth/confirm-change-password`,
        {
          phone_number,
          new_password,
        },
      );
      console.log(response.data, 'Password Reset Response');
      return response.data;
    } catch (error) {
      console.error(
        error.response?.data || error.message,
        'Password Reset Error',
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || {message: 'Failed to reset password.'},
      );
    }
  },
);

// Async Thunks
export const updateUserDetails = createAsyncThunk(
  'auth/updateUserDetails',
  async (userDetails, thunkAPI) => {
    try {
      // Retrieve the user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        return thunkAPI.rejectWithValue('User ID not found in AsyncStorage');
      }

      // Destructure the userDetails object to get the other values
      const {first_name, last_name, phone_number, email, id} = userDetails;
      console.log(userDetails, 'userDetails');
      // Send the PUT request with the user ID and other details
      const response = await axios.put(
        `${NEW_BASE_URL}/api/auth/user/${id}`, // Use the retrieved user ID
        {first_name, last_name, phone_number, email},
      );

      console.log(response.data, 'Update User Response');
      return response.data; // Return the updated user details
    } catch (error) {
      console.error(error, 'Update User Error');
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Failed to update user details',
      );
    }
  },
);

// Slice
const registrationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: state => {
      state.user = null;
      state.error = null;
    },
    logoutUs: state => {
      state.user = null;
    },
  },
  extraReducers: builder => {
    // Generic loading, fulfilled, and rejected handlers
    const handlePending = state => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload || null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An error occurred';
    };

    // Register User
    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected);

    // Login User
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected);

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, handleRejected);

    // Resend OTP
    builder
      .addCase(resendOTP.pending, handlePending)
      .addCase(resendOTP.fulfilled, state => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, handleRejected);

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, handlePending)
      .addCase(verifyOTP.fulfilled, state => {
        state.loading = false;
      })
      .addCase(verifyOTP.rejected, handleRejected);

    // Verify Token
    builder
      .addCase(verifyToken.pending, handlePending)
      .addCase(verifyToken.fulfilled, state => {
        state.loading = false;
      })
      .addCase(verifyToken.rejected, handleRejected);

    // Verify OTP Password
    builder
      .addCase(verifyOTPPassword.pending, handlePending)
      .addCase(verifyOTPPassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(verifyOTPPassword.rejected, handleRejected);

    // Refresh Token
    builder
      .addCase(refreshToken.pending, handlePending)
      .addCase(refreshToken.fulfilled, state => {
        state.loading = false;
      })
      .addCase(refreshToken.rejected, handleRejected);

    // Password Reset
    builder
      .addCase(passwordReset.pending, handlePending)
      .addCase(passwordReset.fulfilled, state => {
        state.loading = false;
      })
      .addCase(passwordReset.rejected, handleRejected);

    builder
      .addCase(fetchUserById.pending, handlePending)
      .addCase(fetchUserById.fulfilled, handleFulfilled)
      .addCase(fetchUserById.rejected, handleRejected);

    builder
      .addCase(fetchUser.pending, handlePending)
      .addCase(fetchUser.fulfilled, handleFulfilled)
      .addCase(fetchUser.rejected, handleRejected);
    builder
      .addCase(updateUserDetails.pending, handlePending)
      .addCase(updateUserDetails.fulfilled, handleFulfilled)
      .addCase(updateUserDetails.rejected, handleRejected);
  },
});

// Exports
export const {logoutUs} = registrationSlice.actions;
export const {logoutUser} = registrationSlice.actions;
export default registrationSlice.reducer;
