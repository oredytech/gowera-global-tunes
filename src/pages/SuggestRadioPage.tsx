import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Radio, RadioTower, Mail, User, Phone, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { saveRadioSuggestion } from "@/services/firebaseService";

const formSchema = z.object({
  radioName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  streamUrl: z.string().url("L'URL de streaming doit être valide"),
  websiteUrl: z.string().url("L'URL du site web doit être valide").optional(),
  logoUrl: z.string().url("L'URL du logo doit être valide").optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  contactEmail: z.string().email("L'email doit être valide"),
  contactPhone: z.string().min(10, "Le numéro de téléphone doit être valide"),
  senderEmail: z.string().email("Votre email doit être valide")
});

const SuggestRadioPage = () => {
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<z.infer<typeof formSchema> | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      radioName: "",
      streamUrl: "",
      websiteUrl: "",
      logoUrl: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
      senderEmail: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Enregistrer la suggestion dans Firebase
      const docId = await saveRadioSuggestion(values);
      setSubmissionId(docId);
      
      // Stocker les valeurs pour le dialogue de sponsoring
      setSubmittedValues(values);
      
      // Ouvrir la boîte de dialogue de sponsoring
      setSponsorDialogOpen(true);
      
      // Le toast de succès sera affiché uniquement si l'utilisateur ferme la boîte de dialogue
      // sans choisir le sponsoring, ou après avoir géré le sponsoring
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
    
    // Réinitialiser le formulaire
    form.reset();
  };

  return (
    <div className="container max-w-2xl mx-auto px-0">
      <div className="flex items-center gap-3 mb-8">
        <RadioTower className="h-8 w-8 text-primary" />
        <h1 className="font-bold text-2xl">Suggérer une Radio</h1>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Radio className="h-5 w-5" />
            <p>
              Vous souhaitez ajouter votre radio sur GOWERA ? Remplissez ce formulaire et nous vous contacterons rapidement.
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Toutes les informations soumises seront enregistrées dans notre base de données et un email sera envoyé à notre équipe à <span className="font-medium">infosgowera@gmail.com</span>
          </p>
        </CardContent>
      </Card>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="radioName" render={({
            field
          }) => <FormItem>
              <FormLabel>Nom de la radio</FormLabel>
              <FormControl>
                <Input placeholder="Radio Okapi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

          <FormField control={form.control} name="streamUrl" render={({
            field
          }) => <FormItem>
              <FormLabel>URL du flux streaming</FormLabel>
              <FormControl>
                <Input placeholder="https://stream.radiookapi.net/stream" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

          <FormField control={form.control} name="logoUrl" render={({
            field
          }) => <FormItem>
              <FormLabel>URL du logo</FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com/logo.png" {...field} />
              </FormControl>
              <FormDescription>
                Fournissez un lien vers le logo de votre radio (format PNG ou JPG recommandé)
              </FormDescription>
              <FormMessage />
            </FormItem>} />

          <FormField control={form.control} name="websiteUrl" render={({
            field
          }) => <FormItem>
              <FormLabel>Site web (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.radiookapi.net" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

          <FormField control={form.control} name="description" render={({
            field
          }) => <FormItem>
              <FormLabel>Description de la radio</FormLabel>
              <FormControl>
                <Textarea placeholder="Décrivez votre radio, son contenu, sa programmation..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="text-lg font-medium mb-4">Informations de contact de la radio</h3>
            <div className="space-y-6">
              <FormField control={form.control} name="contactEmail" render={({
                field
              }) => <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email de contact de la radio
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="contact@radiookapi.net" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

              <FormField control={form.control} name="contactPhone" render={({
                field
              }) => <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone de contact de la radio
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+243 851 006 476" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            </div>
          </div>

          <FormField control={form.control} name="senderEmail" render={({
            field
          }) => <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Votre email pour être contacté
              </FormLabel>
              <FormControl>
                <Input placeholder="votre.email@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Nous utiliserons cette adresse pour vous informer de l'ajout de votre radio
              </FormDescription>
              <FormMessage />
            </FormItem>} />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Envoi en cours..." : "Soumettre la radio"}
          </Button>
        </form>
      </Form>
      
      {/* Dialog de sponsoring */}
      <Dialog open={sponsorDialogOpen} onOpenChange={setSponsorDialogOpen}>
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
            <Button variant="outline" onClick={handleDeclineSponsor} className="flex-1">
              Pas maintenant
            </Button>
            <Button onClick={handleSponsorRadio} className="flex-1 bg-gradient-to-r from-primary to-primary/80">
              Sponsoriser ma radio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuggestRadioPage;
