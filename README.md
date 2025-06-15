# CodeMentor AI - DSA Learning Platform

A modern, AI-powered platform for learning Data Structures and Algorithms with real-time code execution, personalized feedback, and interactive learning paths.

## 🌟 Features

- **AI-Powered Learning**

  - Intelligent code analysis and suggestions
  - Personalized learning paths
  - Real-time hints and explanations
  - Code quality assessment
  - Performance optimization tips

- **Interactive Code Editor**

  - Monaco Editor integration
  - Multiple language support
  - Real-time code execution
  - Syntax highlighting and error detection

- **Problem Management**

  - Categorized problem sets
  - Difficulty levels (Easy, Medium, Hard)
  - Progress tracking
  - Achievement system
  - Company-specific problems
  - Source attribution

- **Real-time Collaboration**

  - WebSocket-based live coding
  - Chat functionality
  - Code sharing
  - Discussion forum

- **User Management**
  - JWT authentication
  - Profile customization
  - Progress tracking
  - Achievement badges

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Ollama (for AI features) or OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/codementor-ai.git
   cd codementor-ai
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. **Start the development servers**

   ```bash
   # Start both client and server
   npm run dev

   # Or start separately:
   # Terminal 1 - Client
   cd client && npm start

   # Terminal 2 - Server
   cd server && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🛠️ Tech Stack

### Frontend

- React
- Redux Toolkit
- Material-UI
- Monaco Editor
- Socket.IO Client
- React Router
- Axios

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Hugging Face API

## 🔧 Configuration

The application can be configured using environment variables. See [.env.example](.env.example) for all available options.

Key configurations:

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing key
- `HF_API_KEY`: Hugging Face API key
- `CORS_ORIGIN`: Allowed CORS origin

## 🚀 Deployment

### Database Options

- MongoDB Atlas (Recommended)
- PlanetScale (MySQL)
- Supabase (PostgreSQL)

### Backend Deployment (Railway)

1. Create a new project on Railway
2. Link your GitHub repository
3. Set environment variables
4. Deploy using the provided `railway.json`

### Frontend Deployment (Vercel/Netlify)

1. Push frontend to a separate repo or subfolder
2. Connect to Vercel or Netlify
3. Set `REACT_APP_API_URL` to your backend URL

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test

# Run all tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Hugging Face](https://huggingface.co/) for the AI capabilities
- All contributors who have helped this project grow

## 📞 Support

For support, email support@codementor.ai or join our Discord server.
