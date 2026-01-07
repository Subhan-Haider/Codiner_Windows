# Codiner Website

This is the marketing website for Codiner, the flexible, local, open-source AI app builder.

## Overview

The website is built as a single-page application using:
- **HTML5** with semantic markup
- **Tailwind CSS** for styling (via CDN)
- **Custom CSS** for gradients and animations
- **Vanilla JavaScript** for simple interactions

## Structure

```
website/
├── index.html          # Main website with all sections
├── logo.png           # Codiner logo
├── favicon.ico        # Website favicon
└── README.md          # This file
```

## Sections

1. **Navigation** - Fixed header with main links
2. **Hero** - Main call-to-action with download buttons
3. **Features** - Key features (Limitless, Local)
4. **Testimonials** - User feedback and reviews
5. **Community** - Community links and ambassadors
6. **Newsletter** - Email subscription signup
7. **Plans** - Pricing tiers (Free, Pro, Max)
8. **Creator** - Meet the creator section
9. **FAQ** - Frequently asked questions
10. **Footer** - Links and company information

## Customization

### Colors
The website uses a blue-to-purple gradient theme. Colors can be customized in the Tailwind config in `index.html`:

```javascript
theme: {
    extend: {
        colors: {
            'codiner-blue': '#3b82f6',
            'codiner-dark': '#1e293b',
            'codiner-light': '#f8fafc'
        }
    }
}
```

### Content
Update the following sections to match your branding:
- Company name: "Codiner"
- Tagline: "Flexible, local, open-source AI app builder"
- Creator information
- Pricing details
- Social links
- Contact information

### Images
Replace placeholder images:
- `/logo.png` - Company logo
- `favicon.ico` - Browser favicon
- Profile images in testimonials and creator section

## Deployment

### Local Development
Open `index.html` directly in a browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### Production Deployment
Deploy to any static hosting service:
- **Netlify** - Drag and drop deployment
- **Vercel** - Git-based deployment
- **GitHub Pages** - Free hosting for open source
- **AWS S3 + CloudFront** - Scalable hosting

## Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop breakpoints
- Touch-friendly interactions

### Performance
- Lightweight (no frameworks)
- Optimized images
- Fast loading times

### SEO Ready
- Semantic HTML structure
- Meta tags for social sharing
- Structured content

### Accessibility
- WCAG compliant markup
- Keyboard navigation
- Screen reader friendly

## Analytics

Add your analytics tracking by including the appropriate scripts before the closing `</body>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## Maintenance

### Content Updates
- Update testimonials regularly
- Keep pricing information current
- Refresh feature descriptions as product evolves

### Technical Updates
- Monitor browser compatibility
- Update dependencies (Tailwind CSS)
- Optimize images and performance

## Support

For questions about the website:
- Check the main Codiner repository
- Open an issue for bugs or improvements
- Contact the development team

---

**Built for Codiner - The future of AI-powered app development** 🚀
