# Backend Server

Node.js + Express server for Dessert Darbar application.

## Quick Start

**Start the server:**
```bash
npm start
```

Server runs at: `http://localhost:3000`

**Prerequisite**: Run `npm install` first to install dependencies.

## Installation

```bash
npm install
```

This installs the following packages:
- **express** (^4.18.2) - Web framework for Node.js
- **cors** (^2.8.5) - Enable CORS for cross-origin requests
- **nodemon** (^3.0.1) - Development auto-reload (dev dependency)

## Running the Server

### Production Mode
```bash
npm start
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Server Features

- **Static File Serving**: Serves built frontend from `../frontend/dist`
- **SPA Support**: All routes serve `index.html` for React Router
- **API Routes**: Available under `/api/*`
- **CORS Enabled**: Cross-origin requests allowed

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `*` | Serves frontend SPA |

## Project Structure

```
backend/
├── server.js          # Main server entry point
├── package.json       # Dependencies and scripts
└── node_modules/      # Installed packages
```

## Configuration

Server port can be configured via environment variable:
```bash
PORT=8080 npm start
```

Default port is 3000.
