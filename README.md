# CodeMentor - DSA Learning Platform

A comprehensive platform for learning Data Structures and Algorithms with AI-powered assistance.

## Features

- User authentication and authorization
- DSA problem collection with varying difficulty levels
- AI-powered hints and explanations using Ollama
- Progress tracking and learning paths
- Code submission and evaluation
- User profiles with statistics
- Responsive design

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Ollama AI Integration

### Frontend

- React
- Redux Toolkit
- Material-UI
- React Router
- Axios

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Ollama (for AI features)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/codementor.git
cd codementor
```

2. Install Ollama:

   - Visit [Ollama's official website](https://ollama.ai) and follow the installation instructions for your operating system
   - Pull the CodeLlama model:

   ```bash
   ollama pull codellama
   ```

3. Install backend dependencies:

```bash
cd server
npm install
```

4. Install frontend dependencies:

```bash
cd ../client
npm install
```

5. Create environment files:
   - Copy `.env.example` to `.env` in the server directory
   - Update the environment variables with your configuration:
     ```
     OLLAMA_API=http://localhost:11434/api
     OLLAMA_MODEL=codellama
     ```

## Running the Application

1. Start Ollama:

   ```bash
   ollama serve
   ```

2. Start the backend server:

   ```bash
   cd server
   npm run dev
   ```

3. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

The application will be available at `http://localhost:3000`

## Testing

Run backend tests:

```bash
cd server
npm test
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Problem Endpoints

- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems/:id/submit` - Submit solution
- `GET /api/problems/:id/hints` - Get AI hints

### AI Endpoints

- `POST /api/ai/explain` - Get AI explanation
- `POST /api/ai/hints/:id` - Get AI hints for problem

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ollama for providing the AI capabilities
- Material-UI for the component library
- All contributors who have helped shape this project
