
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Button asChild>
        <Link to="/">
          <Home className="mr-2" size={18} />
          Retour à l'accueil
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
