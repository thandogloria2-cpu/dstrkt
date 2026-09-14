# DSTRKT - Premium Carry Culture

![DSTRKT](https://img.shields.io/badge/DSTRKT-Premium%20Duffel%20Bags-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-93.6%25-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

DSTRKT is a premium e-commerce platform featuring exclusive limited edition duffel bags with pop culture, anime, and gaming-inspired wearable art canvas prints.

## 🎨 Features

- **Premium Product Catalog** - Hand-curated collection of limited edition duffel bags
- **Dark-Themed Editorial Design** - Modern, luxury-focused UI/UX
- **Secure Payment Processing** - PayPal integration with Checkout Server SDK
- **User Authentication** - Supabase Auth for member management
- **Real-time Database** - Supabase for product and order management
- **Vault System** - Exclusive members-only drops and limited releases
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Framer Motion for engaging interactions
- **SEO Optimized** - React Helmet Async for dynamic meta tags

## 🛠️ Tech Stack

**Frontend:**
- React 18.2.0
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS
- Framer Motion 11.0.24
- React Router DOM 6.22.3

**Backend & Services:**
- Express.js 5.2.1
- Supabase (Auth + Database + Storage)
- PayPal Checkout SDK
- Google Gemini API

**Development Tools:**
- ESLint & TypeScript for code quality
- Vite for fast development and optimized builds

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/thandogloria2-cpu/dstrkt.git
   cd dstrkt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your credentials:
   - PayPal Client ID
   - Gemini API Key
   - Supabase URL and Anon Key

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Build & Deployment

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Type checking:**
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Home.tsx           # Hero section & featured products
│   ├── Collections.tsx     # Main product catalog
│   ├── Vault.tsx          # Exclusive members-only collection
│   ├── PrivateShop.tsx    # Authenticated vault shop
│   ├── ProductDetail.tsx  # Individual product pages
│   ├── Checkout.tsx       # Payment & order processing
│   ├── Profile.tsx        # User profile & authentication
│   ├── Orders.tsx         # Order tracking & history
│   ├── Journal.tsx        # Blog/articles section
│   └── Culture.tsx        # Brand philosophy & culture
├── CartContext.tsx         # Shopping cart state management
├── constants.ts            # Product data & configuration
├── types.ts                # TypeScript interfaces
├── supabase.ts             # Supabase client setup
├── SEO.tsx                 # SEO component
├── App.tsx                 # Main app component
└── index.tsx               # React DOM render
```

## 🔑 Key Features

### 1. Product Management
- Curated collection with detailed product pages
- Gallery views with multiple product angles
- Stock management and availability tracking
- Limited edition status indicators

### 2. Authentication & Authorization
- Email/password authentication
- Google OAuth integration
- User profile management
- Member-only content access
- Vault clearance levels

### 3. E-commerce
- Shopping cart with persistent storage
- Secure PayPal checkout
- Order confirmation and tracking
- Guest checkout support
- Complimentary express shipping

### 4. Vault System
- Exclusive drops for verified members
- Upcoming release announcements
- Limited stock items
- Member-only pricing
- Release history and archives

### 5. Content Management
- Dynamic product gallery
- Culture/brand editorial content
- Journal/blog articles
- Search and filtering capabilities

## 🎯 Configuration

### Environment Variables

```env
# Payment Processing
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# AI Integration
VITE_GEMINI_API_KEY=your_gemini_api_key

# Database & Authentication
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Environment
NODE_ENV=development|production
```

## 📊 Analytics & SEO

- Google Analytics integration (GTM)
- Meta tags optimization
- Schema markup for product pages
- Sitemap and robots.txt
- Open Graph support for social sharing

## 🔒 Security

- End-to-end encryption for sensitive data
- Secure authentication with Supabase
- PayPal PCI compliance
- Environment variable protection
- CORS configuration for API safety
- Content Security Policy headers

## 🌐 Supported Markets

- United States 🇺🇸
- United Kingdom 🇬🇧
- Europe 🇪🇺
- South Africa 🇿🇦
- Global shipping available

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚦 Performance

- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- Image optimization with lazy loading
- Code splitting for route-based chunks
- CSS-in-JS with Tailwind for minimal bundle

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Changelog

### Version 1.0.0 (Current)
- ✨ Initial premium launch
- 🎨 Dark-themed editorial design
- 🛍️ Full e-commerce functionality
- 👥 Member authentication system
- 💎 Vault exclusive drops system
- 📦 Order tracking and management

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

## 📞 Support

**Website:** [https://dstrkt.co.za](https://dstrkt.co.za)

**Contact:** support@dstrkt.co.za

**Social Media:**
- Instagram: [@dstrkt00](https://instagram.com/dstrkt00)
- Twitter/X: [@DSTRKT00](https://twitter.com/DSTRKT00)

## 🙏 Acknowledgments

- Inspired by urban culture and carry culture community
- Premium craftsmanship and wearable art
- Global logistics and fulfillment partnerships
- Community feedback and support

---

**Made with ❤️ by DSTRKT Global | Built for the bold.**
