
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Check, X } from "lucide-react";
import { collection, getDocs, doc, updateDoc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from '../../services/firebase/config';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RadioStation {
  id: string;
  radioName: string;
  streamUrl: string;
  country: string;
  language: string;
  sponsored: boolean;
  createdAt: any; // Firestore timestamp
}

const AdminRadiosPage = () => {
  const [radioStations, setRadioStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRadioStations();
  }, []);

  const fetchRadioStations = async () => {
    try {
      setLoading(true);
      const radiosQuery = query(
        collection(db, "radioSuggestions"),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(radiosQuery);
      
      const stations: RadioStation[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        stations.push({
          id: doc.id,
          radioName: data.radioName,
          streamUrl: data.streamUrl,
          country: data.country || "Non spécifié",
          language: data.language || "Non spécifié",
          sponsored: data.sponsored || false,
          createdAt: data.createdAt
        });
      });
      
      setRadioStations(stations);
    } catch (error) {
      console.error("Error fetching radio stations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les stations de radio",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (station: RadioStation) => {
    try {
      setIsApproving(true);
      const stationRef = doc(db, "radioSuggestions", station.id);
      
      await updateDoc(stationRef, {
        sponsored: true
      });
      
      toast({
        title: "Radio approuvée",
        description: `La radio "${station.radioName}" a été approuvée avec succès.`
      });
      
      // Update local state
      setRadioStations(prevStations =>
        prevStations.map(s => 
          s.id === station.id 
            ? { ...s, sponsored: true } 
            : s
        )
      );
      
      setSelectedStation(null);
    } catch (error) {
      console.error("Error approving radio station:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'approuver la station de radio"
      });
    } finally {
      setIsApproving(false);
    }
  };

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Radio className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Gestion des radios</h1>
        </div>
        <Button onClick={fetchRadioStations} disabled={loading}>
          Actualiser
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des stations de radio...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>Liste des stations de radio</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la radio</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Langue</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radioStations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.radioName}</TableCell>
                  <TableCell>{station.country}</TableCell>
                  <TableCell>{station.language}</TableCell>
                  <TableCell>{formatDate(station.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={station.sponsored ? "default" : "outline"}>
                      {station.sponsored ? "Approuvée" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {!station.sponsored && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mr-2"
                            onClick={() => setSelectedStation(station)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Approuver
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmer l'approbation</DialogTitle>
                            <DialogDescription>
                              Voulez-vous approuver la radio "{selectedStation?.radioName}" ? 
                              Elle apparaîtra ensuite dans les listes de radios du site.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedStation(null)}
                            >
                              Annuler
                            </Button>
                            <Button 
                              onClick={() => selectedStation && handleApprove(selectedStation)}
                              disabled={isApproving}
                            >
                              {isApproving ? 'Approbation...' : 'Confirmer'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(station.streamUrl, '_blank')}
                    >
                      Écouter
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {radioStations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Aucune station de radio trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminRadiosPage;
