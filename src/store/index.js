import { configureStore } from "@reduxjs/toolkit";

import auth from "./authSlice";
import users from "./usersSlice";
import questions from "./questionsSlice";

export const store = configureStore({
  reducer: { auth, users, questions },
});
