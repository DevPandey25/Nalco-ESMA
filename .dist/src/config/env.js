export const env = {
  INSFORGE_URL: import.meta.env.VITE_INSFORGE_URL || '',
  INSFORGE_ANON_KEY: import.meta.env.VITE_INSFORGE_ANON_KEY || '',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.PROD || false,
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || '',
};
