import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    console.log('User is authenticated, redirecting from', location.pathname, 'to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
