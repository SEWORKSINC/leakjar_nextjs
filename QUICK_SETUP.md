# 🚀 Quick Setup Guide - LeakJar

## 📋 Immediate Actions Required

### 1. ✅ Google Analytics 4 - READY
Your GA4 tracking is already configured!

**Tracking ID:** `G-E7LNSKYVTQ`

#### Optional: Add to Environment Variables
Create `.env.local` file (optional, fallback is already set):
```env
NEXT_PUBLIC_GA_ID=G-E7LNSKYVTQ
```

#### Verify Installation:
1. Deploy your site
2. Visit your website
3. Open Google Analytics dashboard
4. Check Real-Time reports to see live visitors

**Note:** Analytics only runs in production, not in development mode.

---

### 2. 🖼️ Create Social Media Images (Required)

Create these images and place in `/public/` directory:

#### A. Open Graph Image
- **File:** `public/og-image.png`
- **Size:** 1200 x 630 pixels
- **Format:** PNG or JPG
- **Content:** LeakJar branding + tagline
- **Used by:** Facebook, LinkedIn, Slack, Discord

#### B. Twitter Card Image  
- **File:** `public/twitter-image.png`
- **Size:** 1200 x 630 pixels
- **Format:** PNG or JPG
- **Content:** Same as OG image or Twitter-optimized version
- **Used by:** Twitter/X

#### C. Logo
- **File:** `public/logo.png`
- **Size:** 512 x 512 pixels (square)
- **Format:** PNG with transparency
- **Used by:** Schema.org structured data, PWA icons

**Quick Design Tips:**
- Use high contrast colors
- Include LeakJar logo prominently
- Add key value proposition text
- Keep text readable at small sizes
- Test on dark and light backgrounds

**Example Tools:**
- Canva (easy, templates available)
- Figma (professional)
- Photoshop/GIMP (advanced)

---

### 3. 🔍 Google Search Console Setup

#### Step 1: Add Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Choose "URL prefix"
4. Enter: `https://www.leakjar.com`

#### Step 2: Verify Ownership
You have two options:

**Option A: HTML Meta Tag (Recommended)**
1. Google will give you a verification code like: `abc123def456`
2. Update `app/layout.tsx` line 74:
```typescript
verification: {
  google: "abc123def456",  // Replace with your actual code
}
```

**Option B: DNS Verification**
1. Add TXT record to your domain DNS
2. Use verification code from Google

#### Step 3: Submit Sitemap
1. After verification, go to "Sitemaps" in left menu
2. Add new sitemap: `https://www.leakjar.com/sitemap.xml`
3. Submit

**Expected Results:**
- Within 24-48 hours: Pages start appearing
- Within 1 week: Full site indexed
- Within 2-4 weeks: Search rankings improve

---

### 4. ✅ Test Your Implementation

#### A. SEO Testing
Test these URLs to verify your metadata:

1. **Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test: `https://www.leakjar.com`
   - Check: Organization, WebSite schemas appear

2. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Test: `https://www.leakjar.com`
   - Check: Image, title, description show correctly

3. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Test: `https://www.leakjar.com`
   - Check: Card preview looks good

4. **Schema Markup Validator**
   - URL: https://validator.schema.org/
   - Test: `https://www.leakjar.com`
   - Check: No errors in structured data

#### B. Mobile Testing
1. Open site on real mobile device
2. Test hamburger menu (tap to open/close)
3. Navigate through all pages
4. Test form submission
5. Check video autoplay

#### C. Accessibility Testing
1. **Keyboard Navigation:**
   - Press Tab key to navigate
   - Check focus indicators are visible
   - Press Enter on buttons/links
   - Test skip-to-content link (Tab on page load)

2. **WAVE Accessibility:**
   - URL: https://wave.webaim.org/
   - Test: `https://www.leakjar.com`
   - Target: 0 errors

3. **Lighthouse Audit:**
   - Open Chrome DevTools (F12)
   - Go to "Lighthouse" tab
   - Run audit for all categories
   - Target Scores:
     - Performance: 90+
     - Accessibility: 95+
     - Best Practices: 95+
     - SEO: 100

#### D. Performance Testing
1. **PageSpeed Insights:**
   - URL: https://pagespeed.web.dev/
   - Test: `https://www.leakjar.com`
   - Check Core Web Vitals (green is good)

2. **GTmetrix:**
   - URL: https://gtmetrix.com/
   - Test: `https://www.leakjar.com`
   - Target: A grade

---

### 5. 📊 Monitor Your Progress

#### Week 1 - Setup & Verification
- [ ] Create social media images
- [ ] Set up Google Search Console
- [ ] Submit sitemap
- [ ] Verify GA4 is tracking
- [ ] Run initial tests (Lighthouse, WAVE)

