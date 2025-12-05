
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { saveRadioSuggestion } from "@/services/supabase";
import { toast } from "@/hooks/use-toast";
import { formSchema, SuggestRadioFormValues } from "./RadioFormSchema";
import { RadioInfoSection } from "./RadioInfoSection";
import { ClassificationSection } from "./ClassificationSection";
import { ContactSection } from "./ContactSection";
import { AdditionalInfoSection } from "./AdditionalInfoSection";

interface SuggestRadioFormProps {
  onSubmitSuccess: (values: SuggestRadioFormValues, submissionId: string) => void;
  onSubmitError: (error: Error) => void;
}

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
      language: "",
    }
  });

  const onSubmit = async (values: SuggestRadioFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Save suggestion to Supabase
      const docId = await saveRadioSuggestion({
        radioName: values.radioName,
        streamUrl: values.streamUrl,
        websiteUrl: values.websiteUrl,
        logoUrl: values.logoUrl,
        description: values.description,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        senderEmail: values.senderEmail,
        country: values.country,
        tags: values.tags,
        language: values.language,
      });
      
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
        <RadioInfoSection form={form} />
        <ClassificationSection form={form} />
        <AdditionalInfoSection form={form} />
        <ContactSection form={form} />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Envoi en cours..." : "Soumettre la radio"}
        </Button>
      </form>
    </Form>
  );
}
