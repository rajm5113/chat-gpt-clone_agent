# ChatGPT Clone

A full-stack ChatGPT clone application built with React, TypeScript, Node.js, and Google Gemini API. This application replicates the core functionality of ChatGPT with a clean, modern UI and real-time streaming responses.

![ChatGPT Clone](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## Features

### Core Functionality
- 💬 **Real-time Chat** - Streaming responses from Google Gemini API
- 🎨 **Modern UI** - Clean, ChatGPT-like interface with smooth animations
- 🌓 **Dark/Light Theme** - Toggle between themes with persistent preference
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- 💾 **Persistent Storage** - Conversations saved in localStorage
- 🔄 **Message Actions** - Copy, edit, and regenerate messages

### Advanced Features
- ⚡ **Streaming Responses** - Real-time text streaming for better UX
- 🎯 **Auto-generated Titles** - Conversations titled automatically
- 📝 **Markdown Support** - Full markdown rendering with syntax highlighting
- 💻 **Code Highlighting** - Beautiful syntax highlighting for code blocks
- 📤 **Export Conversations** - Download chats as text or markdown
- ⏱️ **Typing Indicator** - Visual feedback while AI is thinking
- 🔄 **Edit & Resend** - Edit previous messages and regenerate responses
- 📊 **Chat History** - Sidebar with all conversation history
- 🚫 **Rate Limiting** - Built-in API rate limiting protection

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Google Gemini API** - AI model
- **CORS** - Cross-origin support
- **dotenv** - Environment variables

## Prerequisites

- Node.js 18+ and npm/yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chat-gpt-clone_agent
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Run the Application

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:5173

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
chat-gpt-clone_agent/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   │   └── chat.controller.ts
│   │   ├── middleware/      # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── routes/          # API routes
│   │   │   └── chat.routes.ts
│   │   ├── services/        # Business logic
│   │   │   └── gemini.service.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   └── server.ts        # Express app entry
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── services/        # API services
│   │   │   └── api.ts
│   │   ├── store/           # Zustand stores
│   │   │   ├── chatStore.ts
│   │   │   └── themeStore.ts
│   │   ├── styles/          # Global styles
│   │   │   └── index.css
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/           # Helper functions
│   │   │   └── helpers.ts
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

## API Endpoints

### POST `/api/chat`
Send a message and receive a complete response.

**Request:**
```json
{
  "message": "Hello, how are you?",
  "conversationId": "optional-conversation-id",
  "messages": []
}
```

**Response:**
```json
{
  "message": {
    "id": "message-id",
    "role": "assistant",
    "content": "Response text",
    "timestamp": 1234567890
  },
  "conversationId": "conversation-id"
}
```

### POST `/api/chat/stream`
Send a message and receive streaming response via Server-Sent Events.

**Request:** Same as `/api/chat`

**Response:** SSE stream with chunks:
```
data: {"text": "Hello", "done": false}
data: {"text": " there!", "done": false}
data: {"text": "", "done": true, "message": {...}, "conversationId": "..."}
```

### POST `/api/chat/title`
Generate a title for a conversation based on the first message.

**Request:**
```json
{
  "message": "First message in conversation"
}
```

**Response:**
```json
{
  "title": "Generated Title"
}
```

## Usage Guide

### Starting a New Conversation
1. Click the "New Chat" button in the sidebar
2. Type your message in the input box
3. Press Enter or click the send button

### Message Actions
- **Copy**: Hover over a message and click the copy icon
- **Edit**: Click edit on your message, modify it, and resend
- **Regenerate**: Click regenerate on AI responses to get a new answer

### Keyboard Shortcuts
- `Enter` - Send message
- `Shift + Enter` - New line in message

### Theme Toggle
- Click the sun/moon icon in the header
- Or use the theme option in Settings

### Export Conversations
1. Open Settings in the sidebar
2. Choose "Export as Text" or "Export as Markdown"
3. File will download automatically

### Clear Conversations
1. Delete individual chats by hovering and clicking the trash icon
2. Or clear all chats from Settings → "Clear All Chats"

## Configuration

### Environment Variables

**Backend (`backend/.env`):**
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Rate Limiting
Default: 50 requests per minute per IP address

Modify in `backend/src/middleware/rateLimiter.ts`:
```typescript
const MAX_REQUESTS = 50;
const WINDOW_MS = 60 * 1000; // 1 minute
```

### Gemini Model Configuration
Modify in `backend/src/services/gemini.service.ts`:
```typescript
this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
```

Available models:
- `gemini-pro` - Text generation
- `gemini-pro-vision` - Text and image (requires additional setup)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs with Vite HMR
```

### Build for Production

**Backend:**
```bash
cd backend
npm run build  # Compiles TypeScript to JavaScript
npm start      # Runs production build
```

**Frontend:**
```bash
cd frontend
npm run build  # Creates optimized production build in dist/
npm run preview  # Preview production build
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify GEMINI_API_KEY is set in `.env`
- Run `npm install` to ensure dependencies are installed

### Frontend shows connection errors
- Ensure backend is running on port 5000
- Check browser console for detailed errors
- Verify proxy configuration in `vite.config.ts`

### API rate limiting errors
- Wait for the rate limit window to reset (1 minute)
- Reduce request frequency
- Adjust rate limits in `rateLimiter.ts`

### Streaming not working
- Check browser compatibility (needs EventSource support)
- Verify network allows SSE connections
- Check backend logs for errors

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - feel free to use this project for learning and development.

## Acknowledgments

- Google Gemini AI for the powerful language model
- OpenAI for inspiration from ChatGPT's interface
- The React and Node.js communities

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Google Gemini**
