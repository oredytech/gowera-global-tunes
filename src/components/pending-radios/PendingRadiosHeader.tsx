
import { Clock } from "lucide-react";

export const PendingRadiosHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Clock className="h-8 w-8 text-primary" />
      <h1 className="font-bold text-2xl">Radios en attente de validation</h1>
    </div>
  );
};
