import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "https://formation-afb-backend.onrender.com/api"; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Ajouter le Access Token aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Variable pour éviter les boucles de rafraîchissement infinies
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Gérer le rafraîchissement automatique du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si erreur 401 et qu'on n'a pas encore retenté
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data.accessToken;
        
        localStorage.setItem('accessToken', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        
        // On ne redirige pas si on est en plein examen pour éviter de tout perdre
        // L'étudiant verra une alerte et pourra tenter de sauvegarder manuellement
        if (!window.location.pathname.includes('/exam/')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
