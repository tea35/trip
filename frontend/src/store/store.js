import { configureStore, createSlice } from "@reduxjs/toolkit";

// ログイン状態を管理するスライス
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

// ストアの作成
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

// アクションのエクスポート
export const { login, logout } = authSlice.actions;

// ストアのエクスポート
export default store;
