// Configuration centralisée de l'accès à l'API backend (FastAPI + MongoDB)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || 'http://localhost:8000';

export const AUTH_TOKEN_KEY = 'access_token';
export const AUTH_USER_KEY = 'user';

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const authHeaders = (extra = {}) => {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

/** Construit une URL absolue vers un fichier statique servi par le backend (ex: avatar). */
export const resolveAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${ASSETS_URL}${path}`;
};

/** Wrapper fetch générique : ajoute le token, gère le JSON et les erreurs 401/403. */
export const apiFetch = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders(options.headers),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Session expirée, veuillez vous reconnecter.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.detail || 'Une erreur est survenue lors de la communication avec le serveur.');
  }

  return data;
};
