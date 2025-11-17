# Signup Pages Guide

## Overview
You now have **two separate signup pages** with different messaging and purposes:

---

## 1. Normal Signup Page
**Route:** `/auth/signup`  
**File:** `app/auth/signup/page.tsx`

### Purpose
Generic account creation page without free tier emphasis. Suitable for general marketing and professional contexts.

### Key Features
- **Title:** "Create Your Account"
- **Subtitle:** "Join LeakJar and start monitoring credential breaches"
- **Button:** "Create Account"
- **Right Panel Highlights:**
  - Real-Time Breach Detection
  - HUMINT Intelligence Network
  - Comprehensive Analytics
  - API Integration
  - Stats: 50B+ Records, 24/7 Monitoring, <1hr Alert Delivery

### Best Used For
- General marketing materials
- Professional documentation
- Email campaigns
- Default signup flow
- Users who prefer less emphasis on "free trial"

---

## 2. Free Tier Signup Page
**Route:** `/auth/freetier`  
**File:** `app/auth/freetier/page.tsx`

### Purpose
Emphasis on free trial with no credit card required. Best for conversion-focused marketing.

### Key Features
- **Title:** "Start Your Free Trial"
- **Subtitle:** "No credit card required • Full feature access"
- **Button:** "Create Free Account"
- **Right Panel Highlights:**
  - Full Feature Access (latest 5 breach records)
  - Instant Setup
  - No Credit Card Required
  - What You'll Get box with specific features

### Best Used For
- Landing pages
- Pricing page "Start Free" buttons
- Free trial promotions
- High-conversion marketing campaigns
- Trial-focused email campaigns

---

## Current Link References

The following files currently link to `/auth/signup` (which is now the **normal signup page**):

### Marketing Pages
- `app/pricing/page.tsx` - Pricing page CTAs
- `app/features/page.tsx` - Features page CTAs
- `app/landing/page.tsx` - Landing page
- `app/page.tsx` - Home page
- `app/about/page.tsx` - About page

### Compliance Pages
- `app/gdpr-compliance/page.tsx`
- `app/ccpa-compliance/page.tsx`
- `app/hipaa-compliance/page.tsx`
- `app/nist-compliance/page.tsx`
- `app/pci-compliance/page.tsx`
- `app/nist-ai-rmf/page.tsx`
- `app/ai-act-compliance/page.tsx`

### Navigation Components
- `components/shared-header.tsx` - Header navigation
- `components/shared-footer.tsx` - Footer links
- `components/mobile-nav.tsx` - Mobile navigation

### Other Pages
- `app/solutions/page.tsx`
- `app/developer/page.tsx`
- `app/hello/page.tsx`
- `app/open-search/[domain]/page.tsx`
- `app/auth/login/page.tsx` - "Create new account" link
- `app/auth/required/page.tsx`

---

## Recommendations

### Option 1: Keep Current Setup (Recommended)
- `/auth/signup` → Normal signup (professional, general use)
- `/auth/freetier` → Free trial signup (marketing, conversions)

**Use this if:**
- You want a professional default signup experience
- Free tier is one option among paid plans
- You prefer to manually choose which pages use which signup

### Option 2: Swap Routes (If you prefer free tier as default)
You could update links that should emphasize "free trial" to point to `/auth/freetier` instead, such as:
- Pricing page "Start Free" buttons
- Landing page CTAs
- Feature page trial buttons

### Suggested Updates
Consider changing these specific links to `/auth/freetier`:

**High Priority (Free tier emphasis makes sense):**
```
app/pricing/page.tsx → Line 259, 408, 411
app/landing/page.tsx → Line 58, 119, 327
app/features/page.tsx → Line 58, 618
```

**Keep as `/auth/signup` (Professional context):**
- All compliance pages (GDPR, HIPAA, etc.)
- Developer page
- Solutions page
- Navigation components (let users choose)

---

## Technical Details

### Both Pages Include
✅ Modern two-column split layout  
✅ Responsive design (mobile-first)  
✅ Input validation (password matching, min length)  
✅ Email verification flow  
✅ Error/success message handling  
✅ Icon-enhanced input fields  
✅ Security scans passed (no vulnerabilities)  
✅ Linter clean (no code issues)  

### Same Authentication Logic
Both pages use identical authentication logic:
- Supabase signup
- Email verification required
- Redirect to login after 3 seconds
- Same password requirements

### Design Consistency
Both pages maintain LeakJar's brand identity:
- Gray-700/800/900 color palette
- Professional gradient backgrounds
- Modern card design with shadows
- Consistent typography and spacing

---

## Next Steps

1. **Review Current Links:** Decide which pages should use which signup flow
2. **Update Marketing Materials:** Point free trial campaigns to `/auth/freetier`
3. **Test Both Flows:** Ensure both signup pages work correctly
4. **Monitor Conversions:** Track which page performs better for different audiences

---

## Quick Reference

| Need | Use This Route |
|------|----------------|
| Generic signup | `/auth/signup` |
| Free trial emphasis | `/auth/freetier` |
| Professional context | `/auth/signup` |
| Marketing campaign | `/auth/freetier` |
| Pricing page "free" CTA | `/auth/freetier` |
| Navigation signup link | `/auth/signup` |
| Compliance page CTA | `/auth/signup` |

---

**Created:** November 4, 2025  
**Status:** ✅ Both pages tested and security scanned

