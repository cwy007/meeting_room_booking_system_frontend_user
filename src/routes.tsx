import type { RouteObject } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UpdatePassword from "./pages/UpdatePassword";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
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
