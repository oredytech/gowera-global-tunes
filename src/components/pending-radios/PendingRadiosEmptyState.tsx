
import { RadioTower } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const PendingRadiosEmptyState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <RadioTower className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center mb-6">
          Aucune radio en attente de validation pour le moment.
        </p>
        <Button asChild variant="outline">
          <Link to="/suggest-radio">Suggérer une radio</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
