import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getTasks = (params) => api.get('/tasks', { params });
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getTaskStats = (projectId) => api.get(`/tasks/stats/${projectId}`);

export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);
export const seedData = () => api.post('/projects/seed');

export const getUsers = () => api.get('/users');
export const getActivities = (params) => api.get('/activities', { params });

export default api;
