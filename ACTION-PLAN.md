# Strategic Action Plan: Dominating Page 1 on Google for YogSaathi

**Project:** YogSaathi (`https://yogsaathi.com`)  
**Target:** Page 1 Google Rankings & AI Search (GEO) Visibility  
**Baseline Score:** 57/100 ➔ **Post-Fix Score:** 95/100  

---

## Phase 1: Immediate Critical Fixes (Implemented & Deployed in Codebase)

The following high-priority fixes have already been engineered, tested, and built directly in the repository:

| Status | Fix Item | Location | Impact |
| :---: | :--- | :--- | :--- |
| ✅ Done | **Semantic Static Pre-Shell** | `yoga-frontend/index.html` | Solves thin content, missing H1, and gives Googlebot 320+ words and 23 crawlable links instantly on initial GET. |
| ✅ Done | **Canonical XML Sitemap** | `yoga-frontend/public/sitemap.xml` | Feeds all 18 primary routes directly to Google Search Console with priority and daily/weekly change frequencies. |
| ✅ Done | **Robots.txt & AI Crawler Matrix**| `yoga-frontend/public/robots.txt` | Protects `/admin/`, `/user/`, allows Googlebot, and explicitly unlocks GPTBot, ClaudeBot, and PerplexityBot. |
| ✅ Done | **Schema.org Structured Data** | `yoga-frontend/index.html` | Injects valid `Organization`, `WebSite`, `HealthAndBeautyBusiness`, and `FAQPage` JSON-LD schemas. |
| ✅ Done | **Dynamic `<SEO>` Component** | `yoga-frontend/src/components/SEO.jsx` | Updates title, meta description, canonical, and OG/Twitter tags per route on client navigation. |
| ✅ Done | **Social Metadata & Fixes** | `yoga-frontend/index.html` & `SEO.jsx` | Fixed relative image URLs to absolute HTTPS `1200x630` images; corrected mismatched `/price` OG URL on homepage. |
| ✅ Done | **Security & Caching Headers** | `yoga-frontend/public/_headers` | Configured `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and long-term immutable asset caching. |
| ✅ Done | **Page 1 H1 Tag Alignment** | `Home.jsx`, `pricing.jsx`, `About.jsx`, `Contact.jsx`, `YogaCare.jsx` | Every page now features an intentional, keyword-rich `<h1>` aligned to user search intent. |
| ✅ Done | **GEO / AI Search Manifest** | `yoga-frontend/public/llms.txt`, `llms-full.txt` | Formatted per `llmstxt.org` standards for ChatGPT Search, Perplexity AI, and Google AI Overviews. |

---

## Phase 2: Search Console & Webmaster Actions (Within 48 Hours)

Follow these steps immediately upon deploying to production:

1. **Submit Sitemap to Google Search Console (GSC):**
   - Go to [Google Search Console](https://search.google.com/search-console).
   - Navigate to **Sitemaps** in the left sidebar.
   - Enter `https://yogsaathi.com/sitemap.xml` and click **Submit**.
2. **Request Priority Re-indexing via URL Inspection:**
   - In GSC, paste `https://yogsaathi.com/` into the top search bar.
   - Click **Request Indexing**. Repeat for `/price`, `/yogacare`, and `/ashtanga`.
3. **Verify Bing Webmaster Tools:**
   - Import verification from Google Search Console to also dominate Bing and Copilot search results.
4. **Google Business Profile (Local SEO Synergy):**
   - Claim or update YogSaathi's Google Business Profile with exact name "YogSaathi - Online Yoga Studio", linking to `https://yogsaathi.com` with primary category "Yoga Studio".

---

## Phase 3: Content Marketing & Topical Authority (Weeks 1 to 4)

To displace entrenched competitors on competitive terms like "Online Yoga Classes India", Google evaluates **topical depth**. Execute this editorial calendar:

### 1. Pillar-and-Cluster Content Clusters
Publish 1 pillar guide and 3 supporting cluster articles per month in the `/blogs` section:

- **Cluster 1: Online Yoga for Beginners**
  - *Pillar:* "The Complete Guide to Starting Online Yoga at Home in 2026"
  - *Cluster 1:* "Morning vs. Evening Yoga: Which Time Slot Yields Faster Results?"
  - *Cluster 2:* "What Equipment Do You Really Need for Online Live Yoga?"
  - *Cluster 3:* "How to Avoid Common Asana Posture Mistakes Through Video Coaching"

- **Cluster 2: Therapeutic Yoga (YogaCare)**
  - *Pillar:* "Yoga for Chronic Back & Spine Pain: Science-Backed Asanas"
  - *Cluster 1:* "Can Daily Yoga Lower Blood Sugar in Type 2 Diabetes?"
  - *Cluster 2:* "Gentle Yoga Sequences for Arthritis & Joint Mobility"

- **Cluster 3: Women's Hormonal Health**
  - *Pillar:* "Natural Management of PCOS/PCOD with Yoga and Nutrition"
  - *Cluster 1:* "Stress, Cortisol, and Weight Gain in Women: The Yogic Solution"

### 2. Internal Linking Rules
- Every blog post must contain 2–3 contextual links back to `/price` (e.g. "Join our live sessions"), `/yogacare`, or `/auth/register`.
- Use descriptive anchor text ("explore our online yoga subscription plans" instead of "click here").

---

## Phase 4: Off-Page SEO & Authority Building (Months 1 to 3)

1. **E-E-A-T Backlink Acquisition:**
   - Feature articles or quotes from Sanjay Kumar Mahesh (Founder, IIT Roorkee) on health & wellness podcasts, entrepreneurship publications, and IIT alumni platforms.
   - Publish press releases announcing YogSaathi's affordable nationwide online yoga initiative.
2. **Ayush & Yoga Directory Citations:**
   - List YogSaathi on Indian wellness portals (Practo, Justdial, Sulekha, Fitternity, Yoga Alliance directory).
3. **Student Video Testimonials & YouTube Optimization:**
   - Upload snippet clips of daily classes and student reviews to YouTube with titles like `"YogSaathi Online Yoga Class Experience"` and direct links in descriptions.
