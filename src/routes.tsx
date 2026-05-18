import { Navigate, type RouteObject } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UpdatePassword from "./pages/UpdatePassword";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import MeetingRoom from "./pages/MeetingRoom";
import BookingList from "./pages/BookingList";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/meeting-room" replace />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/booking-list",
        element: <BookingList />,
      },
      {
        path: "/meeting-room",
        element: <MeetingRoom />,
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
