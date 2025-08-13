# 🚀 ChatBot Creator - Complete Deployment & Testing Guide

## Overview

This guide will walk you through deploying your AI chatbots to real websites and social platforms, plus comprehensive testing instructions to ensure everything works perfectly.

## 🌐 Website Widget Deployment

### Quick Start (5 minutes)

1. **Get Your Embed Code**
   - Go to Dashboard → Deploy tab
   - Select your chatbot
   - Choose "Website Widget"
   - Copy the generated embed code

2. **Test Locally First**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>ChatBot Test</title>
   </head>
   <body>
       <h1>Test Your ChatBot</h1>
       <p>Click the chat button to test!</p>
       
       <!-- Your ChatBot Embed Code -->
       <script>
           window.chatbotConfig = {
               botId: 'your_bot_id_here',
               apiUrl: 'http://localhost:3000/api',
               theme: 'light',
               position: 'bottom-right',
               primaryColor: '#6366f1'
           };
       </script>
       <script src="http://localhost:3000/widget.js" async></script>
   </body>
   </html>
   ```

### Platform-Specific Instructions

#### Wix
1. Open Wix Editor
2. Click "+ Add" → "Embed Code" → "HTML iframe"
3. Paste embed code
4. Position widget element
5. Publish site

#### WordPress
1. Go to Appearance → Theme Editor
2. Edit `footer.php`
3. Paste code before `</body>` tag
4. Save changes

#### Shopify
1. Go to Online Store → Themes → Actions → Edit Code
2. Open `theme.liquid`
3. Paste code before `</head>`
4. Save

#### Squarespace
1. Go to Settings → Advanced → Code Injection
2. Paste code in Footer section
3. Save

## 📱 Social Platform Setup

### WhatsApp Business (15 min setup)

#### Prerequisites
- WhatsApp Business Account
- Facebook Business Manager Account
- Phone number for verification

#### Step-by-Step Setup

1. **Create WhatsApp Business Account**
   ```
   1. Go to Facebook Business Manager
   2. Add WhatsApp Business Account
   3. Verify phone number
   4. Complete business verification
   ```

2. **Get API Credentials**
   ```
   1. Generate Access Token
   2. Get Phone Number ID
   3. Set up App Secret (optional but recommended)
   ```

3. **Configure Webhook**
   ```
   Webhook URL: https://yourdomain.com/api/webhook/whatsapp
   Verify Token: your_custom_verify_token
   ```

4. **Test Connection**
   ```bash
   # Send test message
   curl -X POST "https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages" \
        -H "Authorization: Bearer ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "messaging_product": "whatsapp",
            "to": "YOUR_PHONE_NUMBER",
            "type": "text",
            "text": {"body": "Hello from your chatbot!"}
        }'
   ```

### Instagram DMs (10 min setup)

#### Prerequisites
- Instagram Business Account
- Facebook Page connected to Instagram
- Facebook App with Instagram Basic Display API

#### Setup Steps

1. **Convert Instagram Account**
   - Switch to Business Account
   - Connect to Facebook Page

2. **Create Facebook App**
   - Go to Facebook Developers
   - Create new app
   - Add Instagram Basic Display

3. **Configure API**
   ```
   App ID: your_app_id
   App Secret: your_app_secret
   Instagram App ID: your_ig_app_id
   ```

### Facebook Messenger (10 min setup)

#### Prerequisites
- Facebook Page
- Facebook App
- Page Admin access

#### Setup Steps

1. **Create Facebook App**
   - Add Messenger Platform
   - Generate Page Access Token

2. **Configure Webhook**
   ```
   Webhook URL: https://yourdomain.com/api/webhook/messenger
   Verify Token: your_verify_token
   Subscribe to: messages, messaging_postbacks
   ```

## 🧪 Complete Testing Guide

### 1. Local Testing

```bash
# Clone and setup
git clone your-repo
cd chatbot-creator-platform
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Test widget
open http://localhost:3000/test.html
```

### 2. Widget Testing Checklist

#### Visual Tests
- [ ] Chat button appears in correct position
- [ ] Correct colors and branding
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations work smoothly

#### Functional Tests
- [ ] Chat window opens/closes
- [ ] Messages send successfully
- [ ] Bot responses appear
- [ ] Typing indicators work
- [ ] No JavaScript errors in console

#### Cross-Browser Tests
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Edge (latest)
- [ ] Mobile browsers

### 3. Performance Testing

```javascript
// Check loading time
console.time('widget-load');
// ... widget loads ...
console.timeEnd('widget-load'); // Should be < 2 seconds

