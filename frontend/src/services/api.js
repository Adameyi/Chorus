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

//Auth API Func
export const authAPI = {

}


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

// User Search API func
export const userAPI = {

    // Query Search Users
    searchUsers: (query) => api.get(`/user/search/?q=%{}`),

    // GET currnet user profile (Endpoint req)
    getProfile: () => api.get(`/user/profile/`)
}

// Friend Request API func
export const friendRequestAPI = {

    // GET friend requests (sent & received)
    getFriendRequest: () => api.get(`/friend-requests/`),

    // POST friend request
    sendFriendRequest: (receiverId) => api.post(`/friend-requests/`, { receiver_id: receiverId }),

    // UPDATE friend request (accept/reject)
    respondToFriendRequest: (requestId, action) => api.post(`/friend-requests/${requestId}/respond/`, { action }),

    // GET friends list
    getFriends: () => api.get(`/friends/`),
}

//Chat Room API functions
export const chatAPI = {

    //GET all chat rooms
    getChatRooms: () => api.get(`/chat-room/`),

    // POST new group chat
    createGroupChat: (name, participantIds) =>
        api.post('/chat-room/', {
            name,
            participant_ids: participantIds,
            is_group_chat: true
        }),

    // POST new DM chat
    createDirectMessage: (friendId) => api.post(`/chat-room/direct/`, { friend_id: friendId }),


    // GET messages from chat room
    getMessages: (chatRoomId) => api.get(`/chat-room/${chatRoomId}/get_messages/`),

    // POST messages to chat room
    sendMessage: (chatRoomId, content) => api.post(`/chat-room/${chatRoomId}/send_message/`, { content }),

    // PUT messages to edit
    editMessage: (chatRoomId, messageId, content) => api.put(`/chat-room/${chatRoomId}/messages/${messageId}`, { content }),

    // DELETE messages from chat room
    removeMessage: (chatRoomId, messageId) => api.delete(`chat-room/${chatRoomId}/messages/${messageId}`),


    // POST emote to message
    addEmote: (chatRoomId, messageId, reaction) => api.post(`/chat-room/${chatRoomId}/messages/${messageId}/emotes/`, { reaction }),

    // DELETE emote from message
    removeEmote: (chatRoomId, messageId, emoteId) => api.post(`/chat-room/${chatRoomId}/messages/${messageId}/emotes/${emoteId}`),

    // GET emotes for specified message
    getMessageEmotes: (chatRoomId, messageId) => api.get(`/chat-room/${chatRoomId}/messages/${messageId}/emotes/`),
}