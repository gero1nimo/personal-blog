import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) =>{ 
    return Promise.reject(error)
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Oturum süresi doldu veya yetkisiz erişim.");
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


// Projects API
export const projectsApi = {
  getAll: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (project) => {
    const response = await api.post('/projects/', project);
    return response.data;
  },
};

// Blog API
export const blogApi = {
  getAll: async () => {
    const response = await api.get('/blogposts/');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/blogposts/${id}`);
    return response.data;
  },
  create: async (blogPost) => {
    const response = await api.post('/blogposts/', blogPost);
    return response.data;
  },
};

// Profile API
export const profileApi = {
  get: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },
  update: async (profile) => {
    const response = await api.put('/profile/', profile);
    return response.data;
  },
};

