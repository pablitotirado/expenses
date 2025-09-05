import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    // Mejorar el manejo de errores para incluir información más útil
    if (error.response) {
      // El servidor respondió con un código de estado de error
      const { status, data } = error.response;

      // Crear un error más descriptivo
      const enhancedError = new Error(data?.message || `Error ${status}`);
      (enhancedError as any).status = status;
      (enhancedError as any).response = error.response;
      (enhancedError as any).data = data;

      return Promise.reject(enhancedError);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      const networkError = new Error(
        'Error de conexión. Verifica tu conexión a internet.'
      );
      (networkError as any).status = 0;
      return Promise.reject(networkError);
    } else {
      // Algo pasó al configurar la petición
      return Promise.reject(error);
    }
  }
);

export default api;
