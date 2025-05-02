// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [role, setRole] = useState("student"); // default role

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await api.post(`/${role}/login`, { email, password });
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));            
            navigate("/dashboard", { replace: true });

        } catch (err) {
            setError("Invalid credentials. Please try again.");
            console.log(err);
        }
    };

  

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                Smart Attendance & Scheduling System Login
                </h2>

                {error && (
                    <div className="mb-4 text-red-600 text-sm">{error}</div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <label className="text-gray-700 text-sm font-semibold whitespace-nowrap">
                            Select Role:
                        </label>
                        <div className="flex gap-4">
                            {["admin", "instructor", "student"].map((r) => (
                                <label
                                    key={r}
                                    className="flex items-center gap-2 text-gray-700 text-sm"
                                >
                                    <input
                                        type="radio"
                                        value={r}
                                        checked={role === r}
                                        onChange={() => setRole(r)}
                                        className="text-blue-600"
                                    />
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
