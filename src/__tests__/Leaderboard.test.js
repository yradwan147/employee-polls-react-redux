import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import auth from "../store/authSlice";
import users from "../store/usersSlice";
import questions from "../store/questionsSlice";

import Leaderboard from "../components/Leaderboard";

const seed = {
  auth: { authedUser: "sarahedo" },
  users: {
    status: "ready", error: null,
    byId: {
      sarahedo: {
        id: "sarahedo", name: "Sarah Edo", avatarURL: null,
        answers: { a: "optionOne", b: "optionOne" },
        questions: ["q1", "q2", "q3"],   // 5 total
      },
      tylermcginnis: {
        id: "tylermcginnis", name: "Tyler McGinnis", avatarURL: null,
        answers: { a: "optionOne" },
        questions: ["q4"],                // 2 total
      },
    },
  },
  questions: { byId: {}, status: "ready", error: null },
};

function setup() {
  const store = configureStore({
    reducer: { auth, users, questions },
    preloadedState: seed,
  });
  return render(
    <Provider store={store}>
      <MemoryRouter><Leaderboard /></MemoryRouter>
    </Provider>
  );
}

describe("<Leaderboard />", () => {
  test("orders rows descending by total (asked + answered)", () => {
    const { container } = setup();
    const rows = container.querySelectorAll("tbody tr");
    expect(rows[0]).toHaveAttribute("data-testid", "leader-sarahedo");      // 5
    expect(rows[1]).toHaveAttribute("data-testid", "leader-tylermcginnis"); // 2
  });

  test("matches the snapshot", () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
