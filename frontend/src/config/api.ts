const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-app.onrender.com' 
  : 'http://localhost:8080';

export { API_BASE_URL };