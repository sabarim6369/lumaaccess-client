// import { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from '@/contexts/AuthContext';
// import { Toaster } from '@/components/ui/toaster';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import Index from '@/pages/Index';
// import Login from '@/pages/Login';
// import Signup from '@/pages/Signup';
// import Dashboard from '@/pages/Dashboard';
// import DeviceDetail from '@/pages/DeviceDetail';
// import DeviceAccess from '@/pages/DeviceAccess';
// import Settingss from '@/pages/Settings';
// import NotFound from '@/pages/NotFound';
// import Apiurl from './api';
// import useAuthStore from "./Zustandstore/useAuthstore"
// import Terms from './pages/Terms';
// import Privacy from './pages/Privacy';
// interface JWTPayload {
//   exp: number;
//   userId: string;
//   email: string;
// }


// function App() {
//   const { isAuthenticated, setIsAuthenticated } = useAuthStore();
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         console.log("Checking auth...");
//         const res = await axios.get(`${Apiurl}/api/auth/me`, { withCredentials: true });
//         console.log("Authenticated", res.data);
//  setIsAuthenticated(true);   
//    } catch (err) {
//         console.error("Auth check failed", err);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [setIsAuthenticated]);

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen text-xl">Checking authentication...</div>;
//   }

//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App app">
//           <Routes>
//             <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Index />} />
//             <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
//             <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
//             <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
//             <Route path="/detail" element={isAuthenticated ? <DeviceDetail /> : <Navigate to="/login" />} />
//             <Route path="/access" element={isAuthenticated ? <DeviceAccess /> : <Navigate to="/login" />} />
//             <Route path="/settings" element={isAuthenticated ? <Settingss /> : <Navigate to="/login" />} />
// <Route path="/terms" element={<Terms />} />
// <Route path="/privacy" element={<Privacy />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//           <Toaster />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { jwtDecode } from 'jwt-decode';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import DeviceDetail from '@/pages/DeviceDetail';
import DeviceAccess from '@/pages/DeviceAccess';
import Settingss from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Apiurl from './api';
import useAuthStore from "./Zustandstore/useAuthstore";
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

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
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, [setIsAuthenticated]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Checking authentication...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App app">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Index />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/detail" element={isAuthenticated ? <DeviceDetail /> : <Navigate to="/login" />} />
            <Route path="/access" element={isAuthenticated ? <DeviceAccess /> : <Navigate to="/login" />} />
            <Route path="/settings" element={isAuthenticated ? <Settingss /> : <Navigate to="/login" />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
