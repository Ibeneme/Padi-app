import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from '../Baseurl';

// CreateAsyncThunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async () => {
    try {
      const access = await AsyncStorage.getItem('access_token');
      if (!access) {
        throw new Error('Access token not found in AsyncStorage');
      }
      const response = await axios.get(
        `${BASE_URL}/rideapi/user_profile/get-user-profile/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const fetchUserProfileByID = createAsyncThunk(
  'user/fetchUserProfileByID',
  async user_id => {
    try {
      const access = await AsyncStorage.getItem('access_token');
      if (!access) {
        throw new Error('Access token not found in AsyncStorage');
      }
      const response = await axios.get(
        `${BASE_URL}/rideapi/user_profile/get-user-obj/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const setRidePrice = createAsyncThunk(
  'user/setRidePrice',
  async data => {
    try {
      const access = await AsyncStorage.getItem('access_token');
      if (!access) {
        throw new Error('Access token not found in AsyncStorage');
      }
      const response = await axios.post(
        `${BASE_URL}/rideapi/chat/set-price/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const paymentUrlCheckout = createAsyncThunk(
  'user/paymentUrlCheckout',
  async amount => {
    console.log(amount, 'amounttt'); // Logging the amount

    try {
      const access = await AsyncStorage.getItem('access_token');
      if (!access) {
        throw new Error('Access token not found in AsyncStorage');
      }

      const response = await axios.post(
        `${BASE_URL}/rideapi/payment/checkout-url`,
        {amount}, // Passing the amount in the body
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error during payment checkout:', error);
      throw error;
    }
  },
);

export const fetchParcelByid = createAsyncThunk(
  'user/fetchParcelByid',
  async parcel_id => {
    //  console.log(amount, 'amounttt'); // Logging the amount

    try {
      const access = await AsyncStorage.getItem('access_token');
      if (!access) {
        throw new Error('Access token not found in AsyncStorage');
      }

      const response = await axios.get(
        `${BASE_URL}/rideapi/delivery/send-parcel/${parcel_id}/`,

        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error during payment checkout:', error);
      throw error;
    }
  },
);

export const fetchDeliverParcelByID = createAsyncThunk(
  'user/fetchDeliverParcelByID',
  async parcel_id => {
    //  console.log(amount, 'amounttt'); // Logging the amount

    try {
      const access = await AsyncStorage.getItem('access_token');
      if (!access) {
        throw new Error('Access token not found in AsyncStorage');
      }

      const response = await axios.get(
        `${BASE_URL}/rideapi/delivery/deliver-parcel/${parcel_id}/`,

        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error during payment checkout:', error);
      throw error;
    }
  },
);

// CreateAsyncThunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async updatedProfileData => {
    try {
      const access = await AsyncStorage.getItem('access_token');
      if (!access) {
        throw new Error('Access token not found in AsyncStorage');
      }
      const response = await axios.put(
        `${BASE_URL}/rideapi/user_profile/update-profile/`,
        updatedProfileData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

// CreateAsyncThunk for verifying license
export const verifyLicense = createAsyncThunk(
  'user/verifyLicense',
  async updatedProfileData => {
    try {
      const access = await AsyncStorage.getItem('access_token');
      if (!access) {
        throw new Error('Access token not found in AsyncStorage');
      }
      const response = await axios.post(
        `${BASE_URL}/rideapi/user_profile/verify-license/`,
        updatedProfileData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userProfile: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(setRidePrice.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setRidePrice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(setRidePrice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(fetchParcelByid.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParcelByid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchParcelByid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(fetchDeliverParcelByID.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeliverParcelByID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchDeliverParcelByID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserProfileByID.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfileByID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfileByID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(verifyLicense.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyLicense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(verifyLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(paymentUrlCheckout.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(paymentUrlCheckout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(paymentUrlCheckout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
