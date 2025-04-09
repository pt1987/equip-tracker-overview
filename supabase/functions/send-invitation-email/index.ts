
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, firstName, lastName, temporaryPassword, resetUrl } = await req.json()

    // Validate required fields
    if (!email || !firstName || !resetUrl) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: email, firstName, resetUrl',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // In a real implementation, you would use a service like Resend, SendGrid, etc.
    // For now, we'll just log the email that would be sent
    console.log(`
      To: ${email}
      Subject: Willkommen bei unserer Unternehmenssoftware
      
      Hallo ${firstName} ${lastName},
      
      Ihr Konto wurde erfolgreich erstellt. 
      
      Ihre Anmeldedaten:
      Email: ${email}
      Temporäres Passwort: ${temporaryPassword}
      
      Bitte ändern Sie Ihr Passwort bei der ersten Anmeldung unter diesem Link:
      ${resetUrl}
      
      Mit freundlichen Grüßen,
      Ihr IT-Team
    `)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation email would be sent (logged for demo purposes)',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error sending invitation email:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
