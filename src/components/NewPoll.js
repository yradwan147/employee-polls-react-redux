import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addQuestion } from "../store/questionsSlice";

export default function NewPoll() {
  const authed = useSelector((s) => s.auth.authedUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [optionOneText, setOne] = useState("");
  const [optionTwoText, setTwo] = useState("");
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState(null);

  const valid = optionOneText.trim() && optionTwoText.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true); setError(null);
    try {
      await dispatch(addQuestion({ optionOneText, optionTwoText, author: authed })).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      setError(String(err));
      setBusy(false);
    }
  };

  return (
    <div className="newpoll">
      <h1>Would You Rather</h1>
      <p>Create your own poll. Both options are required.</p>
      <form onSubmit={submit} aria-label="new-poll">
        <label>
          First option
          <input value={optionOneText} onChange={(e) => setOne(e.target.value)} placeholder="have unlimited bacon" />
        </label>
        <p className="or">— or —</p>
        <label>
          Second option
          <input value={optionTwoText} onChange={(e) => setTwo(e.target.value)} placeholder="never eat bacon again" />
        </label>
        {error ? <p className="error" role="alert">{error}</p> : null}
        <button type="submit" disabled={!valid || busy}>{busy ? "Saving…" : "Submit"}</button>
      </form>
    </div>
  );
}
