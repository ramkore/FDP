import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const requestBody = await req.json()
    console.log('Request body:', requestBody)
    
    const { campaignId, campaignData, organizationId } = requestBody
    
    if (!campaignData || !organizationId) {
      throw new Error('Missing required fields: campaignData or organizationId')
    }
    
    if (!campaignData.contacts || campaignData.contacts.length === 0) {
      throw new Error('No contacts provided')
    }

    // Save campaign to database if new
    let campaign
    if (campaignId === 'new') {
      const { data, error } = await supabaseClient
        .from('campaigns')
        .insert({
          organization_id: organizationId,
          name: campaignData.name,
          type: campaignData.type,
          schedule: campaignData.schedule,
          template: campaignData.template,
          contacts: campaignData.contacts,
          status: 'sent'
        })
        .select()
        .single()

      if (error) throw error
      campaign = data
    } else {
      const { data, error } = await supabaseClient
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (error) throw error
      campaign = data
    }

    // Send campaigns based on type
    const results = []
    console.log(`Sending ${campaign.type} campaign to ${campaign.contacts.length} contacts`)
    
    for (const contact of campaign.contacts) {
      const contactEmail = contact.user_email || contact.email || contact.Email
      if (!contactEmail) {
        console.log('Skipping contact without email:', contact)
        continue
      }
      
      try {
        let result
        if (campaign.type === 'email') {
          result = await sendEmail(contact, campaign.template || campaignData.template)
        } else {
          throw new Error(`Campaign type ${campaign.type} not implemented yet`)
        }

        // Log success
        await supabaseClient
          .from('campaign_logs')
          .insert({
            campaign_id: campaign.id,
            contact_email: contactEmail,
            status: 'sent'
          })

        results.push({ contact: contactEmail, status: 'sent' })
      } catch (error) {
        console.error(`Failed to send to ${contactEmail}:`, error.message)
        
        // Log failure
        await supabaseClient
          .from('campaign_logs')
          .insert({
            campaign_id: campaign.id,
            contact_email: contactEmail,
            status: 'failed',
            error_message: error.message
          })

        results.push({ contact: contactEmail, status: 'failed', error: error.message })
      }
    }

    // Update campaign stats
    const sentCount = results.filter(r => r.status === 'sent').length
    await supabaseClient
      .from('campaigns')
      .update({ sent_count: sentCount })
      .eq('id', campaign.id)

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Campaign send error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function sendEmail(contact, template) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) throw new Error('RESEND_API_KEY not configured')

  const personalizedTemplate = personalizeTemplate(template, contact)
  const contactEmail = contact.user_email || contact.email || contact.Email
  
  if (!contactEmail) {
    throw new Error('Contact email is required')
  }

  const emailBody = {
    from: 'onboarding@resend.dev', // Use Resend's default sender for testing
    to: contactEmail,
    subject: personalizedTemplate.subject || 'Your Event Update',
    html: generateEmailHTML(template, contact)
  }
  
  console.log('Sending email to:', contactEmail)

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailBody)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Resend API error:', errorText)
    throw new Error(`Email send failed: ${errorText}`)
  }

  return await response.json()
}

function generateEmailHTML(template, contact) {
  // Personalize template first
  const personalizedTemplate = personalizeTemplate(template, contact)
  
  if (personalizedTemplate.components && personalizedTemplate.components.length > 0) {
    // New component-based template
    let html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">'
    
    personalizedTemplate.components.forEach(component => {
      const style = component.style || {}
      const styleString = Object.entries(style).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')
      
      switch (component.type) {
        case 'header':
        case 'text':
        case 'footer':
          html += `<div style="${styleString}; margin-bottom: 16px;">${component.content}</div>`
          break
        case 'image':
          html += `<img src="${component.content}" style="${styleString}; margin-bottom: 16px; max-width: 100%; height: auto;" alt="Campaign Image" />`
          break
        case 'button':
          html += `<div style="text-align: center; margin-bottom: 16px;"><a href="${component.link || '#'}" style="${styleString}; text-decoration: none; display: inline-block; border-radius: 4px;">${component.content}</a></div>`
          break
        case 'divider':
          html += `<hr style="${styleString}; border: none; margin: 20px 0;" />`
          break
        case 'link':
          html += `<div style="margin-bottom: 16px;"><a href="${component.link || '#'}" style="${styleString};">${component.content}</a></div>`
          break
      }
    })
    
    html += '</div>'
    return html
  } else {
    // Fallback for old template format
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">${personalizedTemplate.title || personalizedTemplate.header || 'Hello!'}</h2>
        <div style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          ${(personalizedTemplate.content || 'Thank you for your interest.').replace(/\n/g, '<br>')}
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 14px; text-align: center;">
          ${personalizedTemplate.footer || 'Best regards, Event Team'}
        </div>
      </div>
    `
  }
}

async function sendSMS(contact, template) {
  // Implement SMS sending logic here
  // This would typically use a service like Twilio
  throw new Error('SMS sending not implemented yet')
}

async function sendWhatsApp(contact, template) {
  // Implement WhatsApp sending logic here
  // This would typically use WhatsApp Business API
  throw new Error('WhatsApp sending not implemented yet')
}

function personalizeTemplate(template, contact) {
  const personalized = JSON.parse(JSON.stringify(template)) // Deep clone
  const name = contact.user_name || contact.name || contact.Name || 'there'
  const email = contact.user_email || contact.email || contact.Email || ''
  const teamName = contact.team_name || contact.team || contact.Team || ''

  // Personalize all string fields recursively
  function personalizeObject(obj) {
    if (typeof obj === 'string') {
      return obj
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{email\}\}/g, email)
        .replace(/\{\{team_name\}\}/g, teamName)
    } else if (Array.isArray(obj)) {
      return obj.map(personalizeObject)
    } else if (obj && typeof obj === 'object') {
      const result = {}
      Object.keys(obj).forEach(key => {
        result[key] = personalizeObject(obj[key])
      })
      return result
    }
    return obj
  }

  return personalizeObject(personalized)
}