import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { setTokenHandlers } from './services/api';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component to initialize token handlers
function TokenHandlerInit({ children }) {
  const { getAccessToken, setAccessToken } = useAuth();
  
  useEffect(() => {
    setTokenHandlers(getAccessToken, setAccessToken);
  }, [getAccessToken, setAccessToken]);

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TokenHandlerInit>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
          </Routes>
        </Router>
        </TokenHandlerInit>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
