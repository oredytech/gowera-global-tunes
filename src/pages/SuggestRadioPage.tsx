
import { useState } from "react";
import { RadioTower, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { IntroductionCard } from "@/components/suggest-radio/IntroductionCard";
import { SuggestRadioForm } from "@/components/suggest-radio/SuggestRadioForm";
import { SuggestRadioFormValues } from "@/components/suggest-radio/RadioFormSchema";
import { SponsorDialog } from "@/components/suggest-radio/SponsorDialog";

const SuggestRadioPage = () => {
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<SuggestRadioFormValues | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleSubmitSuccess = (values: SuggestRadioFormValues, docId: string) => {
    setSubmissionId(docId);
    setSubmittedValues(values);
    setSponsorDialogOpen(true);
  };
  
  const handleSubmitError = (error: Error) => {
    // Gérer l'erreur de permissions Firebase
    if (error.message && error.message.includes("Missing or insufficient permissions")) {
      setErrorMessage("Nous rencontrons actuellement un problème d'accès à la base de données. Veuillez réessayer plus tard ou contacter l'administrateur.");
    } else {
      setErrorMessage(error.message || "Une erreur est survenue lors de l'envoi du formulaire.");
    }
  };

  const handleSponsorRadio = () => {
    // Ici, vous implémenteriez la logique pour rediriger vers une page de paiement
    console.log("User chose to sponsor radio:", submittedValues?.radioName);
    
    // Fermer la boîte de dialogue
    setSponsorDialogOpen(false);
    
    toast({
      title: "Redirection vers le paiement",
      description: "Vous allez être redirigé vers notre page de paiement pour sponsoriser votre radio."
    });
    
    // Simuler une redirection (à remplacer par votre logique de redirection réelle)
    // window.location.href = "/payment";
  };

  const handleDeclineSponsor = () => {
    // Fermer la boîte de dialogue
    setSponsorDialogOpen(false);
    
    toast({
      title: "Suggestion envoyée",
      description: "Nous examinerons votre suggestion dans les plus brefs délais."
    });
  };

  return (
    <div className="container max-w-2xl mx-auto px-0">
      <div className="flex items-center gap-3 mb-8">
        <RadioTower className="h-8 w-8 text-primary" />
        <h1 className="font-bold text-2xl">Suggérer une Radio</h1>
      </div>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <IntroductionCard />
      
      <SuggestRadioForm 
        onSubmitSuccess={handleSubmitSuccess} 
        onSubmitError={handleSubmitError}
      />
      
      <SponsorDialog 
        open={sponsorDialogOpen} 
        onOpenChange={setSponsorDialogOpen}
        submittedValues={submittedValues}
        onSponsorRadio={handleSponsorRadio}
        onDeclineSponsor={handleDeclineSponsor}
      />
    </div>
  );
};

export default SuggestRadioPage;
