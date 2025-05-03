
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db, approveRadioSuggestion } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { PendingRadiosList } from "@/components/pending-radios/PendingRadiosList";
import { PendingRadiosHeader } from "@/components/pending-radios/PendingRadiosHeader";
import { PendingRadiosInfo } from "@/components/pending-radios/PendingRadiosInfo";

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

const PendingRadiosPage = () => {
  const [pendingRadios, setPendingRadios] = useState<PendingRadio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const { toast } = useToast();

  const fetchPendingRadios = async () => {
    try {
      setLoading(true);
      
      // Créer une requête pour obtenir toutes les radios où sponsored est false
      const radioQuery = query(
        collection(db, "radioSuggestions"),
        where("sponsored", "==", false)
      );
      
      const querySnapshot = await getDocs(radioQuery);
      
      const radios: PendingRadio[] = [];
      querySnapshot.forEach((doc) => {
        radios.push({
          id: doc.id,
          ...doc.data()
        } as PendingRadio);
      });
      
      setPendingRadios(radios);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des radios en attente:", err);
      setError("Impossible de charger les radios en attente. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRadios();
  }, []);

  const handleApprove = async (radio: PendingRadio) => {
    setApproving(true);
    
    try {
      await approveRadioSuggestion(radio.id);
      
      // Rafraîchir la liste
      fetchPendingRadios();
      
      toast({
        title: "Radio approuvée",
        description: `La radio "${radio.radioName}" a été approuvée avec succès.`,
      });
    } catch (err) {
      console.error("Erreur lors de l'approbation de la radio:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'approuver la radio. Veuillez réessayer plus tard.",
      });
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4">
      <PendingRadiosHeader />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PendingRadiosInfo />

      <PendingRadiosList 
        pendingRadios={pendingRadios}
        loading={loading}
        approving={approving}
        onApproveRadio={handleApprove}
      />
    </div>
  );
};

export default PendingRadiosPage;
