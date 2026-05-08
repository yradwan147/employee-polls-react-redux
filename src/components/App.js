import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./Login";
import Nav from "./Nav";
import Home from "./Home";
import Question from "./Question";
import NewPoll from "./NewPoll";
import Leaderboard from "./Leaderboard";
import NotFound from "./NotFound";

import { fetchUsers } from "../store/usersSlice";
import { fetchQuestions } from "../store/questionsSlice";

function RequireAuth({ children }) {
  const authed = useSelector((s) => s.auth.authedUser);
  const location = useLocation();
  if (!authed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const dispatch = useDispatch();
  const authedUser = useSelector((s) => s.auth.authedUser);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchQuestions());
  }, [dispatch]);

  return (
    <div className="app">
      {authedUser ? <Nav /> : null}
      <main className="container">
        <Routes>
          <Route path="/login"            element={<Login />} />
          <Route path="/"                 element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/questions/:id"    element={<RequireAuth><Question /></RequireAuth>} />
          <Route path="/add"              element={<RequireAuth><NewPoll /></RequireAuth>} />
          <Route path="/leaderboard"      element={<RequireAuth><Leaderboard /></RequireAuth>} />
          <Route path="/404"              element={<NotFound />} />
          <Route path="*"                 element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
