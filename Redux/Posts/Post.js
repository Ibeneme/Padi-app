import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../Baseurl';

const initialState = {
  posts: [],
  post: null,
  status: 'idle',
  error: null,
  accessToken: null,
  loading: false,
  isLoadingPosts: false,
};

export const fetchAccessToken = createAsyncThunk(
  'post/fetchAccessToken',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log(token, 'token');
      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Failed to retrieve the access token from AsyncStorage',
      );
    }
  },
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async ({post, images}, thunkAPI) => {
    const token = await AsyncStorage.getItem('access_token');

    try {
      const formData = new FormData();
      formData.append('post', post);

      const response = await axios.post(
        `${BASE_URL}/rideapi/post/create/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Create Post Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create Post Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const editPost = createAsyncThunk(
  'post/editPost',
  async ({post, id}, thunkAPI) => {
    const token = await AsyncStorage.getItem('access_token');
    const requestBody = {post};

    try {
      const response = await axios.put(
        `${BASE_URL}/rideapi/post/edit-post/${id}/`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Edit Post Response:', response);
      return response.data;
    } catch (error) {
      console.error('Edit Post Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postId, thunkAPI) => {
    const token = await AsyncStorage.getItem('access_token');
    try {
      const response = await axios.delete(
        `${BASE_URL}/rideapi/post/delete/${postId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Delete Post Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete Post Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchAllPosts = createAsyncThunk(
  'post/fetchAllPosts',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        `${BASE_URL}/rideapi/post/list-all-post/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Fetch All Posts Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch All Posts Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchUserPosts = createAsyncThunk(
  'post/fetchUserPosts',
  async (_, thunkAPI) => {
    const token = await AsyncStorage.getItem('access_token');
    try {
      const response = await axios.get(
        `${BASE_URL}/rideapi/post/single-user-post/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Fetch User Posts Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch User Posts Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAccessToken.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchAccessToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccessToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(editPost.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createPost.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deletePost.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = state.posts.filter(post => post.id !== action.payload.id);
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPosts.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.isLoadingPosts = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.isLoadingPosts = false;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoadingPosts = false;
      })
      .addCase(fetchUserPosts.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default postSlice.reducer;
