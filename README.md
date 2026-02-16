# AeroNex Labs – AeroMist

Modern, AeroGarden-inspired landing page for **AeroMist**: a smart indoor aeroponic growing system. Built with clean HTML, CSS, and vanilla JavaScript.

## Features
- **Hero carousel**: three interactive slides showcasing product, benefits, and mobile app
- **Pricing section**: two product tiers (Starter & Pro) with detailed feature comparison
- **Testimonials**: real feedback from prototype testers with star ratings
- **FAQ accordion**: expandable answers to common questions about aeroponics and AeroMist
- **Contact form**: fully functional form with validation and status feedback
- **Scroll-triggered animations**: progressive reveals as users scroll
- **Feature grid**: expanding cards for technical specifications
- **App screen gallery**: horizontal carousel with navigation and focus states
- **Responsive design**: mobile-first, with hamburger menu on small screens
- **Accessibility-ready**: semantic HTML, ARIA attributes, skip links, keyboard navigation

## Tech Stack
- HTML5, CSS (custom properties, Grid, Flexbox)
- Vanilla JavaScript (no frameworks)
- Custom scroll observer and touch/swipe logic
- Google Fonts: Bebas Neue (display), Outfit (body)
- Form validation and interactive FAQ accordion

## New Sections
- **Pricing** (`#pricing`): Two product tiers with features and pricing
- **Testimonials** (`#testimonials`): Customer feedback from alpha/beta testers
- **FAQ** (`#faq`): Accordion-style frequently asked questions
- **Contact Form** (`#contact`): Professional contact form with validation

## Project Context
Capstone project for Bilkent University course sequence **GE 401 / GE 402** (entrepreneurial process + product development). AeroNex Labs (Team 11) is building a prototype aeroponics system and Android app backed by Firebase.

## Design
- **Brand**: Deep Green (#003D20) + Mist Green (#A0CA77)
- **Inspiration**: Modern hardware startups (AeroGarden, etc.)
- **No stock photos**: only custom illustrations / mockups / own brand assets
- **Modern UI**: Clean cards, hover effects, smooth transitions, and professional typography

## Running Locally

### Method 1: Open from file (easiest)
- Double-click `index.html` → opens in browser

### Method 2: Python local server (recommended)
In terminal, navigate to project folder and run:

```bash
cd /Users/fazligudul/Desktop/WebPage
python3 -m http.server 8000
```

Then open in browser: **http://localhost:8000**

To stop: `Ctrl + C` in terminal

### Method 3: VS Code / Cursor – Live Server
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"
- Page auto-opens and refreshes on file changes

## Structure
```
WebPage/
├── index.html          # Main landing page
├── our-story.html      # Team & values page
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # All JavaScript
├── assets/             # Images, mockups, icons
└── README.md           # This file
```

## Contact Form Integration
The contact form currently shows a demo success message. To integrate with a real backend:

1. Replace the `setTimeout` in `js/main.js` (lines ~285-310) with a real API call
2. Use fetch/XMLHttpRequest to send form data to your endpoint
3. Handle success/error responses accordingly

Example with fetch:
```javascript
fetch('https://your-api-endpoint.com/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
  // Show success message
})
.catch(error => {
  // Show error message
});
```

---

**AeroNex Labs** · Team 11 · Bilkent University GE 401/402
