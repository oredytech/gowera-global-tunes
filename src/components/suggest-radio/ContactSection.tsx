
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SuggestRadioFormValues } from "./RadioFormSchema";

interface ContactSectionProps {
  form: UseFormReturn<SuggestRadioFormValues>;
}

export function ContactSection({ form }: ContactSectionProps) {
  return (
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
  );
}
