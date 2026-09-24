import axios from "axios";

// Production must never fall back to localhost (Vercel builds omit local .env).
const DEFAULT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://dreamdrive-1maq.onrender.com"
    : "http://localhost:5000";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || DEFAULT_API_URL,
});

export default api;
