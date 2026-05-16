import type { RouteObject } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UpdatePassword from "./pages/UpdatePassword";
import Home from "./pages/Home";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
];

export default routes;
