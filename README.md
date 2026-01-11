# ASHMARK - Premium T-Shirt E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js for selling premium t-shirts. ASHMARK provides a seamless shopping experience with comprehensive features for both customers and administrators.

🌐 **Live Demo**: [https://ashmark.vercel.app/](https://ashmark.vercel.app/)

> 💡 **Test Admin Access**: Email: `testadmin@gmail.com` | Password: `testadmin1234`

![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.17.1-2D3748)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1)

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog** - Browse products with filtering, search, and category navigation
- 🛒 **Shopping Cart** - Add items with size and color selection
- ❤️ **Wishlist** - Save favorite products for later
- 💳 **Secure Payments** - Integrated Razorpay payment gateway
- 📦 **Order Management** - Track orders with real-time status updates
- ⭐ **Product Reviews** - Rate and review products
- 🎟️ **Promo Codes** - Apply discount codes at checkout
- 📍 **Address Management** - Save multiple shipping addresses
- 👤 **User Profile** - Manage account settings and preferences
- 📱 **Responsive Design** - Optimized for all devices

### Admin Features
- 📊 **Dashboard** - View sales statistics and analytics
- 📦 **Product Management** - Add, edit, and manage products with images
- 📋 **Order Management** - Process and track customer orders
- 👥 **User Management** - Manage user roles and permissions
- 📈 **Sales Reports** - Export order data and view statistics

## 🚀 Tech Stack

- **Framework**: [Next.js 15.5.5](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: MySQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Google OAuth
- **Payment**: [Razorpay](https://razorpay.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **File Upload**: [UploadThing](https://uploadthing.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- MySQL database account
- [Git](https://git-scm.com/)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshsrivastava05/ashmark.git
   cd ashmark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database (MySQL)
   DATABASE_URL="mysql://user:password@host:port/database"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Razorpay
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
   
   # UploadThing
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Push schema to database
   npm run prisma:push
   ```

5. **Seed the database (optional)**
   ```bash
   # Seed categories
   node scripts/seed-categories.js
   
   # Seed sample products
   node scripts/seed-sample-products.js
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Test Credentials

For testing the admin features, you can use the following test admin account:

**Admin Account:**
- **Email**: `testadmin@gmail.com`
- **Password**: `testadmin1234`

> ⚠️ **Note**: These are test credentials for development/demo purposes. Make sure to change or disable these credentials in production environments.

## 📁 Project Structure

```
ashmark/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
├── scripts/                    # Database seeding scripts
├── src/
│   ├── app/                   # Next.js app router pages
│   │   ├── (auth)/           # Authentication pages
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── api/              # API routes
│   │   └── ...               # Other pages
│   ├── components/           # React components
│   │   ├── admin/           # Admin components
│   │   ├── cart/            # Cart components
│   │   ├── checkout/        # Checkout components
│   │   ├── layout/          # Layout components
│   │   ├── product/         # Product components
│   │   ├── profile/         # Profile components
│   │   └── ui/              # UI components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── components.json           # shadcn/ui configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json            # Dependencies
```

## 🗄️ Database Schema

The application uses Prisma ORM with MySQL. Key models include:

- **User** - User accounts and authentication
- **Product** - Product catalog with images, sizes, and colors
- **Category** - Product categories
- **Order** - Customer orders with status tracking
- **CartItem** - Shopping cart items
- **WishlistItem** - User wishlist
- **Review** - Product reviews and ratings
- **Address** - User shipping addresses
- **PromoCodeUsage** - Promo code tracking

## 🔐 Authentication

The application uses NextAuth.js for authentication with:
- Email/Password authentication
- **Google OAuth** - Sign in with Google account
- Session management
- Role-based access control (USER, ADMIN)

## 💳 Payment Integration

Payment processing is handled through Razorpay:
- Secure payment gateway
- Order creation and verification
- Payment status tracking
- Support for multiple payment methods

## 🎨 UI Components

Built with Radix UI and styled with Tailwind CSS:
- Accessible components
- Dark mode support (via next-themes)
- Responsive design
- Custom animations

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to database

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- AWS
- Google Cloud Platform
- DigitalOcean
- Railway
- Render

Make sure to:
- Set up a MySQL database
- Configure all environment variables
- Run database migrations
- Set up UploadThing account for file uploads
- Configure Google OAuth credentials

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Harsh Srivastava**


- GitHub: [@harshsrivastava05](https://github.com/harshsrivastava05)
- Live Demo: [https://ashmark.vercel.app/](https://ashmark.vercel.app/)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

For support, email support@ashmark.com or open an issue in the repository.

---

Made with ❤️ by ASHMARK Team