#### Week 2-4 - Early Results
Monitor in Google Search Console:
- [ ] Pages indexed count
- [ ] Impressions in search
- [ ] Average position
- [ ] Click-through rate

Monitor in Google Analytics:
- [ ] Daily visitors
- [ ] Traffic sources
- [ ] Bounce rate
- [ ] Pages per session
- [ ] Conversion events

#### Monthly - Ongoing Optimization
- [ ] Review top performing pages
- [ ] Check for crawl errors
- [ ] Update content based on search queries
- [ ] Add new pages/content
- [ ] Monitor Core Web Vitals

---

## 🎯 Success Metrics Checklist

### SEO Success (30 Days)
- [ ] All pages indexed in Google
- [ ] Sitemap successfully processed
- [ ] Rich snippets appearing in search
- [ ] +100 daily impressions in Search Console
- [ ] Position in top 50 for "credential monitoring"

### UX Success (7 Days)
- [ ] Mobile bounce rate < 50%
- [ ] Average session duration > 1 minute
- [ ] Pages per session > 2
- [ ] Mobile navigation works perfectly

### Accessibility Success (Immediate)
- [ ] WAVE scan: 0 errors
- [ ] Lighthouse Accessibility: 95+
- [ ] Keyboard navigation: 100% functional
- [ ] Screen reader compatible

### Performance Success (7 Days)  
- [ ] Lighthouse Performance: 90+
- [ ] Largest Contentful Paint: < 2.5s
- [ ] First Input Delay: < 100ms
- [ ] Cumulative Layout Shift: < 0.1

---

## 🆘 Troubleshooting

### Google Analytics Not Tracking?
**Check:**
1. Is the site in production mode? (Analytics disabled in dev)
2. Is ad blocker disabled?
3. Wait 24-48 hours for data to appear
4. Check browser console for errors

**Solution:**
```bash
# Build production version locally to test
npm run build
npm run start
# Visit http://localhost:3000
# Open GA Real-Time report
```

### Pages Not Indexed?
**Check:**
1. Is robots.txt allowing Google? ✅ (already configured)
2. Is sitemap submitted? (do step 3 above)
3. Wait 1-2 weeks for initial indexing
4. Check "Coverage" in Search Console for errors

### Social Preview Not Showing?
**Check:**
1. Are images created and in `/public/`?
2. Are images exactly 1200x630px?
3. Clear Facebook/Twitter cache:
   - Facebook: Use Sharing Debugger "Scrape Again"
   - Twitter: Add ?v=2 to URL when testing

### Mobile Menu Not Working?
**Check:**
1. Is JavaScript enabled?
2. Try clearing browser cache
3. Test in different browser
4. Check browser console for errors

---

## 🎨 Image Creation Quick Guide

### Using Canva (Recommended for Quick Setup)

1. **Go to Canva.com** (free account works)

2. **Create Custom Size:**
   - Click "Create a design"
   - Custom size: 1200 x 630 px

3. **Design Your Image:**
   - Add LeakJar logo (upload if you have)
   - Add background gradient (gray/blue)
   - Add text: "LeakJar - Proactive Credential Monitoring"
   - Add subtext: "Monitor 60B+ leaked credentials in real-time"
   - Add shield icon or security imagery

4. **Export:**
   - Download as PNG
   - Save 3 copies:
     - `og-image.png` (for Open Graph)
     - `twitter-image.png` (for Twitter)
     - Create square version as `logo.png` (512x512)

5. **Place in `/public/` folder**

---

## 📞 Support & Resources

### Documentation
- Main guide: `IMPLEMENTATION_SUMMARY.md`
- This file: `QUICK_SETUP.md`

### Testing Tools
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WAVE Accessibility](https://wave.webaim.org/)

### Learning Resources
- [Google SEO Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Web.dev](https://web.dev/) - Performance & best practices
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

## ✅ Deployment Checklist

Before deploying to production:

### Pre-Deployment
- [ ] All tests passing locally
- [ ] No console errors
- [ ] Mobile menu works
- [ ] Toast notifications work
- [ ] Videos load properly

### Post-Deployment  
- [ ] Site is live and accessible
- [ ] Social images created and uploaded
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] GA4 tracking verified (Real-Time report)
- [ ] Test all critical pages
- [ ] Share on social media to test previews

### Week 1 After Deployment
- [ ] Check Search Console daily
- [ ] Monitor GA for errors
- [ ] Watch for crawl issues
- [ ] Review Core Web Vitals
- [ ] Gather user feedback

---

**Your GA4 ID:** `G-E7LNSKYVTQ` ✅ Already configured!

**Status:** Ready for production deployment once social images are added! 🚀

---

*Last Updated: November 4, 2025*

