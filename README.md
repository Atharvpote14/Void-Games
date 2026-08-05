# Void Games

A premium, dark-themed gaming platform for game information, guides, fixes, collections, and download mirrors.

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React (Vite), Tailwind CSS, Framer Motion, React Router, Axios, Lucide React |
| Backend   | Node.js, Express.js                     |
| Database  | Supabase PostgreSQL                     |
| Auth      | Google OAuth (Supabase Auth)            |
| Storage   | Supabase Storage                        |
| Hosting   | Vercel (frontend) / Render (backend)    |

## Project Structure

```
void-games/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable atomic components
│       ├── layouts/      # MainLayout, AdminLayout, AuthLayout
│       ├── pages/        # Page modules (Home, GameDetails, ...)
│       ├── routes/       # React Router configuration
│       ├── context/      # React contexts (auth, etc.)
│       ├── hooks/        # Custom hooks
│       ├── services/     # API & Supabase clients
│       ├── constants/    # Design tokens, endpoints, site config
│       ├── utils/        # Shared utilities
│       └── assets/       # Static assets
├── server/          # Express backend (MVC)
│   ├── config/          # env, supabase client
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Auth, validation, rate limiting, errors
│   ├── routes/          # API route definitions
│   ├── helpers/         # Reusable helpers
│   ├── utils/           # ApiError, ApiResponse, asyncHandler
│   └── validations/     # Request validators
└── docs/            # Architecture & specification documents
```

## Getting Started

1. Clone the repository and install dependencies:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

2. Configure environment variables:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Fill in your Supabase project URL and keys.

3. Run the development servers:

```bash
npm run dev        # client + server together
npm run dev:client # client only (http://localhost:5173)
npm run dev:server # server only (http://localhost:5000)
```

4. Lint and build:

```bash
npm run lint
npm run build
```

## Documentation

All architecture, design, database, and API specifications live in [`docs/`](docs/). `Development-rules.txt` is the highest-priority document and must be followed for all code.

## License

MIT
