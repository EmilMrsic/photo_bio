# Contact Form Email Setup

The contact form is configured to send emails to `emil@thankyuu.com` with the subject line "New PhotoBio Lead".

## Current Status

✅ Contact form modal is fully functional
✅ Form validates all required fields (name, email, location, message)
✅ Submissions are logged to the console
✅ Configured for Google Cloud deployment with SendGrid
⚠️  Email sending requires API key configuration

## To Enable Email Sending (Google Cloud Recommended)

The contact form uses [SendGrid](https://sendgrid.com) for email delivery, which is the recommended solution for Google Cloud. To enable it:

1. **Sign up for SendGrid** (free tier: 100 emails/day)
   - Visit https://sendgrid.com
   - Create an account (integrates well with Google Cloud)
   - Navigate to Settings → API Keys
   - Create a new API key with "Mail Send" permissions

2. **Verify sender email** (required by SendGrid)
   - Go to Settings → Sender Authentication
   - Verify your sending domain or email address
   - Use this email in the `SENDGRID_FROM_EMAIL` variable

3. **Add API key to environment variables**
   - For local development, open `.env.local` in the project root
   - For Google Cloud, add to Cloud Run environment variables or Secret Manager
   - Add these lines:
     ```
     SENDGRID_API_KEY=SG.your_api_key_here
     SENDGRID_FROM_EMAIL=noreply@yourdomain.com
     ```

4. **Restart your application**
   - Local: `npm run dev`
   - Google Cloud: Redeploy your Cloud Run service

## How It Works

When a user submits the contact form:
1. Form data is validated client-side
2. Data is sent to `/api/contact` endpoint
3. The endpoint logs the submission to console (always)
4. If `SENDGRID_API_KEY` is configured, it sends an email via SendGrid API
5. User sees success message and modal closes

## Email Format

**Subject:** New PhotoBio Lead

**Body:**
```
Name: [name]
Email: [email]
Location: [location]

Message:
[message]
```

## Testing Without API Key

You can test the form without configuring SendGrid:
- Form submissions will still work
- Data will be logged to the terminal console
- Success message will still appear to user
- No actual email will be sent

Check your terminal where `npm run dev` is running to see the logged submissions.

## Google Cloud Deployment Tips

When deploying to Google Cloud:

1. **Use Secret Manager** for API keys (recommended)
   ```bash
   gcloud secrets create sendgrid-api-key --data-file=-
   ```

2. **Set environment variables in Cloud Run**
   - Navigate to your Cloud Run service
   - Edit & Deploy New Revision
   - Add environment variables under "Variables & Secrets"

3. **Consider Cloud Logging**
   - All submissions are logged, viewable in Google Cloud Console
   - Navigate to Logging → Logs Explorer
   - Filter by your Cloud Run service name
