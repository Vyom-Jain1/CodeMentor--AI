import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Theme Provider
import ThemeProvider from "./theme/ThemeProvider";

// Custom components
import LoadingSpinner from "./components/LoadingSpinner";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ProblemList = lazy(() => import("./pages/ProblemList"));
const ProblemDetail = lazy(() => import("./pages/ProblemDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const LearningPath = lazy(() => import("./pages/LearningPath"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CodeEditor = lazy(() => import("./components/CodeEditor"));
const DiscussionForum = lazy(() => import("./components/DiscussionForum"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));
const SystemDesign = lazy(() => import("./pages/SystemDesign"));
const DSA = lazy(() => import("./pages/DSA"));
const MockInterview = lazy(() => import("./pages/MockInterview"));
const CompanyPrep = lazy(() => import("./pages/CompanyPrep"));
const BehavioralPrep = lazy(() => import("./pages/BehavioralPrep"));

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Define routes array before using it
const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "problems",
        element: (
          <PrivateRoute>
            <ProblemList />
          </PrivateRoute>
        ),
      },
      {
        path: "problems/:id",
        element: (
          <PrivateRoute>
            <ProblemDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "learning-path",
        element: (
          <PrivateRoute>
            <LearningPath />
          </PrivateRoute>
        ),
      },
      {
        path: "interview-prep",
        element: (
          <PrivateRoute>
            <InterviewPrep />
          </PrivateRoute>
        ),
      },
      {
        path: "system-design",
        element: (
          <PrivateRoute>
            <SystemDesign />
          </PrivateRoute>
        ),
      },
      {
        path: "dsa",
        element: (
          <PrivateRoute>
            <DSA />
          </PrivateRoute>
        ),
      },
      {
        path: "mock-interview",
        element: (
          <PrivateRoute>
            <MockInterview />
          </PrivateRoute>
        ),
      },
      {
        path: "company-prep",
        element: (
          <PrivateRoute>
            <CompanyPrep />
          </PrivateRoute>
        ),
      },
      {
        path: "behavioral-prep",
        element: (
          <PrivateRoute>
            <BehavioralPrep />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
  },
});

const AppContent = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <AppContent />
            </Suspense>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
