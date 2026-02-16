# Dessert Darbar

A full-stack web application with React frontend and Node.js/Express backend.

## Quick Start

### Start Frontend (Dev Mode)
```bash
cd frontend && npm start
```
Access at: `http://localhost:8080`

### Start Backend
```bash
cd backend && npm start
```
Access at: `http://localhost:3000`

**Prerequisites**: Run `npm install` in each directory first (frontend & backend).

## Project Structure

```
dessert_darbar/
├── frontend/          # React + Vite + TypeScript frontend
│   ├── src/           # Source code
│   ├── dist/          # Build output
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js + Express backend
│   ├── server.js      # Main server file
│   └── package.json   # Backend dependencies
└── README.md
```

## Technologies Used

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express.js, CORS
- **Database**: Supabase

## Installation

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Or install both at once from root:
```bash
cd frontend && npm install && cd ../backend && npm install
```

## Running the Application

### Development Mode (Frontend only with hot reload)
```bash
cd frontend
npm run dev
```
Access at: `http://localhost:5173`

### Production Mode (Full stack with backend serving frontend)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd backend
npm start
```

Access at: `http://localhost:3000`

## Backend Server Details

- **Port**: 3000 (configurable via `PORT` environment variable)
- **API Endpoints**:
  - `GET /api/health` - Server health check
  - All other routes serve the frontend SPA

## Available Scripts

### Frontend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-reload)

## Environment Variables

Create a `.env` file in the backend folder for configuration:
```
PORT=3000
```

## License
MIT