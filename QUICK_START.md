# Quick Start Guide - Légion de Marie (Next.js)

## 🎯 What Was Done

Your project has been successfully migrated from **Vite + React Router + Express** to **Next.js 14** with the modern App Router architecture. The application is now ready for local deployment on any server with Node.js support.

## 📋 Changes Summary

### Framework Upgrade

- ✅ **Vite → Next.js 14** (faster builds, better optimizations)
- ✅ **Express Server → Next.js API Routes** (simpler deployment)
- ✅ **React Router → Next.js App Router** (file-based routing)
- ✅ **Context API** kept for authentication (simplified, no Redux needed)

### Key Files & Directories

```
code/
├── app/                          # Next.js app directory
│   ├── api/                     # API routes (replaces Express)
│   ├── (page folders)/          # Route pages
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── providers.tsx            # Auth context
│   ├── protected-route.tsx      # Route protection wrapper
│   └── middleware.ts            # Auth middleware
├── shared/                       # Shared types & utilities
├── public/                       # Static assets
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript config with path aliases
├── package.json                 # Updated for Next.js
├── DEPLOYMENT.md                # Comprehensive deployment guide
└── README.md                    # Project overview
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd code
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

- Open http://localhost:3000
- Hot reload enabled
- TypeScript checking enabled

### 3. Build for Production

```bash
npm run build
npm start
```

## 🔐 Authentication

### Test Credentials

All demo accounts use password: `demo123`

| Role                     | Email                               |
| ------------------------ | ----------------------------------- |
| President (Council)      | president@legiondemarie.org         |
| Vice-President (Council) | vicepresident@legiondemarie.org     |
| Treasurer (Council)      | tresorier@legiondemarie.org         |
| President (Praesidium)   | president.rosaire@legiondemarie.org |
| Secretary (Praesidium)   | secretaire.stjean@legiondemarie.org |

### How Authentication Works

- Uses **mock authentication** with localStorage (demo)
- Context API manages auth state (`app/providers.tsx`)
- Protected routes require login (`app/protected-route.tsx`)
- Demo uses React Router pattern compatible with Next.js

### For Production

Replace mock auth with:

- [Connect to Supabase](https://www.builder.io/c/docs) for real auth
- Or implement your own auth provider

## 📁 Route Structure

Routes are automatically created from the `app/` directory:

```
app/page.tsx                    → /
app/login/page.tsx              → /login
app/dashboard/page.tsx          → /dashboard
app/zones/page.tsx              → /zones
app/praesidia/page.tsx          → /praesidia
app/members/page.tsx            → /members
app/finances/page.tsx           → /finances
app/api/ping/route.ts           → /api/ping
app/api/demo/route.ts           → /api/demo
```

### Adding a New Page

```bash
# Create folder
mkdir app/my-feature

# Create page file
cat > app/my-feature/page.tsx << 'EOF'
"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";

export default function MyFeaturePage() {
  return (
    <ProtectedRoute>
      <Layout>
        {/* Your content here */}
      </Layout>
    </ProtectedRoute>
  );
}
EOF
```

## 🛠️ Key Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # TypeScript checking
npm run format.fix       # Format code with Prettier
```

## 📦 Tech Stack

| Purpose          | Technology                |
| ---------------- | ------------------------- |
| Framework        | Next.js 14                |
| UI Library       | React 18                  |
| Styling          | Tailwind CSS              |
| UI Components    | Radix UI / shadcn/ui      |
| Icons            | Lucide React              |
| Forms            | React Hook Form           |
| State Management | Context API               |
| Data Fetching    | React Query (setup ready) |
| Charts           | Recharts                  |

## 🚢 Deployment Options

### Option 1: Local Windows Server (WAMP Alternative)

```bash
# Build
npm run build

# Run with PM2 (recommended)
npm install -g pm2
pm2 start "npm start" --name "legion-de-marie"
pm2 startup
pm2 save
```

→ Visit `http://localhost:3000` or your server IP:3000

### Option 2: Docker

```bash
docker build -t legion-de-marie .
docker run -p 3000:3000 legion-de-marie
```

### Option 3: Linux Systemd Service

Create `/etc/systemd/system/legion-de-marie.service` and use systemctl to manage

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔧 Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit as needed:

```env
PORT=3000
NODE_ENV=development
PING_MESSAGE=pong
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Build Fails

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Module Not Found Errors

Check path aliases in `tsconfig.json`:

```json
"paths": {
  "@/*": ["./*"],
  "@app/*": ["./app/*"],
  "@components/*": ["./app/components/*"],
  "@/components/*": ["./app/components/*"],
  "@shared/*": ["./shared/*"]
}
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)
- [React Hook Form](https://react-hook-form.com)
- [Deployment Guide](./DEPLOYMENT.md)
- [README](./README.md)

## ✨ Next Steps

1. **Test the app locally**: `npm run dev`
2. **Review DEPLOYMENT.md** for your deployment scenario
3. **Replace mock auth** with real authentication
4. **Implement database** using Supabase or Neon
5. **Deploy to production**

## 🎓 Notes for Developers

### File Structure

- Client components use `"use client"` directive
- API routes use server-side code
- Components in `app/components/` are typically client-side
- Use absolute imports with `@` aliases for clean code

### Styling

- Tailwind CSS for all styling
- CSS modules not needed (Tailwind covers everything)
- Components already have full Tailwind setup

### State Management

- Context API for authentication
- localStorage for session persistence
- Ready to add Redux/Zustand if needed

### TypeScript

- Full TypeScript support
- Shared types in `shared/types.ts`
- Type checking during build

---

**Happy coding!** 🎉

For questions or issues, refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) guide or check the [Next.js documentation](https://nextjs.org/docs).
