import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { certificateId, certificateData, organizationId } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not found')
    }

    // Generate and send certificates
    const results = []
    for (const recipient of certificateData.recipients) {
      try {
        const certificateHtml = generateCertificateHtml(certificateData.template, recipient)
        const pdfBase64 = await generatePDFBase64(certificateHtml)
        const emailResult = await sendCertificateEmail(recipient, pdfBase64, resendApiKey, certificateData.name)
        results.push({ recipient: recipient.email, success: true, messageId: emailResult.id })
      } catch (error) {
        console.error(`Failed to send certificate to ${recipient.email}:`, error)
        results.push({ recipient: recipient.email, success: false, error: error.message })
      }
    }

    // Update certificate status
    if (certificateId !== 'new') {
      await supabaseClient
        .from('certificates')
        .update({ 
          status: 'published',
          issued_count: certificateData.recipients.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', certificateId)
        .eq('organization_id', organizationId)
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

function generateCertificateHtml(template: any, recipient: any): string {
  const { components, certificateStyle } = template
  
  let componentsHtml = ''
  components.forEach((component: any) => {
    let content = component.content
    
    // Replace variables
    content = content.replace(/\{\{name\}\}/g, recipient.name || '')
    content = content.replace(/\{\{course_name\}\}/g, recipient.course_name || '')
    content = content.replace(/\{\{date\}\}/g, recipient.date || '')
    
    if (['title', 'subtitle', 'text', 'name', 'course', 'date'].includes(component.type)) {
      componentsHtml += `
        <div style="
          font-size: ${component.style.fontSize || '16px'};
          color: ${component.style.color || '#000000'};
          font-weight: ${component.style.fontWeight || 'normal'};
          font-style: ${component.style.fontStyle || 'normal'};
          text-decoration: ${component.style.textDecoration || 'none'};
          text-align: ${component.style.textAlign || 'center'};
          margin-top: ${component.style.marginTop || '0px'};
          margin-bottom: ${component.style.marginBottom || '16px'};
          white-space: pre-wrap;
          line-height: 1.4;
        ">${content}</div>
      `
    } else if (['image', 'logo'].includes(component.type)) {
      componentsHtml += `
        <div style="text-align: center; margin-top: ${component.style.marginTop || '0px'}; margin-bottom: ${component.style.marginBottom || '16px'};">
          <img src="${content}" style="
            width: ${component.style.width || '200px'};
            height: ${component.style.height || '100px'};
            object-fit: contain;
          " />
        </div>
      `
    }
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&family=Arial:wght@400;700&display=swap');
        body { 
          margin: 0; 
          padding: 40px; 
          font-family: ${certificateStyle.fontFamily || 'Georgia, serif'}; 
          background: #f5f5f5;
        }
        .certificate {
          background-color: ${certificateStyle.backgroundColor || '#ffffff'};
          border: ${certificateStyle.borderWidth || '2px'} solid ${certificateStyle.borderColor || '#e2e8f0'};
          border-radius: ${certificateStyle.borderRadius || '12px'};
          padding: ${certificateStyle.padding || '48px'};
          width: ${certificateStyle.width || '800px'};
          height: ${certificateStyle.height || '600px'};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: relative;
        }
        .certificate::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 1px solid ${certificateStyle.borderColor || '#e2e8f0'};
          border-radius: 8px;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        ${componentsHtml}
      </div>
    </body>
    </html>
  `
}

async function generatePDFBase64(html: string): Promise<string> {
  try {
    // Use a simple HTML to PDF conversion service
    const response = await fetch('https://api.html-pdf-node.com/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: html,
        options: {
          format: 'A4',
          landscape: true,
          border: {
            top: '0.5in',
            right: '0.5in',
            bottom: '0.5in',
            left: '0.5in'
          }
        }
      })
    })

    if (!response.ok) {
      throw new Error('PDF generation service unavailable')
    }

    const pdfBuffer = await response.arrayBuffer()
    return btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)))
  } catch (error) {
    console.error('PDF generation failed, falling back to HTML:', error)
    // Fallback: return HTML as base64
    return btoa(html)
  }
}

async function sendCertificateEmail(recipient: any, pdfBase64: string, resendApiKey: string, certificateName: string) {
  const isHtml = pdfBase64.includes('<html>')
  
  const emailBody = {
    from: 'certificates@yourdomain.com',
    to: [recipient.email],
    subject: `Your Certificate: ${certificateName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">🎓 Certificate Awarded</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0; font-size: 28px;">Congratulations ${recipient.name}!</h2>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">You have successfully completed</p>
          <p style="margin: 10px 0 0 0; font-size: 22px; font-weight: bold;">${recipient.course_name}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 30px;">
          <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">
            We are pleased to present you with your certificate of completion. This certificate recognizes your dedication and achievement in completing the course requirements.
          </p>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            <strong>Completion Date:</strong> ${recipient.date}
          </p>
        </div>
        
        ${isHtml ? `
          <div style="margin: 30px 0; text-align: center;">
            <p style="color: #374151; margin-bottom: 20px;">Your certificate is displayed below:</p>
            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; background: white; display: inline-block;">
              ${atob(pdfBase64)}
            </div>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            ✨ Certificate Delivered
          </div>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
            Thank you for your participation and dedication to learning!
          </p>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 10px 0 0 0;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  }

  // Add PDF attachment if available
  if (!isHtml) {
    emailBody.attachments = [
      {
        filename: `${certificateName.replace(/[^a-zA-Z0-9]/g, '_')}_${recipient.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        content: pdfBase64,
      },
    ]
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailBody),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send email: ${error}`)
  }

  return await response.json()
}