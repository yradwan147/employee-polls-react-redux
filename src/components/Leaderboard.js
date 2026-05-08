import { useSelector } from "react-redux";
import { selectLeaderboard } from "../store/usersSlice";

export default function Leaderboard() {
  const rows = useSelector(selectLeaderboard);
  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr><th>#</th><th>Employee</th><th>Asked</th><th>Answered</th><th>Total</th></tr>
        </thead>
        <tbody>
          {rows.map((u, i) => (
            <tr key={u.id} data-testid={"leader-" + u.id}>
              <td>{i + 1}</td>
              <td className="leader-name">
                {u.avatarURL
                  ? <img src={u.avatarURL} alt={u.name} className="avatar sm" />
                  : <div className="avatar avatar-fallback sm">{u.name[0]}</div>}
                <span>{u.name}</span>
              </td>
              <td>{u.asked}</td>
              <td>{u.answered}</td>
              <td><strong>{u.score}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
