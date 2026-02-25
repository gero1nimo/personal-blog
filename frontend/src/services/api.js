import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;
