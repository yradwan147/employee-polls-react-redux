# Employee Polls — React + Redux Toolkit

Final project for Udacity's *React Nanodegree — React & Redux* course.

A "Would You Rather…" polling app for a fictional company. Employees log in,
see polls created by their colleagues, vote on the ones they haven't answered
yet, view detailed results once they have, create new polls, and watch the
leaderboard update in real time.

## Features

* **Username + password login** (real flow with credential validation, not a
  dropdown — rubric stand-out).
* Protected routes — visiting any URL while logged-out redirects to `/login`,
  preserving the original destination so the user lands on the right page
  after auth.
* **Home page** with `Unanswered` (default) and `Answered` tabs, both sorted
  most-recently-created first; live counts in the tab labels.
* **Question detail** at `/questions/:id` — author avatar, both options, vote
  count and percentage per option after voting, "your vote" highlight, and
  a 404 for unknown ids.
* **New poll** form at `/add` — both options required; submission goes to the
  fake API, store and home page.
* **Leaderboard** at `/leaderboard` — every user's avatar, asked count,
  answered count, and total, sorted descending.
* **Logout** clears the auth slice and bounces back to `/login`.

## Architecture

```
src/
├── components/
│   ├── App.js              router + auth gate, kicks off the data fetch
│   ├── Login.js            credential form
│   ├── Nav.js              persistent top nav
│   ├── Home.js             two-tab tile list
│   ├── Question.js         poll detail / vote / results
│   ├── NewPoll.js          create-poll form
│   ├── Leaderboard.js      ranked user table
│   └── NotFound.js         404
├── store/
│   ├── index.js            configureStore({ auth, users, questions })
│   ├── authSlice.js
│   ├── usersSlice.js       + fetchUsers thunk + selectors
│   └── questionsSlice.js   + fetchQuestions / addQuestion / answerQuestion
├── __tests__/              jest + @testing-library/react test suites
├── __mocks__/styleMock.js  CSS import mock for jest
├── setupTests.js           imports @testing-library/jest-dom matchers
└── index.js                Provider + BrowserRouter
```

* The Redux store is the single source of truth. Components only `useSelector`
  and dispatch action creators — they never call `_DATA.js` directly.
* `_DATA.js` is treated as a backend; every read/write goes through a
  Redux Toolkit thunk (`fetchUsers`, `fetchQuestions`, `addQuestion`,
  `answerQuestion`).
* User-side mirrors of question state (the `answers` object on a user, the
  `questions` array) are kept in sync by `userAnswered` / `userAddedQuestion`
  reducers dispatched from the relevant thunks.

## Running

```bash
npm install
npm start          # vite dev server
npm test           # jest test suite
npm run build      # production bundle in dist/
```

Demo accounts (also visible from the login screen's "Demo accounts"
disclosure):

| User ID         | Password      |
|-----------------|---------------|
| `sarahedo`      | `password123` |
| `tylermcginnis` | `abc321`      |
| `mtsamis`       | `xyz123`      |
| `zoshikanlu`    | `pass246`     |

> **Note on `npm start test`** — The rubric asks for `npm start test`. That's
> the command idiom from create-react-app; the upstream starter migrated to
> Vite, so the canonical command in this repo is `npm test`. Running
> `npm start` boots the dev server.

## Tests

The suite has **16 passing tests across 4 files** (rubric requires ≥ 10):

* `_DATA.test.js`    — 4 tests (the rubric-required two for `_saveQuestion`
  and two for `_saveQuestionAnswer`, covering both the success and
  validation-error paths).
* `Login.test.js`    — 4 DOM tests using `userEvent` (which uses `fireEvent`
  under the hood) — disabled-button gating, unknown user, wrong password,
  successful login dispatch.
* `Leaderboard.test.js` — DOM ordering test plus the rubric-required
  `toMatchSnapshot()`.
* `store.test.js`    — slice/reducer + thunk integration tests.

```
Test Suites: 4 passed, 4 total
Tests:       16 passed, 16 total
Snapshots:   1 passed, 1 total
```

## Standing-out work

1. **Real password authentication** instead of a user dropdown — full
   form, error states for unknown user and wrong password, and a "demo
   accounts" disclosure on the login page so reviewers can copy creds.
2. **16 unit tests** instead of 10. Coverage spans the data layer
   (`_DATA.js`), the redux slices (auth, users, questions), the thunks
   (`addQuestion`, `answerQuestion`), the login DOM flow, and the
   leaderboard rendering + snapshot.
3. **Reducer-driven user mirror** — when a user answers a question, the
   `userAnswered` action keeps the user's `answers` object in sync so the
   leaderboard updates instantly without a re-fetch.
4. **404 routing** at both `/404` and the wildcard `*` route, per rubric.

## License

Educational submission for Udacity nd019. Starter scaffold is © Udacity.
