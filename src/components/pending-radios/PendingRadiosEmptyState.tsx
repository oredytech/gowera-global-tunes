
import { RadioTower } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const PendingRadiosEmptyState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <RadioTower className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          Aucune radio en attente de validation pour le moment.
        </p>
      </CardContent>
    </Card>
  );
};
