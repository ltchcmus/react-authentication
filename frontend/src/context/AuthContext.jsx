import { createContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { logoutUser } from '../services/api';

export const AuthContext = createContext(null);

// Helper function to get initial auth state
const getInitialAuthState = () => {
  const storedUser = localStorage.getItem('user');
  
  if (storedUser) {
    try {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      };
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
    }
  }
  
  return {
    user: null,
    isAuthenticated: false,
  };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialAuthState();
  const [user, setUser] = useState(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  
  // Store accessToken in a ref - persists across rerenders but NOT page refresh
  const accessTokenRef = useRef(null);

  const setAccessToken = (token) => {
    accessTokenRef.current = token;
  };

  const getAccessToken = () => {
    return accessTokenRef.current;
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Store access token in ref if provided
    if (userData.accessToken) {
      setAccessToken(userData.accessToken);
    }
    
    // Notify other tabs
    localStorage.setItem('authEvent', JSON.stringify({ type: 'login', timestamp: Date.now() }));
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setAccessToken(null);
    localStorage.removeItem('user');
    // Notify other tabs
    localStorage.setItem('authEvent', JSON.stringify({ type: 'logout', timestamp: Date.now() }));
  };

  // Multi-tab sync: listen to storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authEvent' && e.newValue) {
        try {
          const event = JSON.parse(e.newValue);
          if (event.type === 'logout') {
            // Sync logout across tabs
            setUser(null);
            setIsAuthenticated(false);
            setAccessToken(null);
            localStorage.removeItem('user');
          } else if (event.type === 'login') {
            // Sync login across tabs
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setIsAuthenticated(true);
              if (userData.accessToken) {
                setAccessToken(userData.accessToken);
              }
            }
          }
        } catch (err) {
          console.error('Error parsing authEvent:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom logout event (from api.js)
    const handleLogoutEvent = () => {
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
      localStorage.removeItem('user');
    };
    window.addEventListener('logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleLogoutEvent);
    };
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated,
    login,
    logout,
    getAccessToken,
    setAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
