
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Tag, Music } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SuggestRadioFormValues, commonCountries, commonLanguages, suggestedTags } from "./RadioFormSchema";

interface ClassificationSectionProps {
  form: UseFormReturn<SuggestRadioFormValues>;
}

export function ClassificationSection({ form }: ClassificationSectionProps) {
  return (
    <div className="p-4 border rounded-md bg-muted/20">
      <h3 className="text-lg font-medium mb-4">Classification de la radio</h3>
      <div className="space-y-6">
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
          name="language" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Langue principale
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {commonLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Langue principale de diffusion de la radio
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
                Genres / Catégories
              </FormLabel>
              <FormControl>
                <Input placeholder="musique, actualités, sport, culture" {...field} />
              </FormControl>
              <FormDescription>
                Séparez les tags par des virgules (ex: musique, actualités, sport)
              </FormDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedTags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => {
                      const currentTags = field.value ? field.value.split(',').map(t => t.trim()).filter(t => t !== '') : [];
                      if (!currentTags.includes(tag)) {
                        const newTags = [...currentTags, tag].join(', ');
                        field.onChange(newTags);
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )} 
        />
      </div>
    </div>
  );
}
