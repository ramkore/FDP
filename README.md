# Ezent - Authentication Setup

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### 2. Supabase Setup
1. Create a new Supabase project
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Deploy edge functions:
   ```bash
   supabase functions deploy send-otp
   supabase functions deploy verify-otp
   ```
4. Set environment variables in Supabase dashboard:
   - `RESEND_API_KEY`

### 3. Resend Setup
1. Create account at resend.com
2. Get API key and add to environment variables
3. Verify your sending domain

### 4. Database Tables Created
- `organizations`: Stores organization details and subdomain
- `otp_verifications`: Temporary OTP storage

### 5. Authentication Flow
1. User signs up with organization name, email, password
2. OTP sent via Resend API through edge function
3. User verifies OTP
4. Account created and organization record inserted
5. User chooses subdomain
6. Redirect to dashboard

### 6. Run the Application
```bash
npm install
npm run dev
```

## Routes
- `/` - Landing page
- `/login` - Login form
- `/signup` - Signup form
- `/verify-otp` - OTP verification
- `/choose-subdomain` - Subdomain selection