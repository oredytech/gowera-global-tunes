
import { useState, useEffect } from "react";
import { RadioTower, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/services/firebaseService";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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

  useEffect(() => {
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

    fetchPendingRadios();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return "Date inconnue";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="h-8 w-8 text-primary" />
        <h1 className="font-bold text-2xl">Radios en attente de validation</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-lg border p-6 mb-6">
        <p className="text-muted-foreground">
          Ces radios ont été suggérées par les utilisateurs et sont en attente de validation par l'administrateur.
          Une fois validées, elles apparaîtront dans la liste principale des radios sur GOWERA.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pendingRadios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <RadioTower className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Aucune radio en attente de validation pour le moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingRadios.map((radio) => (
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
                  <p className="text-xs text-muted-foreground">
                    Suggérée le {formatDate(radio.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRadiosPage;
