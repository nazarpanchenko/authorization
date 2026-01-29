import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersList from "./components/UsersList";
import SignupForm from "./components/SignupForm";
import SigninForm from "./components/SigninForm";
import AuthProvider from "./context/auth/AuthProvider";
import AuthConfirmationPage from "./components/AuthConfirmationPage";
import { initializeInterceptors } from "./http";

let didInit = false;

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    Component: () => (
      <AuthProvider>
        <ProtectedRoute>
          <UsersList />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  { path: "/sign-up", Component: SignupForm },
  { path: "/sign-in", Component: SigninForm },
  { path: "/sign-up-confirm", Component: AuthConfirmationPage },
]);

function App() {
  // prevent running twice in development mode
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      initializeInterceptors();
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
