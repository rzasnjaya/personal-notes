# Personal Notes App

A full-stack web application for creating, organizing, and managing personal notes with authentication, search, and tagging capabilities.

## 🎯 Features

- **User Authentication** — Secure registration, login, and logout with password hashing
- **CRUD Operations** — Create, read, update, and delete notes
- **Search** — Real-time search by title and content
- **Favorites** — Mark notes as favorites and filter them
- **Tags** — Add and manage tags for organizing notes
- **Responsive Design** — Clean, dark-themed UI with Tailwind CSS
- **Docker Support** — Fully containerized for consistent deployment

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.3.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks

### Backend
- **Runtime**: Node.js 24
- **Framework**: Next.js API Routes
- **ORM**: Prisma 5.22.0
- **Database**: PostgreSQL 16

### DevOps
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git & GitHub

## 📋 Prerequisites

- Node.js 24.x or higher
- Docker & Docker Compose
- Git

## 🚀 Getting Started

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone git@github.com:rzasnjaya/personal-notes.git
   cd personal-notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

4. **Start PostgreSQL (Docker)**
   ```bash
   docker compose up postgres -d
   ```

5. **Run migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   ```
   http://localhost:3000
   ```

### Option 2: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone git@github.com:rzasnjaya/personal-notes.git
   cd personal-notes
   ```

2. **Start all services**
   ```bash
   docker compose up -d
   ```

3. **Open browser**
   ```
   http://localhost:3000
   ```

To view logs:
```bash
docker compose logs -f personal-notes-web
```

To stop services:
```bash
docker compose down
```

## 📁 Project Structure

```
personal-notes/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── register/
│   │   │   ├── login/
│   │   │   └── logout/
│   │   └── notes/             # Notes endpoints
│   │       ├── route.ts       # GET /api/notes, POST /api/notes
│   │       └── [id]/
│   │           └── route.ts   # GET/PATCH/DELETE /api/notes/:id
│   ├── login/                 # Login page
│   ├── register/              # Register page
│   └── page.tsx               # Home page
├── components/
│   ├── Sidebar.tsx
│   ├── MainContent.tsx
│   ├── SearchBar.tsx
│   ├── NotesList.tsx
│   ├── NoteDetail.tsx
│   └── NoteModal.tsx
├── lib/
│   ├── prisma.ts              # Prisma Client singleton
│   ├── auth.ts                # Authentication utilities
│   └── api.ts                 # API client functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── Dockerfile                 # Next.js container config
├── docker-compose.yml         # Docker Compose config
├── .env.example               # Environment variables template
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔐 Security

- Passwords are hashed using bcryptjs before storage
- Session management via secure HTTP-only cookies
- User data is isolated per authenticated user
- Environment variables for sensitive configuration
- SQL injection prevention via Prisma ORM

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — Login user
- `POST /api/auth/logout` — Logout user

### Notes
- `GET /api/notes` — Fetch all notes (with optional filters)
  - Query params: `search`, `isFavorite`, `isArchived`
- `POST /api/notes` — Create new note
- `GET /api/notes/:id` — Fetch single note
- `PATCH /api/notes/:id` — Update note
- `DELETE /api/notes/:id` — Delete note

## 🗄 Database Schema

### User
```prisma
model User {
  id        Int
  email     String    @unique
  name      String
  password  String    # hashed
  createdAt DateTime
  updatedAt DateTime
  notes     Note[]
  tags      Tag[]
}
```

### Note
```prisma
model Note {
  id        Int
  title     String
  content   String
  isFavorite Boolean
  isArchived Boolean
  createdAt DateTime
  updatedAt DateTime
  userId    Int
  user      User
  noteTags  NoteTag[]
}
```

### Tag
```prisma
model Tag {
  id        Int
  name      String
  userId    Int
  user      User
  noteTags  NoteTag[]
  createdAt DateTime
  @@unique([userId, name])
}
```

## 🧪 Testing

Run the application and test features:

1. **Register** — Create new account with email and password
2. **Login** — Sign in with credentials
3. **Create Notes** — Add new notes with title, content, and tags
4. **Search** — Filter notes by keyword
5. **Favorite** — Mark notes as favorites
6. **Edit** — Update note content and tags
7. **Delete** — Remove notes permanently

## 📦 Environment Variables

Create `.env` file (copy from `.env.example`):

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=personal_notes

# For Docker: use service name instead of localhost
DATABASE_URL="postgresql://postgres:your_password@postgres:5432/personal_notes"
```

## 🔄 Git Workflow

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `chore:` — Maintenance
- `docs:` — Documentation
- `refactor:` — Code refactoring

## 📚 Learning Path

This project teaches:

1. **Frontend Development** — React, Next.js, TypeScript
2. **Backend Development** — API design, server-side logic
3. **Database** — PostgreSQL, relational modeling, migrations
4. **ORM** — Prisma fundamentals
5. **Authentication** — Password hashing, session management
6. **DevOps** — Docker, containerization
7. **Version Control** — Git, meaningful commits
8. **Full-Stack Architecture** — How pieces fit together

## 🤝 Contributing

This is a learning project. Feel free to fork and extend!

## 📄 License

MIT License — feel free to use for learning and personal projects.

## 👨‍💻 Author

Built as a learning project for full-stack web development.

---

**Happy coding!** 🚀
