# 🌹 Ese Luxury Cosmetics — Full-Stack Platform

A complete luxury e-commerce platform for cosmetics, built with React 18 + Express + MySQL.

---

## 🏗️ Architecture

```
┌─────────────────────┬──────────────────────┬─────────────────────┐
│   React SPA         │   Express API         │   Background Jobs   │
│  Landing + User     │   (Node.js ESM)       │   BullMQ + Cron     │
│  + Admin Panel      │                       │                     │
├─────────────────────┴──────────────────────┴─────────────────────┤
│               MySQL + Prisma ORM                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ese-luxury/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Full DB schema (18 models)
│   ├── src/
│   │   ├── server.js              # Entry point
│   │   ├── app.js                 # Express app, all routes mounted
│   │   ├── scripts/
│   │   │   └── seedAdmin.js       # Seeds the SUPER_ADMIN account
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # Register/Login OTP flow
│   │   │   ├── product.controller.js   # Catalog with full filters
│   │   │   └── order.controller.js     # Orders + Korapay
│   │   ├── routes/                # 14 route files
│   │   ├── middleware/            # auth, error, validate
│   │   ├── services/
│   │   │   ├── sms.service.js     # TextBee SMS OTP
│   │   │   └── korapay.service.js # Payment gateway
│   │   ├── jobs/
│   │   │   ├── queues.js          # BullMQ queue definitions
│   │   │   ├── worker.js          # OTP, Order, Image workers
│   │   │   └── cron.js            # 7 scheduled maintenance jobs
│   │   └── utils/                 # JWT, OTP, DB, Redis, Logger
│   └── .env.example
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx                # Full router (30+ routes)
        ├── main.jsx
        ├── lib/api.js             # Axios + all API helpers
        ├── store/
        │   ├── auth.store.js      # Zustand auth + persist
        │   └── cart.store.js      # Zustand cart + UI
        ├── components/
        │   ├── layout/            # Navbar, Footer, AdminLayout, AuthLayout
        │   ├── auth/              # ProtectedRoute, AdminRoute
        │   ├── shop/              # ProductCard, CartDrawer, SearchModal
        │   ├── home/              # Hero, CategoryBar, Promos, Testimonials
        │   └── ui/                # WhatsApp, Skeleton, Pagination
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── ShopPage.jsx       # Full filter sidebar + URL params
        │   ├── ProductPage.jsx    # Gallery, variants, reviews
        │   ├── CheckoutPage.jsx   # 4-step wizard + Korapay
        │   ├── auth/              # Login, Register, OTP, ForgotPassword
        │   ├── user/              # Account, Orders, Wishlist, Loyalty
        │   └── admin/             # Dashboard, Products, Orders, + 10 more
        └── styles/
            ├── globals.css        # Full design system (3,000+ lines)
            └── admin.css          # Admin-specific styles
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8
No Redis required.

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DB, Redis, TextBee, Korapay credentials

npm install
npx prisma migrate dev --name init
npx prisma generate

# Create the default super-admin account
npm run seed

# Development
npm run dev

# Workers (separate process)
npm run worker
```

### Admin Seed Credentials

The seed script creates or updates this super-admin account:

- Email: admin.esecosmetics.beauty
- Password: Great gamer23
- Phone: 0550154253
- Role: SUPER_ADMIN

Run `npm run seed` after migrations to ensure the admin login exists.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 🎯 Quick Start with Scripts

The project includes automated startup scripts for Windows:

```bash
# Start all servers (backend + frontend)
.\start-dev.bat

# Stop all servers
.\stop-dev.bat

# Restart all servers
.\restart-dev.bat

# Or use PowerShell scripts
powershell -ExecutionPolicy Bypass -File .\start.ps1
powershell -ExecutionPolicy Bypass -File .\stop.ps1
```

**Manual start if scripts fail:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Access points:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin Panel: http://localhost:5173/admin

The admin dashboard is available under `/admin` once an admin user is authenticated.

---

## 🚀 GitHub Deployment Setup

### ⚠️ Important Notes for GitHub Deployment

**This project is ready for GitHub with the following considerations:**

1. **✅ Images Included:** Product images in `backend/uploads/` are included in the repository
2. **✅ Source Code:** All code is production-ready
3. **⚠️ Database Data:** Needs to be seeded from exported data
4. **⚠️ Environment Variables:** Copy `.env.example` to `.env`

### 📋 GitHub Setup Instructions

#### **Step 1: Clone the Repository**
```bash
git clone <your-repo-url>
cd Ese-Luxury-Spa
```

#### **Step 2: Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### **Step 3: Setup Environment Variables**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

#### **Step 4: Start MySQL Database**
```bash
# Start MySQL with Docker
docker-compose up -d mysql
```

#### **Step 5: Run Database Migrations**
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

#### **Step 6: Seed Database with Sample Data**
```bash
# If you have exported data from another installation to add products
.\seed-data.bat

# Or create the default admin account
npm run seed
```

#### **Step 7: Start the Application**
```bash
# Use the startup scripts
.\start-dev.bat

# Or start manually
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### 🎯 Data Export/Import Scripts

**If you want to move data between installations:**

```bash
# Export data from current installation
.\export-data.bat

