import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import './App.css'; 
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Files from "./pages/Files";
import Calendar from "./pages/Calendar";
import Discussion from "./pages/Discussion";

function Logout() {
  localStorage.clear(); // Clear local storage to remove any old access tokens before register/login/logout.
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/files" element={<Files/>} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route 
          path="/protected" 
          element={
            <ProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
