import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { _getUsers } from "../../_DATA";

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  return await _getUsers();
});

const slice = createSlice({
  name: "users",
  initialState: { byId: {}, status: "idle", error: null },
  reducers: {
    // Optimistic local mutations driven by question creation/voting.
    userAnswered(state, { payload: { authedUser, qid, answer } }) {
      if (state.byId[authedUser]) {
        state.byId[authedUser].answers = {
          ...state.byId[authedUser].answers,
          [qid]: answer,
        };
      }
    },
    userAddedQuestion(state, { payload: { author, qid } }) {
      if (state.byId[author]) {
        state.byId[author].questions = [...state.byId[author].questions, qid];
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending,   (s) => { s.status = "loading"; });
    b.addCase(fetchUsers.fulfilled, (s, a) => { s.status = "ready"; s.byId = a.payload; });
    b.addCase(fetchUsers.rejected,  (s, a) => { s.status = "error"; s.error = a.error.message; });
  },
});

export const { userAnswered, userAddedQuestion } = slice.actions;
export default slice.reducer;

// selectors
export const selectUsers       = (s) => s.users.byId;
export const selectUserById    = (id) => (s) => s.users.byId[id];
export const selectAuthedUser  = (s) => s.auth.authedUser ? s.users.byId[s.auth.authedUser] : null;
export const selectLeaderboard = (s) =>
  Object.values(s.users.byId)
    .map((u) => ({
      id: u.id,
      name: u.name,
      avatarURL: u.avatarURL,
      asked: u.questions.length,
      answered: Object.keys(u.answers).length,
      score: u.questions.length + Object.keys(u.answers).length,
    }))
    .sort((a, b) => b.score - a.score);
