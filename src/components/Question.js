import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";

import { selectQuestionById } from "../store/questionsSlice";
import { selectUsers } from "../store/usersSlice";
import { answerQuestion } from "../store/questionsSlice";

function pct(part, total) { return total === 0 ? 0 : Math.round(100 * part / total); }

export default function Question() {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const authed   = useSelector((s) => s.auth.authedUser);
  const q        = useSelector(selectQuestionById(id));
  const users    = useSelector(selectUsers);

  const status   = useSelector((s) => s.questions.status);
  if (!q && status === "ready")  return <Navigate to="/404" replace />;
  if (!q)                        return <p>Loading poll…</p>;

  const author = users[q.author];
  const myVote = q.optionOne.votes.includes(authed)
    ? "optionOne"
    : q.optionTwo.votes.includes(authed) ? "optionTwo" : null;

  const total = q.optionOne.votes.length + q.optionTwo.votes.length;

  const Option = ({ which }) => {
    const opt = q[which];
    const selected = myVote === which;
    const handleVote = () => {
      if (myVote || !authed) return;
      dispatch(answerQuestion({ authedUser: authed, qid: id, answer: which }));
    };
    return (
      <div
        className={"option" + (myVote ? " resolved" : "") + (selected ? " selected" : "")}
        onClick={handleVote}
        role={myVote ? "presentation" : "button"}
        tabIndex={myVote ? -1 : 0}
        aria-pressed={selected}
      >
        <p className="option-text">{opt.text}</p>
        {myVote ? (
          <div className="option-results">
            <div className="bar"><div className="fill" style={{ width: pct(opt.votes.length, total) + "%" }} /></div>
            <p className="option-stats">
              {opt.votes.length} of {total} ({pct(opt.votes.length, total)}%)
              {selected ? <strong> ✓ your vote</strong> : null}
            </p>
          </div>
        ) : (
          <p className="option-cta">Tap to vote</p>
        )}
      </div>
    );
  };

  return (
    <div className="question">
      <header>
        <p>Poll by <strong>{author?.name}</strong></p>
        {author?.avatarURL
          ? <img src={author.avatarURL} alt={author.name} className="avatar lg" />
          : <div className="avatar avatar-fallback lg">{(author?.name || "?")[0]}</div>}
        <h1>Would You Rather…</h1>
      </header>
      <div className="options">
        <Option which="optionOne" />
        <p className="or">— or —</p>
        <Option which="optionTwo" />
      </div>
    </div>
  );
}
