
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SuggestRadioFormValues } from "./RadioFormSchema";

interface AdditionalInfoSectionProps {
  form: UseFormReturn<SuggestRadioFormValues>;
}

export function AdditionalInfoSection({ form }: AdditionalInfoSectionProps) {
  return (
    <>
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
    </>
  );
}
