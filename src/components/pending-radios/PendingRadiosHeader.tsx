
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PendingRadiosHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div className="flex items-center gap-3">
        <Clock className="h-8 w-8 text-primary" />
        <h1 className="font-bold text-2xl">Radios en attente de validation</h1>
      </div>
      <Button asChild variant="default">
        <Link to="/suggest-radio">Suggérer une nouvelle radio</Link>
      </Button>
    </div>
  );
};
