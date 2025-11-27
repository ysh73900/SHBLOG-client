import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/axiosUtils";

export const getPosts = createAsyncThunk(
  "post/getPosts",
  async ({ page, size }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const result = await api.get(`/api/posts?page=${page}&size=${size}`);

      return fulfillWithValue(result.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPostBySlug = createAsyncThunk(
  "posts/getPostBySlug",
  async (slug, { fulfillWithValue, rejectWithValue }) => {
    try {
      const result = await api.get(`/api/posts/${slug}`);

      return fulfillWithValue(result.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const result = await api.post("/api/posts", postData);

      return fulfillWithValue(result.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { fulfillWithValue, rejectWithValue }) => {
    try {
      await api.delete(`/api/posts/${postId}`);

      return fulfillWithValue(postId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  currentPage: 0, // 백엔드 Page 객체의 'number'
  totalPages: 0, // 백엔드 Page 객체의 'totalPages'
  totalElements: 0, // 전체 아이템 개수를 저장할 상태

  // 상세 페이지용 상태
  currentPost: null,
  detailStatus: "idle",
  detailError: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.currentPage = 0;
      state.totalPages = 0;
      state.totalElements = 0;
    },
    // 상세 페이지 나갈 때 데이터 비우기 (깜빡이 방지)
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [...state.items, ...action.payload.content];
        state.currentPage = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // getPostBySlug Thunk 처리
      .addCase(getPostBySlug.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(getPostBySlug.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.currentPost = action.payload;
      })
      .addCase(getPostBySlug.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload;
      })
      // createPost Thunk 처리
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        // 이미 리스트에 같은 ID의 포스트가 있는지 확인, 없을 때만 추가
        const exists = state.items.some(
          (post) => post.id === action.payload.id
        );
        if (!exists) {
          state.items.unshift(action.payload);
          state.totalElements += 1;
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // deletePost Thunk 처리
      .addCase(deletePost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((post) => post.id !== action.payload);
        state.totalElements -= 1;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearPosts, clearCurrentPost } = postSlice.actions;

export default postSlice.reducer;
