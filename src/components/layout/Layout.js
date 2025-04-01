import React, { useContext } from "react";
import { useRouter } from "next/router";
import Navigation from "./Navigation";
import { AuthContext } from "../../contexts/AuthContext";

const Layout = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const router = useRouter();

  // List of public routes that don't need authentication
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  // If we're still loading, show a basic loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Auto-login for development
  if (!currentUser && !isPublicRoute) {
    // Create a temporary session synchronously to avoid re-render loop
    if (typeof window !== "undefined" && !localStorage.getItem("currentUser")) {
      const tempUser = {
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
      };
      localStorage.setItem("currentUser", JSON.stringify(tempUser));
      // Use window.location for hard refresh
      window.location.href = router.pathname;

      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Setting up demo account...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Don't show navigation on public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main
        className="flex-grow-1 pt-5 mt-3"
        style={{ backgroundColor: "#f6f8fa" }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
