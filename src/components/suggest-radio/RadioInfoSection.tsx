
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SuggestRadioFormValues } from "./RadioFormSchema";

interface RadioInfoSectionProps {
  form: UseFormReturn<SuggestRadioFormValues>;
}

export function RadioInfoSection({ form }: RadioInfoSectionProps) {
  return (
    <div className="p-4 border rounded-md bg-muted/20 mb-2">
      <h3 className="text-lg font-medium mb-4">Informations principales de la radio</h3>
      <div className="space-y-6">
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
      </div>
    </div>
  );
}
