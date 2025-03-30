import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const apiUrl = "http://localhost:8000/api";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

// Task-Related API functions
export const taskAPI = {
    // CREATE new task
    createTask: (taskData) => api.post('/api/tasks/', taskData),

    // RETRIEVE all tasks
    getTasks: () => api.get('/api/tasks/'),

    // UPDATE task
    updateTask: (taskId, taskData) => api.put(`/api/tasks/${taskId}`, taskData),

    // DELETE task
    deleteTask: (taskId) => api.delete(`/api/tasks/${taskId}/`),

    // RELOCATE task
    moveTask: (taskId, newColumn) => api.patch(`/api/tasks/${taskId}`, { column: newColumn }),
};
