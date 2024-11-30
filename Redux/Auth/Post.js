import {NEW_BASE_URL} from '../NewBaseurl/NewBaseurl';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Base API URL
const API_URL = NEW_BASE_URL; // Adjust this to match your server's URL

// Async thunks for API operations

// Fetch all posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/post/all`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

// Create a new post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/api/post/create`, postData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

// Update a post
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({id, text}, thunkAPI) => {
    console.log(id, text, 'id, text');
    try {
      const response = await axios.put(`${API_URL}/api/post/update/`, {
        text,
        postId: id,
      });
      console.log(response.data, 'response.data');
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

// Delete a post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/api/post/delete/${id}`);
      return id;
    } catch (error) {
      return error;
    }
  },
);

// Post slice
const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = 'An Error Occurred';
      })
      // Create post
      .addCase(createPost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Adding post to the state:', action.payload); // Check payload
        if (Array.isArray(state.posts)) {
          state.posts.push(action.payload.post); // Ensure correct field is being pushed
        } else {
          console.error(
            'Expected posts to be an array, but it is:',
            state.posts,
          );
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update post
      .addCase(updatePost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.posts)) {
          state.posts = state.posts.map(post =>
            post._id === action.payload?.post?._id
              ? action.payload?.post
              : post,
          );
        } else {
          state.posts = [action.payload?.post]; // Initialize as an array if it's undefined
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete post
      .addCase(deletePost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.posts)) {
          state.posts = state.posts.filter(post => post._id !== action.payload);
        } else {
          state.posts = []; // If it's not an array, reset it to an empty array
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
