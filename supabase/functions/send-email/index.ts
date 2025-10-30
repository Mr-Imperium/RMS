import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { Resend } from 'https://esm.sh/resend'

// Simple template renderer
function renderTemplate(template, data) {
    let rendered = template;
    for (const key in data) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        rendered = rendered.replace(regex, data[key]);
    }
    return rendered;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const { to, templateId, data: templateData, entity } = await req.json()
    
    // 1. Fetch the template from the database
    const { data: template, error: templateError } = await supabaseAdmin
      .from('email_templates')
      .select('subject, body')
      .eq('id', templateId)
      .single()

    if (templateError) throw new Error(`Template not found: ${templateId}`)

    // 2. Render the subject and body with the provided data
    const subject = renderTemplate(template.subject, templateData);
    const html = renderTemplate(template.body, templateData);
    
    // 3. Send the email using Resend
    const { data: sendData, error: sendError } = await resend.emails.send({
      from: 'RMS Platform <onboarding@resend.dev>', // Use your verified domain in production
      to: [to],
      subject: subject,
      html: html,
    })
    
    if (sendError) throw sendError

    // 4. Log the email to the database
    await supabaseAdmin.from('email_log').insert({
        recipient_email: to,
        template_id: templateId,
        subject: subject,
        status: 'Sent',
        candidate_id: entity?.type === 'candidate' ? entity.id : null,
        client_id: entity?.type === 'client' ? entity.id : null,
    })

    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
     await supabaseAdmin.from('system_log').insert({ level: 'ERROR', message: `Failed to send email: ${error.message}`, context: { error }})
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})