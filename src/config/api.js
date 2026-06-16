const IS_PROD = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = IS_PROD
  ? 'https://ai-placement-prep-backend.onrender.com'
  : 'http://localhost:5000';