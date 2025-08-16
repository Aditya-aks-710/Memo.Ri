import  { useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import your page/modal components
import { Dashboard } from './pages/dashboard';
import { SigninBox } from './pages/signin'; // Assuming these are components
import { SignUpBox } from './pages/signup';   // Assuming these are components
import LandingPage from './pages/landing';

/**
 * A component to protect routes that require a user to be logged in.
 * If a token exists, it shows the protected component (e.g., Dashboard).
 * Otherwise, it redirects the user to the sign-in page.
 */
function PrivateRoute({ children }: { children: ReactNode}) {
  const token = localStorage.getItem("token"); 
  return token ? children : <Navigate to="/signin" />;
}

/**
 * A wrapper component for the main router logic to use hooks.
 */
function AppRoutes() {
  // The top-level state for the authentication token
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const navigate = useNavigate();

  // Function to handle closing the sign-in/sign-up modals
  const handleClose = () => {
    navigate('/dashboard'); // Navigate to the dashboard when a modal is closed
  };
  

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/signin" element={<SigninBox setToken={setToken} onClose={handleClose} />} />
      <Route path="/signup" element={<SignUpBox onClose={handleClose} />} />

      {/* The Dashboard is a protected route */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard /> 
          </PrivateRoute>
        } 
      />
      
      {/* The default route redirects to the dashboard */}
      <Route 
        path="/" 
        element={<Navigate to="/landing" />} 
      />
    </Routes>
  );
}

/**
 * This is the main router for your application.
 * It sets up the BrowserRouter which provides routing context.
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}