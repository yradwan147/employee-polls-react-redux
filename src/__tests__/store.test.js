import { configureStore } from "@reduxjs/toolkit";

import auth, { login, logout }       from "../store/authSlice";
import users, { userAnswered, userAddedQuestion, selectLeaderboard } from "../store/usersSlice";
import questions, { addQuestion, answerQuestion } from "../store/questionsSlice";

const seedUsers = {
  sarahedo: { id: "sarahedo", name: "Sarah Edo", avatarURL: null, answers: { a: "optionOne" }, questions: ["q1"] },
};
const seedQuestions = {
  q1: { id: "q1", author: "sarahedo", timestamp: 1, optionOne: { text: "a", votes: [] }, optionTwo: { text: "b", votes: [] } },
};

function newStore(overrides = {}) {
  return configureStore({
    reducer: { auth, users, questions },
    preloadedState: {
      auth: { authedUser: null },
      users:     { byId: seedUsers,     status: "ready", error: null },
      questions: { byId: seedQuestions, status: "ready", error: null },
      ...overrides,
    },
  });
}

describe("authSlice", () => {
  test("login + logout flow", () => {
    const s = newStore();
    s.dispatch(login("sarahedo"));
    expect(s.getState().auth.authedUser).toBe("sarahedo");
    s.dispatch(logout());
    expect(s.getState().auth.authedUser).toBe(null);
  });
});

describe("usersSlice", () => {
  test("userAnswered records the answer on the user", () => {
    const s = newStore();
    s.dispatch(userAnswered({ authedUser: "sarahedo", qid: "q9", answer: "optionTwo" }));
    expect(s.getState().users.byId.sarahedo.answers.q9).toBe("optionTwo");
  });

  test("userAddedQuestion appends to the user's questions list", () => {
    const s = newStore();
    s.dispatch(userAddedQuestion({ author: "sarahedo", qid: "q42" }));
    expect(s.getState().users.byId.sarahedo.questions).toContain("q42");
  });

  test("selectLeaderboard sums asked + answered and orders desc", () => {
    const overrides = {
      users: {
        byId: {
          a: { id: "a", name: "A", avatarURL: null, answers: { x: "optionOne" }, questions: ["1", "2"] },         // 3
          b: { id: "b", name: "B", avatarURL: null, answers: { x: "optionOne", y: "optionOne" }, questions: ["1"] }, // 3 — tie
          c: { id: "c", name: "C", avatarURL: null, answers: {},                                       questions: [] },   // 0
        },
        status: "ready", error: null,
      },
    };
    const s = newStore(overrides);
    const ranked = selectLeaderboard(s.getState());
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
    expect(ranked[ranked.length - 1].id).toBe("c");
  });
});

describe("questionsSlice (thunks)", () => {
  test("addQuestion thunk inserts a new question and links it to the author", async () => {
    const s = newStore({ auth: { authedUser: "sarahedo" } });
    await s.dispatch(addQuestion({
      optionOneText: "x", optionTwoText: "y", author: "sarahedo",
    }));
    const all = Object.values(s.getState().questions.byId);
    const added = all.find((q) => q.optionOne.text === "x" && q.optionTwo.text === "y");
    expect(added).toBeDefined();
    expect(s.getState().users.byId.sarahedo.questions).toContain(added.id);
  }, 10_000);

  test("answerQuestion thunk records the user's vote on the question and the answer on the user", async () => {
    // Use a question that exists in the actual _DATA.js module so the
    // _saveQuestionAnswer call resolves; seed the redux store with the
    // same shape so the reducer can update it.
    const realQid = "8xf0y6ziyjabvozdd253nd";
    const overrides = {
      auth: { authedUser: "sarahedo" },
      questions: {
        byId: {
          [realQid]: {
            id: realQid, author: "sarahedo", timestamp: 1,
            optionOne: { text: "a", votes: [] },
            optionTwo: { text: "b", votes: [] },
          },
        },
        status: "ready", error: null,
      },
    };
    const s = newStore(overrides);
    await s.dispatch(answerQuestion({ authedUser: "sarahedo", qid: realQid, answer: "optionOne" }));
    const q = s.getState().questions.byId[realQid];
    expect(q.optionOne.votes).toContain("sarahedo");
    expect(s.getState().users.byId.sarahedo.answers[realQid]).toBe("optionOne");
  }, 10_000);
});