# Import data to new installation
.\seed-data.bat
```

### 📦 What's Included in GitHub

**✅ Included:**
- All source code
- Product images in `backend/uploads/`
- Database schema (Prisma schema)
- Startup scripts
- Documentation

**❌ Not Included (Security):**
- `.env` files (use `.env.example`)
- `node_modules/` (install with npm)
- Live database data (use seed scripts)

### 🔧 Customization for Your Environment

1. **Update Database URL** in `backend/.env`
2. **Update Frontend URL** in `backend/.env` if needed
3. **Configure API Keys** for TextBee SMS and Korapay payments
4. **Update JWT secrets** for production security

### 🌐 Production Deployment

For production deployment, consider:

1. **Cloud Storage:** Move images to AWS S3, Cloudinary, or similar
2. **Database:** Use managed MySQL service (AWS RDS, DigitalOcean, etc.)
3. **Environment Variables:** Use secure environment variable management
4. **SSL/HTTPS:** Enable SSL for secure connections
5. **Process Management:** Use PM2 or similar for production process management

---

## 🔑 Environment Variables (backend/.env)

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | MySQL connection string |
| `REDIS_URL` | (removed) |
| `JWT_ACCESS_SECRET` | Min 32 chars, random |
| `JWT_REFRESH_SECRET` | Min 32 chars, different |
| `TEXTBEE_API_KEY` | TextBee SMS API key |
| `TEXTBEE_DEVICE_ID` | TextBee device ID |
| `KORAPAY_PUBLIC_KEY` | Korapay public key (pk_live_...) |
| `KORAPAY_SECRET_KEY` | Korapay secret key (sk_live_...) |
| `KORAPAY_WEBHOOK_SECRET` | Webhook verification secret |
| `FRONTEND_URL` | e.g. http://localhost:5173 |

---

## 📡 API Routes

```
POST   /api/v1/auth/register              Phone register → OTP
POST   /api/v1/auth/verify-registration   Verify OTP → JWT
POST   /api/v1/auth/login                 Phone login → OTP
POST   /api/v1/auth/verify-login          Verify OTP → JWT
POST   /api/v1/auth/refresh               Rotate refresh token
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

GET    /api/v1/products                   List with filters
GET    /api/v1/products/:slug             Single product
GET    /api/v1/products/:id/related
POST   /api/v1/products                   Admin: create
PUT    /api/v1/products/:id              Admin: update
DELETE /api/v1/products/:id              Admin: soft delete

GET    /api/v1/categories
GET    /api/v1/brands
POST   /api/v1/cart/add
GET    /api/v1/cart
PATCH  /api/v1/cart/:id
DELETE /api/v1/cart/:id

POST   /api/v1/orders                     Create + init Korapay
GET    /api/v1/orders/verify/:reference   Verify payment
GET    /api/v1/orders                     User orders
GET    /api/v1/orders/:id
POST   /api/v1/orders/:id/cancel

GET    /api/v1/wishlist
POST   /api/v1/wishlist/toggle

POST   /api/v1/coupons/validate
GET    /api/v1/users/profile
PATCH  /api/v1/users/profile
GET    /api/v1/users/loyalty

POST   /api/v1/payments/webhook           Korapay webhook

GET    /api/v1/admin/dashboard            Analytics
GET    /api/v1/admin/customers
GET    /api/v1/admin/inventory
GET    /api/v1/orders/admin/all
PATCH  /api/v1/orders/admin/:id/status

GET    /api/v1/cms/banners
GET    /api/v1/cms/testimonials
GET    /api/v1/cms/settings
POST   /api/v1/cms/newsletter/subscribe

POST   /api/v1/upload/product
POST   /api/v1/upload/avatar
POST   /api/v1/upload/banner
```

---

## ⚙️ Background Jobs

### BullMQ Workers
| Queue | Jobs |
|-------|------|
| `otp` | Send SMS OTP via TextBee |
| `orders` | Order confirmation SMS, status update SMS, update totalSold |
| `images` | Resize to lg/md/sm WebP via sharp |

### Cron Jobs
| Schedule | Task |
|----------|------|
| Every 15min | Clean expired OTPs |
| Daily 2am | Clean expired refresh tokens |
| Every 30min | Recalculate product ratings |
| Every hour | Auto-cancel unpaid orders > 24h |
| Monthly | Expire loyalty points > 12 months |
| Weekly | Clean old recently-viewed records |
| Every 5min | Cache warmup (Redis removed) |

---

## 💳 Payment Flow

1. User places order → `POST /api/v1/orders`
2. Server creates order record + calls Korapay `charges/initialize`
3. Response includes `checkout_url` → frontend redirects user
4. Korapay sends webhook `charge.success` → `/api/v1/payments/webhook`
5. Webhook verifies signature, marks order PAID, queues SMS notification
6. User also redirected to `/orders/:id/confirmation?reference=...`
7. Confirmation page calls `/api/v1/orders/verify/:reference` as fallback

---

## 🎨 Design System

**Fonts:** Playfair Display + Poppins  
**Primary:** `#B76E79` (Rose Gold)  
**Accent:** `#D4A373` (Gold)  
**Pink tint:** `#F8BBD0`, `#FCE4EC`  
**Dark:** `#111111`

CSS variables in `src/styles/globals.css` cover spacing, radii, shadows, transitions.

---

## 🔐 Auth System

- SMS OTP only (no passwords) via TextBee
- 6-digit OTP, 10 min expiry, max 5 attempts, 60s resend cooldown
- JWT Access Token (15min) + Refresh Token (30d)
- Refresh token rotation on every use
- Role: `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`

---

## 🏆 Loyalty System

- Earn 1 point per ₵1 spent
- 2 points = ₵1 discount
- 500 bonus points for referrals
- Points expire after 12 months

---

## 🛡️ Production Checklist

- [ ] Set strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Configure Korapay live keys
- [ ] Set up TextBee device
- [ ] Set `NODE_ENV=production`
- [ ] Run `npx prisma migrate deploy`
- [ ] Set up Redis with password
- [ ] Configure `FRONTEND_URL` for CORS
- [ ] Add Korapay webhook URL in dashboard
- [ ] Set up PM2 for API + Worker processes
- [ ] Configure Nginx reverse proxy
- [ ] Enable HTTPS with SSL certificate
