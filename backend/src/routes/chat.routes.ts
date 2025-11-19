import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { GeminiService } from '../services/gemini.service';

const router = Router();

// Initialize services
const geminiService = new GeminiService(process.env.GEMINI_API_KEY || '');
const chatController = new ChatController(geminiService);

// Routes
router.post('/chat', (req, res) => chatController.sendMessage(req, res));
router.post('/chat/stream', (req, res) => chatController.streamMessage(req, res));
router.post('/chat/title', (req, res) => chatController.generateTitle(req, res));

export default router;
