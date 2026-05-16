import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/signup">Signup</Link>
      </div>
      <div>
        <Outlet /> {/* This is where the child routes will be rendered */}
      </div>
    </div>
  );
}

export default Layout;