// Check memory usage
console.log(performance.memory);

// Monitor API calls
console.log(performance.getEntriesByType('resource'));
```

### 4. Social Platform Testing

#### WhatsApp Testing
```bash
# Send test message to your WhatsApp Business number
# Check webhook receives message
# Verify bot responds correctly
# Test different message types
```

#### Instagram Testing
```bash
# Send DM to Instagram Business account
# Check webhook integration
# Verify automated responses
# Test with media messages
```

### 5. Production Deployment

#### Environment Setup
```env
# Production .env
NODE_ENV=production
NEXT_PUBLIC_CONVEX_URL=https://your-production-convex.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_live_key
CLERK_SECRET_KEY=sk_live_your_live_secret

# API Keys
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_token
```

#### Vercel Deployment
```bash
# Deploy to Vercel
npx vercel

# Set environment variables
vercel env add NEXT_PUBLIC_CONVEX_URL
vercel env add CLERK_SECRET_KEY
# ... add all environment variables

# Deploy
vercel --prod
```

#### Update Widget CDN
```html
<!-- Update embed code for production -->
<script>
    window.chatbotConfig = {
        botId: 'your_bot_id',
        apiUrl: 'https://your-domain.vercel.app/api',
        theme: 'light',
        position: 'bottom-right',
        primaryColor: '#6366f1'
    };
</script>
<script src="https://your-domain.vercel.app/widget.js" async></script>
```

## 🔧 Troubleshooting

### Widget Not Appearing
1. Check browser console for errors
2. Verify embed code is correct
3. Check if ad blockers are interfering
4. Ensure script loads after DOM

### Bot Not Responding
1. Check API endpoint is accessible
2. Verify bot ID is correct
3. Check API key authentication
4. Review server logs for errors

### Social Platform Issues
1. Verify webhook URLs are accessible
2. Check API tokens are valid
3. Ensure proper permissions are granted
4. Test with webhook debugging tools

## 📊 Monitoring & Analytics

### Performance Monitoring
```javascript
// Add to your analytics
gtag('event', 'chatbot_interaction', {
    event_category: 'engagement',
    event_label: 'message_sent',
    value: 1
});
```

### Error Tracking
```javascript
// Add error tracking
window.addEventListener('error', (error) => {
    if (error.source?.includes('widget.js')) {
        // Report chatbot widget errors
        console.error('ChatBot Widget Error:', error);
    }
});
```

## 🚀 Going Live Checklist

### Pre-Launch
- [ ] All platforms tested thoroughly
- [ ] API keys configured for production
- [ ] Analytics tracking setup
- [ ] Error monitoring configured
- [ ] Performance optimized
- [ ] Cross-browser tested

### Launch
- [ ] Deploy to production
- [ ] Update all embed codes
- [ ] Test on live websites
- [ ] Monitor for errors
- [ ] Check analytics data
- [ ] Verify social integrations

### Post-Launch
- [ ] Monitor performance metrics
- [ ] Track user engagement
- [ ] Collect feedback
- [ ] Plan improvements
- [ ] Scale as needed

## 📞 Support

Need help? Check out:
- Documentation: `/docs`
- Support: `support@chatbotcreator.com`
- Community: Discord/Slack channel
- Status: `status.chatbotcreator.com`

---

🎉 **Congratulations!** You've successfully deployed your AI chatbot. Monitor the analytics and iterate based on user feedback to continuously improve the experience.
