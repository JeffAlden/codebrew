import axios from 'axios';

// Use the environment variable if available, otherwise fall back to localhost
const baseURL = process.env.REACT_APP_API_URL || 'https://express-vercel-app-sigma.vercel.app' || 'http://localhost:3006';

const api = axios.create({
  baseURL: baseURL,
});

export default api;
