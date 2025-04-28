
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  radioName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  streamUrl: z.string().url("L'URL de streaming doit être valide"),
  websiteUrl: z.string().url("L'URL du site web doit être valide").optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  contactEmail: z.string().email("L'email doit être valide"),
  contactPhone: z.string().min(10, "Le numéro de téléphone doit être valide"),
});

const SuggestRadioPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      radioName: "",
      streamUrl: "",
      websiteUrl: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast({
      title: "Suggestion envoyée",
      description: "Nous examinerons votre suggestion dans les plus brefs délais.",
    });
    console.log(values);
  };

  return (
    <div className="container max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Suggérer une Radio</h1>
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
          Vous souhaitez ajouter votre radio sur GOWERA ? Remplissez ce formulaire et nous vous contacterons rapidement.
        </p>
        
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
                    <Textarea 
                      placeholder="Décrivez votre radio, son contenu, sa programmation..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contact</FormLabel>
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
                  <FormLabel>Téléphone de contact</FormLabel>
                  <FormControl>
                    <Input placeholder="+243 851 006 476" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Soumettre la radio
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SuggestRadioPage;
