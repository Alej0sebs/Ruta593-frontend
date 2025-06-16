import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  requiredRole?: string[];
  children: JSX.Element;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { authUser } = useAuthContext();
  const [redirect, setRedirect] = useState(false);

  // No autenticado
  if (!authUser) {
    return <Navigate to="/auth/signin" />;
  }

  // Rol no permitido
  if (requiredRole && !requiredRole.includes(authUser.role)) {
    useEffect(() => {
      toast.error('No tienes permisos para acceder a esta página');
      const timer = setTimeout(() => setRedirect(true), 2000);
      return () => clearTimeout(timer);
    }, []);

    return redirect ? <Navigate to="/" /> : null;
  }

  // Autenticado y con permisos
  return <>{children}</>;
};

export default ProtectedRoute;
