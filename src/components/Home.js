import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectUsers } from "../store/usersSlice";
import { selectAnsweredFor, selectUnansweredFor } from "../store/questionsSlice";

function Avatar({ user }) {
  if (!user) return <div className="avatar avatar-fallback" />;
  const initials = (user.name || "").split(" ").map((s) => s[0]).slice(0, 2).join("");
  return user.avatarURL
    ? <img src={user.avatarURL} alt={user.name} className="avatar" />
    : <div className="avatar avatar-fallback" aria-label={user.name}>{initials}</div>;
}

function Tile({ q, users }) {
  const author = users[q.author];
  return (
    <li className="tile">
      <Avatar user={author} />
      <div className="tile-body">
        <p className="tile-author">{author?.name} asks…</p>
        <h3>Would you rather…</h3>
        <p className="tile-option">{q.optionOne.text}</p>
        <p className="tile-or">— or —</p>
        <p className="tile-option">{q.optionTwo.text}</p>
        <Link to={`/questions/${q.id}`} className="tile-button">View poll</Link>
      </div>
    </li>
  );
}

export default function Home() {
  const authed   = useSelector((s) => s.auth.authedUser);
  const users    = useSelector(selectUsers);
  const answered   = useSelector(selectAnsweredFor(authed));
  const unanswered = useSelector(selectUnansweredFor(authed));

  // Default to "unanswered" tab per rubric.
  const [tab, setTab] = useState("unanswered");
  const list = tab === "unanswered" ? unanswered : answered;

  return (
    <div className="home">
      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "unanswered"}
          className={tab === "unanswered" ? "active" : ""}
          onClick={() => setTab("unanswered")}
          data-testid="tab-unanswered"
        >Unanswered ({unanswered.length})</button>
        <button
          role="tab"
          aria-selected={tab === "answered"}
          className={tab === "answered" ? "active" : ""}
          onClick={() => setTab("answered")}
          data-testid="tab-answered"
        >Answered ({answered.length})</button>
      </div>

      {list.length === 0 ? (
        <p className="empty">Nothing here yet.</p>
      ) : (
        <ul className="tiles">
          {list.map((q) => <Tile key={q.id} q={q} users={users} />)}
        </ul>
      )}
    </div>
  );
}
