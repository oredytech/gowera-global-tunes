
import { Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function IntroductionCard() {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 text-muted-foreground mb-4">
          <Radio className="h-5 w-5" />
          <p>
            Vous souhaitez ajouter votre radio sur GOWERA ? Remplissez ce formulaire et nous vous contacterons rapidement.
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Toutes les informations soumises seront enregistrées dans notre base de données et un email sera envoyé à notre équipe à <span className="font-medium">infosgowera@gmail.com</span>
        </p>
      </CardContent>
    </Card>
  );
}
