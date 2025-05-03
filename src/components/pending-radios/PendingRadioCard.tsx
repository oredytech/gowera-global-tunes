
import { Clock, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface PendingRadio {
  id: string;
  radioName: string;
  description: string;
  streamUrl: string;
  websiteUrl?: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: any; // Firestore timestamp
}

interface PendingRadioCardProps {
  radio: PendingRadio;
  onApprove: (radio: PendingRadio) => void;
  approving: boolean;
}

export const PendingRadioCard = ({ radio, onApprove, approving }: PendingRadioCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return "Date inconnue";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleApprove = () => {
    onApprove(radio);
    setIsDialogOpen(false);
  };

  return (
    <Card key={radio.id}>
      <CardHeader>
        <CardTitle className="text-xl">{radio.radioName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{radio.description}</p>
          <div className="pt-2">
            <div className="flex items-center text-sm">
              <span className="font-medium mr-2">URL de streaming:</span>
              <span className="text-muted-foreground truncate">{radio.streamUrl}</span>
            </div>
            {radio.websiteUrl && (
              <div className="flex items-center text-sm mt-1">
                <span className="font-medium mr-2">Site web:</span>
                <a href={radio.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {radio.websiteUrl}
                </a>
              </div>
            )}
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Suggérée le {formatDate(radio.createdAt)}
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600"
                >
                  <Check className="mr-1 h-4 w-4" /> Valider
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la validation</DialogTitle>
                  <DialogDescription>
                    Voulez-vous vraiment valider la radio "{radio.radioName}" ? Une fois validée, elle sera visible dans la liste principale des radios.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleApprove} 
                    disabled={approving}
                  >
                    {approving ? 'Validation en cours...' : 'Confirmer la validation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
