// Detect if the frontend is running on a live production URL (like Render)
const IS_PROD = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = IS_PROD
  ? 'https://ai-placement-prep-backend.onrender.com' // Live Cloud Backend
  : 'http://localhost:5000';                         // Local Development Fallback