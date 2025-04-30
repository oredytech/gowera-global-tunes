
import { z } from "zod";

// Form schema definition
export const formSchema = z.object({
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
  language: z.string().min(1, "Veuillez sélectionner une langue"),
});

// Define a type based on the form schema
export type SuggestRadioFormValues = z.infer<typeof formSchema>;

// Common data for form selections
export const commonCountries = [
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

// List of common languages
export const commonLanguages = [
  "Français",
  "Anglais",
  "Lingala",
  "Swahili",
  "Kikongo",
  "Tshiluba",
  "Portugais",
  "Espagnol",
  "Arabe",
  "Wolof",
  "Bambara",
  "Autre"
];

// List of genres/categories for suggestions
export const suggestedTags = [
  "Musique",
  "Actualités",
  "Sport",
  "Culture",
  "Religion",
  "Éducation",
  "Humour",
  "Politique",
  "Économie",
  "Divertissement",
  "Jeunesse"
];
