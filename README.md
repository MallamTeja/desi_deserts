# Dessert Darbar

A full-stack web application with React frontend and Node.js/Express backend, using MongoDB for data storage.

## Quick Start

### 1. Environment Setup
Create a `.env` file in the **root** directory of the project (not inside `backend` or `frontend`). You can use `.env.example` as a template.

```bash
mongodbfromenv="your_mongodb_connection_string"
PORT=3000
```

### 2. Start Frontend (Dev Mode)
```bash
cd frontend && npm install && npm start
```
Access at: `http://localhost:8080`

### 3. Start Backend
```bash
cd backend && npm install && npm start
```
Access at: `http://localhost:3000`

## Database Seeding
To populate the database with initial dessert data:
```bash
cd backend
node seed.js
```

## Project Structure

```
dessert_darbar/
├── .env               # Root environment file (Required)
├── .env.example       # Template for environment variables
├── frontend/          # React + Vite + TypeScript frontend
│   ├── src/           # Source code
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js + Express backend
│   ├── models/        # MongoDB Schemas (Mongoose)
│   ├── server.js      # Main server file
│   ├── seed.js        # Database seeding script
│   └── package.json   # Backend dependencies
└── README.md
```

## Technologies Used

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Deployment**: Railway / Vercel compatible

## Available Scripts

### Frontend
- `npm run dev` / `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-reload)
- `node seed.js` - Seed initial data to MongoDB

## License
MIT