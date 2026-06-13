// Detects if the React app is running on a local development machine or live on Render
const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const BACKEND_BASE_URL = IS_PRODUCTION
  ? 'https://ai-placement-prep-backend.onrender.com' // Your live production server
  : 'http://localhost:5000';                         // Your local fallback machine port

// Helper to quickly build full endpoint routes cleanly
export const API_ROUTES = {
  auth: {
    login: `${BACKEND_BASE_URL}/api/auth/login`,
    register: `${BACKEND_BASE_URL}/api/auth/register`,
    logout: `${BACKEND_BASE_URL}/api/auth/logout`,
    google: `${BACKEND_BASE_URL}/api/auth/google`,
    linkedin: `${BACKEND_BASE_URL}/api/auth/linkedin`
  },
  code: {
    run: `${BACKEND_BASE_URL}/api/code/run`
  },
  dashboard: {
    metrics: `${BACKEND_BASE_URL}/api/dashboard/metrics`
  }
};