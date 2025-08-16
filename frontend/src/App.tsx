import { useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Dashboard } from './pages/dashboard';
import { LandingPage } from './pages/landing';

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token"); 
  return token ? children : <Navigate to="/" />;
}

function AppRoutes() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isSigninOpen, setSigninOpen] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            setToken={setToken}
            isOpen={isSigninOpen}
            setOpen={setSigninOpen}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard setToken={setToken} setOpen={setSigninOpen}/> 
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
