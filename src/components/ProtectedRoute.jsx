import { useAuth } from '../useAuth';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/sign-in" />;
  }
  return children;
};
