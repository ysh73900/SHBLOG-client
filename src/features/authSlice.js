import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/axiosUtils";
import { isTokenExpired } from "../utils/jwtUtils";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { fulfillWithValue, rejectWithValue }) => {
    try {
      console.log("credentials ->", credentials);
      // 1. 로그인 API 호출
      const result = await api.post("/api/auth/login", credentials);

      // 2. JwtResponse DTO에서 모든 정보 추출
      const { accessToken, refreshToken, id, username, email, role } =
        result.data;

      // 3. localStorage에 모든 정보 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", String(id));
      localStorage.setItem("username", username);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("role", role);

      // 4. Redux 스토어에 전달
      return fulfillWithValue({
        accessToken,
        refreshToken,
        user: { id, username, email, role },
      });
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const result = await api.post("/api/auth/signup", userData);

      return fulfillWithValue(result.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (refreshTokenArg, { fulfillWithValue, rejectWithValue, dispatch }) => {
    try {
      const baseURL = api.defaults.baseURL;

      // refreshToken이 없으면 서버에 요청할 필요 없이 클라이언트만 정리하고 성공 처리
      if (!refreshTokenArg) {
        console.warn(
          "Refresh token not provided for logout. Proceeding with local cleanup only."
        );
        dispatch(clearAuthData()); // 클라이언트 상태 초기화
        return fulfillWithValue("Local logout successFul.");
      }

      const response = await axios.post(
        `${baseURL}/api/auth/logout`,
        {
          refreshToken: refreshTokenArg,
        },
        {
          withCredentials: true,
        }
      );
      console.log("백엔드 로그아웃 응답 -> ", response.data);

      dispatch(clearAuthData());

      return fulfillWithValue(response.data);
    } catch (error) {
      console.log("백엔드 로그아웃 실패 -> ", error);
      dispatch(clearAuthData());
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  userId: null,
  userEmail: null,
  username: null,
  role: null,
  status: "idle",
  error: null,
  loginError: null,
  signupError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthData: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.userEmail = null;
      state.username = null;
      state.role = null;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSignupError: (state) => {
      state.signupError = null;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    loadAuthStateFromLocalStorage: (state) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const userIdString = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail");
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");

      // userId는 숫자로 변환
      const userId = userIdString ? Number(userIdString) : null;

      // 토큰 존재 여부 + 만료 여부 + 필수 사용자 정보의 유효성까지 확인
      // userId가 null이 아니어야 함 (Number(null)은 0이 되므로 주의)
      let isAccessTokenValid = false;
      try {
        isAccessTokenValid = accessToken && !isTokenExpired(accessToken);
      } catch (error) {
        console.warn("Access token is corrupted, treating as expired.", error);
        isAccessTokenValid = false;
      }

      if (isAccessTokenValid && userId && userEmail && username && role) {
        state.isLoggedIn = true;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.userId = userId;
        state.userEmail = userEmail;
        state.username = username;
        state.role = role;
      } else if (refreshToken && userId && userEmail && username && role) {
        state.isLoggedIn = false;
        state.accessToken = null;
        state.refreshToken = refreshToken;
        state.userId = userId;
        state.userEmail = userEmail;
        state.username = username;
        state.role = role;
      } else {
        // 토큰이 없거나, 만료되었거나, 필수 사용자 정보 중 하나라도 없으면 모두 초기화
        state.isLoggedIn = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.userId = null;
        state.userEmail = null;
        state.username = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
      }
    },

    // (axios 인터셉터용) 토큰 갱싱 성공 시 스토어 상태를 업데이트하는 리듀서
    // axiosUtil에서 store.dispatch({ type: "auth/setTokens", ... })로 호출
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // LoginUser Thunk 처리
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userId = action.payload.user.id;
        state.userEmail = action.payload.user.email;
        state.username = action.payload.user.username;
        state.role = action.payload.user.role;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
        state.loginError = action.payload;

        // 로그인 실패시 클라이언트 토큰도 삭제 (보안상 안전)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
      })
      // signupUser Thunk 처리
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.signupError = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.signupError = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.signupError = action.payload;
      })
      // logoutUser Thunk 처리
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  clearAuthData,
  clearError,
  clearSignupError,
  clearLoginError,
  loadAuthStateFromLocalStorage,
  setTokens,
} = authSlice.actions;

export default authSlice.reducer;
