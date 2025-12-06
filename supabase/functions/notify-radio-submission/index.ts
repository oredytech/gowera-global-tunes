import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RadioSubmissionRequest {
  radioName: string;
  description: string;
  streamUrl: string;
  country: string;
  language: string;
  contactEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { radioName, description, streamUrl, country, language, contactEmail }: RadioSubmissionRequest = await req.json();

    console.log("Sending notification email for radio:", radioName);

    const adminEmail = "admin@gowera.com"; // Email de l'administrateur

    const emailResponse = await resend.emails.send({
      from: "Gowera <noreply@gowera.com>",
      to: [adminEmail],
      subject: `Nouvelle radio soumise: ${radioName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .info-row { margin-bottom: 15px; }
            .label { font-weight: bold; color: #6366f1; }
            .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Nouvelle Radio Soumise</h1>
            </div>
            <div class="content">
              <p>Une nouvelle radio a été soumise sur Gowera et attend votre validation.</p>
              
              <div class="info-row">
                <span class="label">Nom de la radio:</span> ${radioName}
              </div>
              
              <div class="info-row">
                <span class="label">Description:</span> ${description}
              </div>
              
              <div class="info-row">
                <span class="label">URL du stream:</span> ${streamUrl}
              </div>
              
              <div class="info-row">
                <span class="label">Pays:</span> ${country}
              </div>
              
              <div class="info-row">
                <span class="label">Langue:</span> ${language}
              </div>
              
              <div class="info-row">
                <span class="label">Email de contact:</span> ${contactEmail}
              </div>
              
              <div style="text-align: center;">
                <a href="https://gowera.com/pending-radios" class="button">
                  ✅ Valider la radio
                </a>
              </div>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement par Gowera.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
