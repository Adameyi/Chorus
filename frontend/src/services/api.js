import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const apiUrl = ""

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
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

//Task-Related API func
export const taskAPI = {
    //CREATE new task
    createTask: () => api.post('/tasks/', taskData),

    //RETRIEVE all tasks
    getTask: () => api.get('/tasks/'),

    //UPDATE task
    updateTask: () => api.put('/tasks/${taskId}/', taskData),

    //DELETE tasks
    deleteTask: () => api.delete('/tasks/${taskId}'),

    //Relocate Task
    moveTask: (taskId, newColumn) => api.patch(`/tasks/${taskId}/`, {column: newColumn})
}

