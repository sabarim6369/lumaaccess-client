
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import DeviceDetail from '@/pages/DeviceDetail';
import DeviceAccess from '@/pages/DeviceAccess';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              // <ProtectedRoute>
                <Dashboard />
              // </ProtectedRoute>
            } />
            <Route path="/detail" element={
              <ProtectedRoute>
                <DeviceDetail />
              </ProtectedRoute>
            } />
            <Route path="/access" element={
              <ProtectedRoute>
                <DeviceAccess />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              // <ProtectedRoute>
                <Settings />
              // </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
