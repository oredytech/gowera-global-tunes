
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SuggestRadioFormValues } from "./RadioFormSchema";

interface SponsorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submittedValues: SuggestRadioFormValues | null;
  onSponsorRadio: () => void;
  onDeclineSponsor: () => void;
}

export function SponsorDialog({
  open,
  onOpenChange,
  submittedValues,
  onSponsorRadio,
  onDeclineSponsor
}: SponsorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Boostez votre visibilité sur GOWERA
          </DialogTitle>
          <DialogDescription>
            Félicitations pour avoir suggéré votre radio ! Souhaitez-vous sponsoriser votre station pour une visibilité accrue auprès de notre audience ?
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-muted/30 rounded-md border mb-2">
          <h4 className="font-medium mb-2">Avantages du sponsoring :</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span> Placement prioritaire dans la liste des radios
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span> Badge "Radio Sponsorisée" distinctif
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span> Promotion sur nos réseaux sociaux et newsletters
            </li>
          </ul>
        </div>
        <DialogFooter className="flex sm:flex-row gap-2">
          <Button variant="outline" onClick={onDeclineSponsor} className="flex-1">
            Pas maintenant
          </Button>
          <Button onClick={onSponsorRadio} className="flex-1 bg-gradient-to-r from-primary to-primary/80">
            Sponsoriser ma radio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
