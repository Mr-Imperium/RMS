import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (_req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // 1. Find the base currency from your DB (e.g., 'NPR')
    const { data: baseCurrencyData, error: baseError } = await supabaseAdmin
      .from('currencies')
      .select('code')
      .eq('is_base_currency', true)
      .single()

    if (baseError) throw new Error("Base currency not found. Please set one.")
    const baseCurrencyCode = baseCurrencyData.code

    // 2. Fetch latest exchange rates from the third-party API
    const apiKey = Deno.env.get('EXCHANGE_RATE_API_KEY')
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrencyCode}`)
    const exchangeData = await response.json()

    if (exchangeData.result === 'error') throw new Error(exchangeData['error-type'])
    
    // 3. Get all currencies from your DB to map them
    const { data: allCurrencies, error: currenciesError } = await supabaseAdmin
      .from('currencies')
      .select('id, code')
    if (currenciesError) throw currenciesError
      
    // 4. Prepare the new rates for insertion
    const ratesToInsert = allCurrencies
      .filter(c => exchangeData.conversion_rates[c.code])
      .map(currency => ({
        currency_id: currency.id,
        rate: exchangeData.conversion_rates[currency.code],
        effective_date: new Date().toISOString().split('T')[0] // today's date
      }))

    // 5. Upsert the rates into the exchange_rates table
    const { error: upsertError } = await supabaseAdmin
      .from('exchange_rates')
      .upsert(ratesToInsert, { onConflict: 'currency_id,effective_date' })

    if (upsertError) throw upsertError

    return new Response(JSON.stringify({ message: 'Exchange rates updated successfully!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})