import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/authUtils';

const ProtectedRoute = ({ children, requireSeller, requireCustomer }) => {
  const user = getUserFromToken();

  if (!user) return <Navigate to="/login" replace />;

  if (requireSeller && !user.isSeller) return <Navigate to="/unauthorized" replace />;
  if (requireCustomer && !user.isCustomer) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
