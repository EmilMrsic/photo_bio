import type { NextApiRequest, NextApiResponse } from 'next'

type ContactFormData = {
  name: string
  email: string
  location: string
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, location, message } = req.body as ContactFormData

    // Validate required fields
    if (!name || !email || !location || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Compose email in HTML format
    const htmlBody = `
      <h2>New PhotoBio Lead</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Location:</strong> ${location}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `

    const textBody = `
New PhotoBio Lead

Name: ${name}
Email: ${email}
Location: ${location}

Message:
${message}
    `.trim()

    // Log to console for debugging (always happens)
    console.log('=== NEW CONTACT FORM SUBMISSION ===')
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Location:', location)
    console.log('Message:', message)
    console.log('===================================')

    // Try to send email via SendGrid API (Google Cloud recommended)
    const sendgridApiKey = process.env.SENDGRID_API_KEY

    if (sendgridApiKey) {
      try {
        const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: 'emil@thankyuu.com' }],
              subject: 'New PhotoBio Lead',
            }],
            from: {
              email: process.env.SENDGRID_FROM_EMAIL || 'noreply@tpbmprotocols.com',
              name: 'TPBM Protocols Contact Form'
            },
            reply_to: {
              email: email,
              name: name
            },
            content: [
              {
                type: 'text/plain',
                value: textBody
              },
              {
                type: 'text/html',
                value: htmlBody
              }
            ]
          }),
        })

        if (emailResponse.ok) {
          console.log('Email sent successfully via SendGrid')
        } else {
          const error = await emailResponse.text()
          console.error('SendGrid API error:', error)
        }
      } catch (emailError) {
        console.error('Failed to send email via SendGrid:', emailError)
      }
    } else {
      console.log('⚠️  SENDGRID_API_KEY not configured. Email logged to console only.')
      console.log('To enable email sending, add SENDGRID_API_KEY to your .env.local file')
      console.log('Get an API key at https://sendgrid.com (recommended for Google Cloud)')
    }

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
