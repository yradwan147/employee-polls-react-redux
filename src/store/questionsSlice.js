import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { _getQuestions, _saveQuestion, _saveQuestionAnswer } from "../../_DATA";
import { userAnswered, userAddedQuestion } from "./usersSlice";

export const fetchQuestions = createAsyncThunk("questions/fetch", async () => {
  return await _getQuestions();
});

export const addQuestion = createAsyncThunk(
  "questions/add",
  async ({ optionOneText, optionTwoText, author }, { dispatch }) => {
    const q = await _saveQuestion({ optionOneText, optionTwoText, author });
    dispatch(userAddedQuestion({ author, qid: q.id }));
    return q;
  }
);

export const answerQuestion = createAsyncThunk(
  "questions/answer",
  async ({ authedUser, qid, answer }, { dispatch }) => {
    await _saveQuestionAnswer({ authedUser, qid, answer });
    dispatch(userAnswered({ authedUser, qid, answer }));
    return { authedUser, qid, answer };
  }
);

const slice = createSlice({
  name: "questions",
  initialState: { byId: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchQuestions.pending,   (s) => { s.status = "loading"; });
    b.addCase(fetchQuestions.fulfilled, (s, a) => { s.status = "ready"; s.byId = a.payload; });
    b.addCase(fetchQuestions.rejected,  (s, a) => { s.status = "error"; s.error = a.error.message; });
    b.addCase(addQuestion.fulfilled,    (s, a) => { s.byId[a.payload.id] = a.payload; });
    b.addCase(answerQuestion.fulfilled, (s, a) => {
      const { authedUser, qid, answer } = a.payload;
      const q = s.byId[qid];
      if (q && !q[answer].votes.includes(authedUser)) {
        q[answer].votes.push(authedUser);
      }
    });
  },
});

export default slice.reducer;

// selectors
export const selectQuestions      = (s) => s.questions.byId;
export const selectQuestionById   = (id) => (s) => s.questions.byId[id];
export const selectAnsweredFor    = (uid) => (s) =>
  Object.values(s.questions.byId)
    .filter((q) => q.optionOne.votes.includes(uid) || q.optionTwo.votes.includes(uid))
    .sort((a, b) => b.timestamp - a.timestamp);
export const selectUnansweredFor  = (uid) => (s) =>
  Object.values(s.questions.byId)
    .filter((q) => !q.optionOne.votes.includes(uid) && !q.optionTwo.votes.includes(uid))
    .sort((a, b) => b.timestamp - a.timestamp);
