import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p>That poll doesn't exist (or hasn't loaded yet).</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
