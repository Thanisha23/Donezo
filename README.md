<h1 align="center">Donezo - Task Management Application</h1>

<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 40px; margin: 20px 0;">
  <img src="./apps/web/public/logo.png"  width="450" style="margin-bottom: 20px;" />
  <img src="./apps/web/public/img1.png"  width="350" style="margin-bottom: 20px;" />
  <img src="./apps/web/public/img2.png"  width="350" style="margin-bottom: 20px;" />
  <img src="./apps/web/public/img3.png"  width="350" style="margin-bottom: 20px;" />
</div>

<div align="center">
A modern task management application built with a monorepo architecture. It features a beautiful drag-and-drop interface for organizing tasks, real-time updates and efficient caching with Redis.
<br><br>
<div align="left">

- **User Authentication**: Secure signup and login with JWT
- **Drag & Drop Interface**: Organize tasks visually between "To Do" and "Completed" columns
- **Task Management**: Create, edit, update, and delete tasks with ease
- **Real-time Updates**: Instant task status changes with optimistic UI updates
- **Redis Caching**: Fast task retrieval with intelligent cache invalidation
- **Responsive Design**: Beautiful UI that works on all devices
- **Monorepo Architecture**: Shared UI components and TypeScript configurations
</div>
</div>

## Technology Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DnD Kit](https://img.shields.io/badge/DnD_Kit-FF4154?style=for-the-badge&logo=react&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### Dev Tools
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

## Project Setup

1. **Clone the repository**
```
git clone https://github.com/yourusername/donezo.git
```

2. **Navigate to the project directory and install dependencies**
 ```
cd donezo
pnpm install
```
3. **Navigate to the backend directory:**
```
cd apps/backend
```
4. **Create a file named `.env` in the root directory of backend and add the following environment variables**
```plaintext
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_URL=rediss://default:your-password@your-endpoint.upstash.io:6379
```
5. **Start the Development Server**
```
pnpm run dev
```
6. **In a new terminal, navigate to the frontend directory and install the dependencies**
```
cd apps/web
```
6. **Create a file named `.env` in the root directory add the following environment variables**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
7. **Start the frontend development server**
```
pnpm run dev
```

7. **The application will be available at:**

```
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

## Running Tests
```
# Run backend tests
cd apps/backend && pnpm run test

# Run tests with coverage
cd apps/backend && pnpm run test:coverage
```

<div align="center"><h4>Made by Thanisha Belchada 😄</h4></div>
