import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: { authedUser: null },
  reducers: {
    login(state, action) { state.authedUser = action.payload; },
    logout(state)        { state.authedUser = null; },
  },
});

export const { login, logout } = slice.actions;
export default slice.reducer;
