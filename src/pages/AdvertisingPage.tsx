import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioTower, MonitorPlay, Trophy } from "lucide-react";
const AdvertisingPage = () => {
  return <div className="container max-w-4xl mx-auto px-0">
      <h1 className="font-bold mb-8 text-2xl">Espace Publicitaire</h1>
      
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground mb-8">
          Maximisez votre visibilité sur GOWERA avec nos différentes options publicitaires.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <MonitorPlay className="w-10 h-10 text-primary mb-4" />
              <CardTitle>Bannières Publicitaires</CardTitle>
              <CardDescription>Affichage stratégique sur notre plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li>• Visibilité maximale</li>
                <li>• Formats adaptables</li>
                <li>• Ciblage précis</li>
              </ul>
              <Button className="w-full">Nous contacter</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <RadioTower className="w-10 h-10 text-primary mb-4" />
              <CardTitle>Spots Audio</CardTitle>
              <CardDescription>Diffusion avant l&apos;écoute des radios</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li>• Messages percutants</li>
                <li>• Forte mémorisation</li>
                <li>• Public captif</li>
              </ul>
              <Button className="w-full">Nous contacter</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="w-10 h-10 text-primary mb-4" />
              <CardTitle>Radio Sponsorisée</CardTitle>
              <CardDescription>Mise en avant de votre station</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li>• Placement premium</li>
                <li>• Visibilité accrue</li>
                <li>• Analytics détaillés</li>
              </ul>
              <Button className="w-full">Nous contacter</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contactez-nous</h2>
          <p className="mb-4">
            Pour toute demande publicitaire, nos équipes sont à votre disposition :
          </p>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="font-medium">Téléphone 1:</span>
              <a href="tel:+243851006476" className="text-primary hover:underline">
                +243 851 006 476
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Téléphone 2:</span>
              <a href="tel:+243996886079" className="text-primary hover:underline">
                +243 996 886 079
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default AdvertisingPage;