# Email Setup Guide for FoundryAI Website

## Problem: SMTP Port Blocking on Render

Render (and many cloud hosting platforms) block outbound SMTP connections on port 587 for security reasons. This causes the "Connection timeout" error when trying to send emails using Gmail SMTP.

## Solution: Use SendGrid (Recommended for Production)

SendGrid is a transactional email service that uses HTTP/HTTPS APIs instead of SMTP, which works reliably on all cloud platforms including Render.

---

## Setup Instructions

### Step 1: Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for a **FREE account** (100 emails/day free forever)
3. Verify your email address

### Step 2: Create API Key

1. Log into SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `FoundryAI Production`
5. Select **Full Access** permissions
6. Click **Create & View**
7. **COPY THE API KEY** (you won't see it again!)
   - Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Verify Sender Email (Required)

SendGrid requires you to verify the email address you'll send FROM:

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in the form:
   - From Name: `FoundryAI`
   - From Email Address: `guptasahil2175@gmail.com` (or your preferred email)
   - Reply To: `guptasahil2175@gmail.com`
   - Company Name: `FoundryAI`
   - Company Address: Your address
4. Click **Create**
5. **Check your email** and click the verification link
6. Wait for verification to complete

### Step 4: Update Render Environment Variables

1. Go to your Render Dashboard
2. Select your backend service: `foundryai`
3. Go to **Environment** tab
4. Add these environment variables:

```
SENDGRID_API_KEY=SG.your_actual_api_key_here
EMAIL_USER=guptasahil2175@gmail.com
```

5. **Remove these old variables** (no longer needed):
   - `EMAIL_PASS` (Gmail app password - not used anymore)

6. Click **Save Changes** (this will trigger a redeploy)

### Step 5: Deploy Updated Code

The code has already been updated to use SendGrid. Just commit and push:

```bash
git add .
git commit -m "Add SendGrid email service for production"
git push origin main
```

Render will automatically deploy the new code.

---

## How It Works

The email service automatically chooses the best method:

1. **Production (Render)**: Uses SendGrid API (via SENDGRID_API_KEY)
2. **Local Development**: Uses nodemailer with Gmail SMTP (via EMAIL_USER + EMAIL_PASS)

You don't need to change anything in your code - it's all handled automatically!

---

## Testing

### After Setup:

1. Wait for Render to finish deploying (2-3 minutes)
2. Visit: https://foundryai-sg.vercel.app
3. Test the **Contact Form**
4. Test the **Careers Form**
5. Check your email at `guptasahil2175@gmail.com`

### Expected Results:

- ✅ Admin receives notification emails
- ✅ Users receive beautiful auto-reply emails
- ✅ No "Connection timeout" errors in Render logs
- ✅ Render logs show: `📧 Sending email via SendGrid...` and `✅ Email sent successfully via SendGrid`

---

## Local Development (Optional)

If you want to test emails locally, you can still use Gmail:

1. Keep `EMAIL_USER` and `EMAIL_PASS` in your local `.env` file
2. The system will automatically use nodemailer for local testing
3. For production, it will always prefer SendGrid

---

## Troubleshooting

### Issue: "Sender email not verified"
**Solution**: Complete Step 3 above and verify your email address in SendGrid

### Issue: Still getting timeout errors
**Solution**: 
1. Make sure `SENDGRID_API_KEY` is set in Render
2. Check Render logs for `📧 Sending email via SendGrid...`
3. If you see nodemailer messages, the API key is not configured

### Issue: Emails not arriving
**Solution**:
1. Check spam/junk folder
2. Check SendGrid dashboard → Activity Feed
3. Verify the sender email is verified in SendGrid

### Issue: "Invalid API Key"
**Solution**:
1. Make sure you copied the FULL API key (starts with `SG.`)
2. No spaces or quotes in the environment variable
3. Regenerate a new API key if needed

---

## Free Tier Limits

SendGrid Free Plan:
- ✅ 100 emails per day (forever free)
- ✅ Sender verification required
- ✅ Full API access
- ✅ Activity tracking

For your use case (contact forms + career applications), 100 emails/day is more than enough!

---

## Alternative: Resend (Modern Option)

If you prefer a more modern alternative:

1. Sign up at [Resend](https://resend.com/)
2. Get API key
3. Verify domain or email
4. Replace `@sendgrid/mail` with `resend` package
5. Update emailService.js accordingly

But SendGrid works perfectly and has been battle-tested for years!

---

## Support

If you encounter any issues:
1. Check Render logs for error messages
2. Check SendGrid Activity Feed for delivery status
3. Verify all environment variables are set correctly
