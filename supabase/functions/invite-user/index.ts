import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 1. Define CORS headers locally since the _shared/cors.ts file is missing
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the expected structure of the request body for type safety
interface InviteRequestBody {
  email: string
  role_id?: string | number
  full_name?: string
}

serve(async (req) => {
  // Handle CORS preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Client Initialization and Environment Variable Check
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase environment variables.')
    }

    // Create Supabase Admin client using the Service Role Key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }, // Best practice for Edge Functions
    })

    // 3. Parse and Validate Request Body
    const { email, role_id, full_name }: InviteRequestBody = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing required field: email.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Prepare user metadata object
    const user_metadata: Record<string, any> = {}
    if (full_name) user_metadata.full_name = full_name
    if (role_id !== undefined) user_metadata.role_id = role_id

    // 4. Invite the User
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: user_metadata
      }
    )

    if (inviteError) {
      // Throw error to be caught below for a 400 response
      throw new Error(inviteError.message) 
    }

    // 5. Success Response
    return new Response(JSON.stringify({ 
      message: 'User invitation successful.', 
      user: inviteData?.user
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error) {
    // 6. Error Response
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred'

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      // Use 400 for client-side input errors, 500 for internal server errors
      status: error.message.includes('Missing') || error.message.includes('email') ? 400 : 500,
    })
  }
})