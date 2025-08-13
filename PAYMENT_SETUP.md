# Payment Setup Instructions

## Install Required Packages

```bash
npm install stripe @stripe/stripe-js
npm install @types/stripe --save-dev
```

## Environment Variables to Add

Add these to your `.env.local`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Setup Steps

1. Create Stripe account at https://stripe.com
2. Get API keys from Stripe Dashboard
3. Create webhook endpoint for subscription events
4. Configure products and prices in Stripe Dashboard
