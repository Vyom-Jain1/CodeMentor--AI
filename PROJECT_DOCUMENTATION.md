# CodeMentor – DSA Learning Platform

A comprehensive platform for learning Data Structures and Algorithms (DSA) with AI-powered assistance.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Setup & Installation](#setup--installation)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
7. [Scripts](#scripts)
8. [API Overview](#api-overview)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)
12. [License](#license)
13. [Acknowledgments](#acknowledgments)

---

## Project Structure

```
CodeMentor--AI/
│
├── client/         # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/         # Node.js/Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── ...
│
├── src/            # (Optional) Standalone scripts or microservices
│   ├── index.js
│   └── package.json
│
├── start_app.bat   # Batch script to install dependencies and start all services
├── stop_app.bat    # Batch script to stop all running services
├── README.md
└── ...
```

---

## Features

- User authentication and authorization
- DSA problem collection with varying difficulty levels
- AI-powered hints and explanations (Ollama/OpenAI)
- Progress tracking and learning paths
- Code submission and evaluation
- User profiles with statistics
- Responsive design

---

## Tech Stack

**Backend:**

- Node.js, Express.js, MongoDB, JWT, Ollama/OpenAI integration

**Frontend:**

- React, Redux Toolkit, Material-UI, React Router, Axios

---

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB (local or cloud)
- Ollama (for AI features) or OpenAI API key

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/codementor.git
   cd codementor
   ```

2. **Install Ollama (for AI features):**

   - Visit [Ollama's website](https://ollama.ai) and follow the installation instructions.
   - Pull the CodeLlama model:
     ```bash
     ollama pull codellama
     ```

3. **Set up environment variables:**

   - In `server/`, create a `.env` file (see [Environment Variables](#environment-variables)).

4. **Install dependencies and start all services:**
   - Use the batch script (Windows):
     ```
     start_app.bat
     ```
   - Or manually:
     ```bash
     cd server && npm install && npm run dev
     cd ../client && npm install && npm start
     ```

---

## Environment Variables

Create a `.env` file in the `server/` directory with the following:

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-3.5-turbo
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=20
```

- Replace values as needed for your setup.

---

## Running the Application

1. **Start Ollama (if using):**

   ```
   ollama serve
   ```

2. **Start all services (Windows):**

   ```
   start_app.bat
   ```

   - This will install dependencies and start backend, frontend, and src (if present) in separate terminals.

3. **Manual start (alternative):**

   - Backend: `cd server && npm install && npm run dev`
   - Frontend: `cd client && npm install && npm start`
   - Src: `cd src && npm install && npm start` (if used)

4. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## Scripts

- **start_app.bat**: Installs dependencies and starts all services in new terminals.
- **stop_app.bat**: Attempts to close all terminals running the app.
- **npm start**: Runs the main service in each directory.
- **npm run dev** (backend): Runs backend with nodemon for auto-reload.
- **npm test** (backend): Runs backend tests.

---

## API Overview

### Authentication

- `POST /api/auth/register` – Register
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Get current user

### Problems

- `GET /api/problems` – All problems
- `GET /api/problems/:id` – Problem by ID
- `POST /api/problems/:id/submit` – Submit solution
- `GET /api/problems/:id/hints` – Get AI hints

### AI

- `POST /api/ai/explain` – Get AI explanation
- `POST /api/ai/hints/:id` – Get AI hints for problem

---

## Testing

- Backend:
  ```
  cd server
  npm test
  ```

---

## Troubleshooting

- **App won't start?**

  - Check `.env` in `server/` for missing or incorrect values.
  - Make sure MongoDB is running and accessible.
  - Check for errors in the terminal windows.
  - Make sure Node.js and npm are installed and in your PATH.

- **Port already in use?**

  - Change `PORT` in `.env` or stop the conflicting process.

- **Frontend not connecting to backend?**

  - Check the `proxy` field in `client/package.json` and backend port.

- **AI features not working?**
  - Make sure Ollama is running and the model is pulled, or your OpenAI key is valid.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

MIT License – see the LICENSE file for details.

---

## Acknowledgments

- Ollama for AI capabilities
- Material-UI for UI components
- All contributors
