import { Navigate } from "react-router-dom";
import ProblemList from "./pages/ProblemList";
import ProblemDetail from "./pages/ProblemDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const routes = [
  {
    path: "/",
    element: <Navigate to="/problems" replace />,
  },
  {
    path: "/problems",
    element: <ProblemList />,
  },
  {
    path: "/problems/:id",
    element: <ProblemDetail />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];

export default routes;
