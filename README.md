# 🚀 Full-Stack Developer Portfolio

A premium, production-ready portfolio built with **Next.js**, **Node.js + Express**, and **MongoDB** — featuring a stunning **Liquid Glass** design system.

---

## ✨ Features

- **Liquid Glass UI** — backdrop blur, glassmorphism, gradient borders, glowing shadows
- **Framer Motion** animations — page transitions, scroll reveals, hover effects
- **Admin Dashboard** — full CRUD for all portfolio content
- **JWT Authentication** — secure token-based auth
- **Fully Responsive** — mobile-first design
- **SEO Optimized** — Next.js metadata API

---

## 🗂 Project Structure

```
portfolio/
├── frontend/          # Next.js App Router
│   ├── app/
│   │   ├── page.jsx             # Home (single-page portfolio)
│   │   ├── login/page.jsx
│   │   ├── signup/page.jsx
│   │   ├── dashboard/page.jsx   # Protected admin dashboard
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── sections/        # Hero, About, Skills, Projects, Certs, Contact
│   │   └── dashboard/components/ # OverviewPanel, AboutPanel, SkillsPanel...
│   ├── lib/api.js               # Axios API client
│   ├── store/useStore.js        # Zustand state
│   └── hooks/useData.js
│
└── backend/           # Node.js + Express
    ├── models/        # User, About, Skill, Project, Certificate, Contact
    ├── routes/        # auth, about, skills, projects, certificates, contact
    ├── middleware/    # JWT auth guard
    └── server.js
```

---

## 🏃 Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev       # Runs on http://localhost:5000
```

**Required env vars:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
JWT_SECRET=your_very_long_random_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set NEXT_PUBLIC_API_URL
npm install
npm run dev       # Runs on http://localhost:3000
```

**Required env vars:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

| Method | Endpoint                  | Auth | Description            |
|--------|---------------------------|------|------------------------|
| POST   | /api/auth/signup          | ✗    | Create admin account   |
| POST   | /api/auth/login           | ✗    | Login + get JWT        |
| GET    | /api/auth/me              | ✓    | Get current user       |
| GET    | /api/about                | ✗    | Get about data         |
| PUT    | /api/about                | ✓    | Update about           |
| GET    | /api/skills               | ✗    | Get all skills         |
| POST   | /api/skills               | ✓    | Add skill              |
| PUT    | /api/skills/:id           | ✓    | Update skill           |
| DELETE | /api/skills/:id           | ✓    | Delete skill           |
| GET    | /api/projects             | ✗    | Get all projects       |
| POST   | /api/projects             | ✓    | Add project            |
| PUT    | /api/projects/:id         | ✓    | Update project         |
| DELETE | /api/projects/:id         | ✓    | Delete project         |
| GET    | /api/certificates         | ✗    | Get all certificates   |
| POST   | /api/certificates         | ✓    | Add certificate        |
| DELETE | /api/certificates/:id     | ✓    | Delete certificate     |
| POST   | /api/contact              | ✗    | Send message           |
| GET    | /api/contact              | ✓    | View all messages      |
| PATCH  | /api/contact/:id/read     | ✓    | Mark message read      |
| DELETE | /api/contact/:id          | ✓    | Delete message         |

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_API_URL to your backend URL in Vercel dashboard
```

### Backend → Render

1. Push backend to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Connect your repo
4. Set environment variables in Render dashboard
5. Deploy

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com](https://mongodb.com/atlas)
2. Create database user
3. Whitelist IP (0.0.0.0/0 for Render)
4. Copy connection string to `MONGODB_URI`

---

## 🎨 Design System

The UI uses a **Liquid Glass** design language with these CSS utilities:

| Class          | Description                      |
|----------------|----------------------------------|
| `.glass`       | Basic glassmorphism card         |
| `.glass-card`  | Hoverable floating card          |
| `.glass-strong`| High-opacity glass (modals)      |
| `.gradient-text` | Indigo→violet text gradient    |
| `.btn-primary` | Gradient CTA button              |
| `.btn-ghost`   | Transparent bordered button      |
| `.input-glass` | Glass-style form input           |
| `.glow-indigo` | Indigo box-shadow glow           |
| `.orb`         | Blurred floating background orb  |

---

## 🛡 Security

- Passwords hashed with **bcryptjs** (cost factor 12)
- JWT tokens expire in **7 days**
- **Rate limiting** — 100 req/15min general, 10 req/15min for auth
- **Input validation** — express-validator on all POST/PUT routes
- **CORS** — configured to your frontend URL only

---

## 📦 Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | Next.js 14, Tailwind CSS, Framer Motion |
| State      | Zustand                            |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB, Mongoose                  |
| Auth       | JWT, bcryptjs                      |
| Deploy FE  | Vercel                             |
| Deploy BE  | Render / Railway                   |
| DB Hosting | MongoDB Atlas                      |
