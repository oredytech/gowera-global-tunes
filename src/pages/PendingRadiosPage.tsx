import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPendingRadioSuggestions, approveRadioSuggestion } from "@/services/supabase";
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
  createdAt: any;
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
      
      const radios = await getPendingRadioSuggestions();
      
      // Map Supabase fields to component fields
      const mappedRadios: PendingRadio[] = radios.map(radio => ({
        id: radio.id || '',
        radioName: radio.name,
        description: radio.description || '',
        streamUrl: radio.stream_url,
        websiteUrl: radio.website || undefined,
        logoUrl: radio.logo_url || undefined,
        contactEmail: radio.contact_email || '',
        contactPhone: radio.contact_name || '',
        createdAt: radio.created_at
      }));
      
      setPendingRadios(mappedRadios);
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
