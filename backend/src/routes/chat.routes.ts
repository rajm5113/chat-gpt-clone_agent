import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { GeminiService } from '../services/gemini.service';

const router = Router();

// Initialize services
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.error('❌ CRITICAL: GEMINI_API_KEY is empty in chat.routes.ts');
  console.error('Environment variables may not be loaded yet!');
} else {
  console.log(`✅ Chat routes initializing with API key: ${apiKey.substring(0, 10)}...`);
}

const geminiService = new GeminiService(apiKey);
const chatController = new ChatController(geminiService);

// Routes
router.post('/chat', (req, res) => chatController.sendMessage(req, res));
router.post('/chat/stream', (req, res) => chatController.streamMessage(req, res));
router.post('/chat/title', (req, res) => chatController.generateTitle(req, res));

export default router;
