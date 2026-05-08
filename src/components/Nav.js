import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { selectAuthedUser } from "../store/usersSlice";

export default function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const me       = useSelector(selectAuthedUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const link = ({ isActive }) => "navlink" + (isActive ? " active" : "");

  return (
    <nav className="nav" aria-label="primary">
      <div className="nav-links">
        <NavLink to="/"             end className={link}>Home</NavLink>
        <NavLink to="/leaderboard"      className={link}>Leaderboard</NavLink>
        <NavLink to="/add"              className={link}>New poll</NavLink>
      </div>
      <div className="nav-user">
        <span data-testid="nav-user">Hi, <strong>{me?.name}</strong></span>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
