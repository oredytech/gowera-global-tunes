
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Radio, RadioTower } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  radioName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  streamUrl: z.string().url("L'URL de streaming doit être valide"),
  websiteUrl: z.string().url("L'URL du site web doit être valide").optional(),
  logoUrl: z.string().url("L'URL du logo doit être valide").optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  contactEmail: z.string().email("L'email doit être valide"),
  contactPhone: z.string().min(10, "Le numéro de téléphone doit être valide")
});

const SuggestRadioPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      radioName: "",
      streamUrl: "",
      websiteUrl: "",
      logoUrl: "",
      description: "",
      contactEmail: "",
      contactPhone: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Dans un environnement réel, vous utiliseriez ici un service backend pour envoyer l'email
      console.log("Sending email to infosgowera@gmail.com with the following data:", values);
      
      // Simulation d'envoi d'email (dans un projet réel, cela serait fait par une API backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Suggestion envoyée",
        description: "Nous examinerons votre suggestion dans les plus brefs délais."
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.",
        variant: "destructive"
      });
    }
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
            Toutes les informations soumises seront envoyées à notre équipe à <span className="font-medium">infosgowera@gmail.com</span>
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

          <FormField control={form.control} name="contactEmail" render={({
            field
          }) => <FormItem>
              <FormLabel>Email de contact</FormLabel>
              <FormControl>
                <Input placeholder="contact@radiookapi.net" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

          <FormField control={form.control} name="contactPhone" render={({
            field
          }) => <FormItem>
              <FormLabel>Téléphone de contact</FormLabel>
              <FormControl>
                <Input placeholder="+243 851 006 476" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

          <Button type="submit" className="w-full">
            Soumettre la radio
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SuggestRadioPage;
