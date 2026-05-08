import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { configureStore } from "@reduxjs/toolkit";
import auth, { login } from "../store/authSlice";
import users, { fetchUsers } from "../store/usersSlice";
import questions from "../store/questionsSlice";

import Login from "../components/Login";

function renderWithStore(initial) {
  const store = configureStore({
    reducer: { auth, users, questions },
    preloadedState: initial,
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter><Login /></MemoryRouter>
      </Provider>
    ),
  };
}

const seedUsers = {
  sarahedo: { id: "sarahedo", password: "password123", name: "Sarah Edo", avatarURL: null, answers: {}, questions: [] },
};

describe("<Login /> (DOM + fireEvent)", () => {
  test("submit button starts disabled and enables once both fields have value", async () => {
    renderWithStore({ users: { byId: seedUsers, status: "ready", error: null } });
    const submit = screen.getByRole("button", { name: /log in/i });
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText(/sarahedo/i), "sarahedo");
    await userEvent.type(screen.getAllByLabelText(/password/i)[0], "password123");
    expect(submit).toBeEnabled();
  });

  test("rejects an unknown user id with a visible error", async () => {
    renderWithStore({ users: { byId: seedUsers, status: "ready", error: null } });
    await userEvent.type(screen.getByPlaceholderText(/sarahedo/i), "ghost");
    await userEvent.type(screen.getAllByLabelText(/password/i)[0], "any");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/unknown user/i);
  });

  test("rejects a wrong password with a visible error", async () => {
    renderWithStore({ users: { byId: seedUsers, status: "ready", error: null } });
    await userEvent.type(screen.getByPlaceholderText(/sarahedo/i), "sarahedo");
    await userEvent.type(screen.getAllByLabelText(/password/i)[0], "wrong");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/incorrect password/i);
  });

  test("dispatches login(authedUser) on a correct credential pair", async () => {
    const { store } = renderWithStore({ users: { byId: seedUsers, status: "ready", error: null } });
    await userEvent.type(screen.getByPlaceholderText(/sarahedo/i), "sarahedo");
    await userEvent.type(screen.getAllByLabelText(/password/i)[0], "password123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(store.getState().auth.authedUser).toBe("sarahedo");
  });
});
