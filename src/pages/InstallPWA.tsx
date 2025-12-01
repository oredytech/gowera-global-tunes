import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Zap, Wifi, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  const features = [
    { icon: Smartphone, title: 'Accès rapide', description: 'Lancez GOWERA depuis votre écran d\'accueil' },
    { icon: Zap, title: 'Performances optimales', description: 'Chargement ultra-rapide et navigation fluide' },
    { icon: Wifi, title: 'Mode hors-ligne', description: 'Accédez à vos radios favorites sans connexion' },
  ];

  return (
    <>
      <Helmet>
        <title>Installer GOWERA | Application Progressive Web</title>
        <meta name="description" content="Installez l'application GOWERA sur votre appareil pour une expérience optimale d'écoute de radios du monde entier." />
      </Helmet>

      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Installer GOWERA
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Profitez d'une expérience d'écoute optimale en installant l'application sur votre appareil
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {isInstalled ? 'Application installée !' : 'Installez l\'application'}
            </CardTitle>
            <CardDescription>
              {isInstalled 
                ? 'GOWERA est maintenant disponible sur votre écran d\'accueil' 
                : 'Un seul clic pour installer GOWERA sur votre appareil'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isInstalled ? (
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">L'application est installée avec succès</span>
              </div>
            ) : deferredPrompt ? (
              <Button 
                onClick={handleInstall} 
                size="lg" 
                className="w-full"
              >
                <Download className="mr-2 h-5 w-5" />
                Installer maintenant
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground text-center">
                    Pour installer l'application :
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">Sur iPhone :</span>
                      <span>Appuyez sur le bouton Partager puis "Sur l'écran d'accueil"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">Sur Android :</span>
                      <span>Ouvrez le menu du navigateur puis "Installer l'application"</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 pt-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
