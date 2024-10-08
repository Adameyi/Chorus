import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/index.css";
import Indicator from "./Indicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const title = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);

        // Prevent form submission if error found.
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
            <h1 className="text-blue-600 text-2xl text-center mb-4">{title}</h1>
            <input
                type="text"
                className="form-input border rounded p-2 w-full mb-4"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                className="form-input border rounded p-2 w-full mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <Indicator />}
            <div className="flex justify-center">
                <button className="bg-blue-600 text-white rounded p-2 w-full max-w-xs" type="submit">
                    {loading ? "Loading..." : title}
                </button>
            </div>
        </form>
    );
}

export default Form;
