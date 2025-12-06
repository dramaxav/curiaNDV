# Légion de Marie - Management Platform

A comprehensive web application for managing the Legion of Mary (Légion de Marie), built with **Next.js 14** and modern React technologies.

## 🎯 Features

- **Zone & Praesidia Management**: Organize geographic zones and local groups
- **Member Registry**: Track members with status, contact info, and dates
- **Officer Management**: Manage mandates, roles, and responsibilities
- **Attendance Tracking**: Record presence at meetings and events
- **Financial Management**: Track contributions, expenses, and reports
- **Authentication & Authorization**: Role-based access control
- **Responsive UI**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- npm, yarn, or pnpm

### Installation

```bash
cd code
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
app/
  ├── api/                 # API routes
  ├── (routes)/           # Application pages
  ├── components/         # React components
  ├── hooks/             # Custom React hooks
  ├── lib/               # Utility functions
  ├── layout.tsx         # Root layout
  ├── page.tsx           # Home page
  ├── providers.tsx      # Auth context provider
  └── middleware.ts      # Auth middleware

public/                   # Static assets
shared/                   # Shared types

```

## 🔐 Authentication

The application includes mock authentication with demo accounts:

### Demo Accounts
- **Président du Conseil**: president@legiondemarie.org
- **Vice-Président du Conseil**: vicepresident@legiondemarie.org
- **Trésorier du Conseil**: tresorier@legiondemarie.org
- **Président Praesidium**: president.rosaire@legiondemarie.org
- **Secrétaire Praesidium**: secretaire.stjean@legiondemarie.org

All demo accounts use password: `demo123`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking
- `npm run format.fix` - Format code with Prettier

## 🎨 UI Components

Built with Radix UI and Tailwind CSS:
- Buttons, Cards, Dialogs
- Forms and Input validation
- Tables and Data display
- Toasts and Notifications
- Responsive Layout

## 📦 Tech Stack

- **Frontend**: React 18, Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **State**: Context API (for auth)
- **Data**: React Query
- **Charts**: Recharts

## 🌍 Internationalization

Currently configured for French (FR). UI strings and error messages are in French.

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Local server deployment instructions
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 🔌 Extending the Application

### Adding New Pages

1. Create a new folder in `app/` (e.g., `app/new-feature/`)
2. Add `page.tsx` file
3. Import and use `Layout` component
4. Wrap with `ProtectedRoute` if needed

### Adding API Routes

Create files in `app/api/`:
```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello' });
}
```

## 🐛 Troubleshooting

### Build Issues
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

## 📝 License

This project is proprietary software for the Legion of Mary organization.

## 👥 Support

For deployment, integration, or feature requests, refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

---

**Migration Notes**: This project was successfully migrated from Vite + Express + React Router to Next.js 14 with the App Router architecture.
