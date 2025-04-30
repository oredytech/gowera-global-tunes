
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: "Vous devez vous connecter pour accéder à cette page" 
          } 
        });
      } else if (!isAdmin) {
        navigate('/home', { 
          state: { 
            message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page" 
          } 
        });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location.pathname, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return isAuthenticated && isAdmin ? <>{children}</> : null;
};
