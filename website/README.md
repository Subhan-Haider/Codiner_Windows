# Codiner Landing Page

This folder contains all the website assets for the Codiner landing page.

## Structure

```
website/
├── assets/           # All website files
│   ├── index.html    # Main landing page
│   ├── favicon.ico   # Website favicon
│   ├── logo.png      # Codiner logo
│   └── README.md     # This file
└── README.md         # Deployment instructions
```

## Development

To run the website locally:

```bash
# Navigate to the website directory
cd website

# Serve the assets folder
python -m http.server 8080

# Or use any static file server
npx serve assets
```

Then visit: http://localhost:8080

## Deployment

The website is designed to be served from the `assets/` folder. You can deploy it to any static hosting service like:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Features

- ✅ Modern, conversion-optimized landing page
- ✅ Responsive design for all devices
- ✅ Accessibility compliant (WCAG standards)
- ✅ Interactive elements and animations
- ✅ Social proof and testimonials
- ✅ Email capture and chat widget
- ✅ SEO optimized
- ✅ Fast loading with optimized assets
