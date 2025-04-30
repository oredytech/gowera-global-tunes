
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Megaphone, MonitorPlay } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockAudioAds = [
  { id: 1, name: "Promo été 2023", duration: "30s", impressions: 1240, plays: 856 },
  { id: 2, name: "Nouvel album XYZ", duration: "15s", impressions: 980, plays: 720 },
  { id: 3, name: "Annonce événement", duration: "20s", impressions: 540, plays: 320 },
];

const mockBannerAds = [
  { id: 1, name: "Banner Top", size: "728x90", impressions: 4520, clicks: 78 },
  { id: 2, name: "Banner Sidebar", size: "300x250", impressions: 3650, clicks: 42 },
  { id: 3, name: "Banner Mobile", size: "320x100", impressions: 2840, clicks: 63 },
];

const AdminAdvertisementsPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Gestion des publicités</h1>
        </div>
        <Button>
          Créer une nouvelle campagne
        </Button>
      </div>
      
      <Tabs defaultValue="audio" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="audio">Publicités audio</TabsTrigger>
          <TabsTrigger value="banners">Bannières</TabsTrigger>
        </TabsList>
        
        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle>Publicités Audio</CardTitle>
              <CardDescription>
                Gérez les publicités audio diffusées avant l'écoute des radios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de la publicité</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Lectures</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAudioAds.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.name}</TableCell>
                      <TableCell>{ad.duration}</TableCell>
                      <TableCell>{ad.impressions}</TableCell>
                      <TableCell>{ad.plays}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Supprimer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Bannières publicitaires</CardTitle>
              <CardDescription>
                Gérez les bannières publicitaires affichées sur le site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de la bannière</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clics</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBannerAds.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell className="font-medium">{banner.name}</TableCell>
                      <TableCell>{banner.size}</TableCell>
                      <TableCell>{banner.impressions}</TableCell>
                      <TableCell>{banner.clicks}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Supprimer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Performance globale</CardTitle>
          <CardDescription>
            Aperçu des performances de toutes les campagnes publicitaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">Impressions totales</p>
              <p className="text-2xl font-bold">13,530</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">Clics totaux</p>
              <p className="text-2xl font-bold">183</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">CTR moyen</p>
              <p className="text-2xl font-bold">1.35%</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">Revenus (mois en cours)</p>
              <p className="text-2xl font-bold">$1,245</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdvertisementsPage;
