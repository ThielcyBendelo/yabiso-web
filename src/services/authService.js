// Service d'authentification connecté au vrai backend FastAPI (JWT + MongoDB)
import { API_URL, AUTH_TOKEN_KEY, AUTH_USER_KEY, getToken } from '../config/api';

const persistSession = (accessToken, user) => {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const authService = {
  /** Connexion réelle : POST /api/login (OAuth2PasswordRequestForm -> x-www-form-urlencoded). */
  login: async (email, password) => {
    const body = new URLSearchParams();
    body.append('username', email);
    body.append('password', password);

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.detail || 'Identifiants incorrects.');
    }

    persistSession(data.access_token, data.user);
    return data.user;
  },

  /** Inscription réelle : POST /api/register puis connexion automatique. */
  register: async (formData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: formData.companyName,
        manager_name: formData.managerName,
        email: formData.email,
        whatsapp_number: formData.whatsappNumber,
        province: formData.province,
        city: formData.city,
        rccm: formData.rccm || null,
        id_nat: formData.idNat || null,
        password: formData.password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.detail || "Erreur lors de l'inscription.");
    }

    // Connexion automatique après inscription
    return authService.login(formData.email, formData.password);
  },

  initialize: async () => true,

  isLoggedIn: () => getToken() !== null,

  getToken,

  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_USER_KEY)) || null;
    } catch {
      return null;
    }
  },

  updateStoredUser: (user) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};

export default authService;
