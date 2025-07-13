import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import DeviceDetail from '@/pages/DeviceDetail';
import DeviceAccess from '@/pages/DeviceAccess';
import Settingss from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Apiurl from './api';

interface JWTPayload {
  exp: number;
  userId: string;
  email: string;
}

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); 
 
  useEffect(() => {
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/signup') {
    setLoading(false);
    return;
  }

  axios.get(`${Apiurl}/api/auth/me`, { withCredentials: true })
    .then((res) => {
      setIsAuthenticated(true);
    })
    .catch(() => {
      setIsAuthenticated(false);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);


  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Checking authentication...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App app">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/detail" element={isAuthenticated ? <DeviceDetail /> : <Navigate to="/login" />} />
            <Route path="/access" element={isAuthenticated ? <DeviceAccess /> : <Navigate to="/login" />} />
            <Route path="/settings" element={<Settingss />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
