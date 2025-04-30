
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, User, Globe, Tag } from "lucide-react";
import { RadioSuggestion, saveRadioSuggestion } from "@/services/firebaseService";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema definition
const formSchema = z.object({
  radioName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  streamUrl: z.string().url("L'URL de streaming doit être valide"),
  websiteUrl: z.string().url("L'URL du site web doit être valide").optional(),
  logoUrl: z.string().url("L'URL du logo doit être valide").optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  contactEmail: z.string().email("L'email doit être valide"),
  contactPhone: z.string().min(10, "Le numéro de téléphone doit être valide"),
  senderEmail: z.string().email("Votre email doit être valide"),
  country: z.string().min(1, "Veuillez sélectionner un pays"),
  tags: z.string().min(3, "Veuillez fournir au moins un tag"),
});

// Define a type based on the form schema
export type SuggestRadioFormValues = z.infer<typeof formSchema>;

interface SuggestRadioFormProps {
  onSubmitSuccess: (values: SuggestRadioFormValues, submissionId: string) => void;
  onSubmitError: (error: Error) => void;
}

// List of common countries for the dropdown
const commonCountries = [
  "République Démocratique du Congo",
  "Congo-Brazzaville",
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "Cameroun",
  "Côte d'Ivoire",
  "Sénégal",
  "Mali",
  "Burkina Faso",
  "Gabon",
  "Guinée",
  "Bénin",
  "Togo",
  "Niger",
  "Rwanda",
  "Burundi",
  "Madagascar",
  "Haïti",
  "Autre"
];

export function SuggestRadioForm({ onSubmitSuccess, onSubmitError }: SuggestRadioFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<SuggestRadioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      radioName: "",
      streamUrl: "",
      websiteUrl: "",
      logoUrl: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
      senderEmail: "",
      country: "",
      tags: "",
    }
  });

  const onSubmit = async (values: SuggestRadioFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare data for Firebase
      const suggestionData: Omit<RadioSuggestion, "createdAt" | "sponsored"> = {
        radioName: values.radioName,
        streamUrl: values.streamUrl,
        description: values.description,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        senderEmail: values.senderEmail,
        // Optional fields
        websiteUrl: values.websiteUrl || undefined,
        logoUrl: values.logoUrl || undefined,
        // New fields for country and tags
        country: values.country,
        tags: values.tags
      };
      
      // Save suggestion to Firebase
      const docId = await saveRadioSuggestion(suggestionData);
      
      // Call the success callback with the form values and submission ID
      onSubmitSuccess(values, docId);
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      onSubmitError(error);
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField 
          control={form.control} 
          name="radioName" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la radio</FormLabel>
              <FormControl>
                <Input placeholder="Radio Okapi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="streamUrl" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL du flux streaming</FormLabel>
              <FormControl>
                <Input placeholder="https://stream.radiookapi.net/stream" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="logoUrl" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL du logo</FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com/logo.png" {...field} />
              </FormControl>
              <FormDescription>
                Fournissez un lien vers le logo de votre radio (format PNG ou JPG recommandé)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="websiteUrl" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site web (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.radiookapi.net" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="country" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Pays d'origine
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {commonCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Pays d'origine ou principal de diffusion de la radio
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control} 
          name="tags" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags / Genres
              </FormLabel>
              <FormControl>
                <Input placeholder="musique, actualités, sport, culture" {...field} />
              </FormControl>
              <FormDescription>
                Séparez les tags par des virgules (ex: musique, actualités, sport)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="description" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description de la radio</FormLabel>
              <FormControl>
                <Textarea placeholder="Décrivez votre radio, son contenu, sa programmation..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <div className="p-4 border rounded-md bg-muted/50">
          <h3 className="text-lg font-medium mb-4">Informations de contact de la radio</h3>
          <div className="space-y-6">
            <FormField 
              control={form.control} 
              name="contactEmail" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email de contact de la radio
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="contact@radiookapi.net" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="contactPhone" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone de contact de la radio
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+243 851 006 476" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </div>
        </div>

        <FormField 
          control={form.control} 
          name="senderEmail" 
          render={({ field }) => (
            <FormItem>
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
            </FormItem>
          )} 
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Envoi en cours..." : "Soumettre la radio"}
        </Button>
      </form>
    </Form>
  );
}
