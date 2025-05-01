import { Link, useLocation } from "react-router-dom";
import {
    Home,
    CalendarDays,
    ClipboardCheck,
    FileText,
    Settings,
    LogOut,
} from "lucide-react";

import api from "./../services/api";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const menuItems = [
        { path: "/dashboard", label: "Home", icon: <Home size={20} /> },
        {
            path: "/upcoming-classes",
            label: "Upcomming Classes (st)",
            icon: <CalendarDays size={20} />,
        },
        {
            path: "/mark-attendance",
            label: "Mark attendance (st)",
            icon: <ClipboardCheck size={20} />,
        },
        {
            path: "/certificate",
            label: "Certificate",
            icon: <FileText size={20} />,
        },
        { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
    ];
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const role = localStorage.getItem("role");
            const token = localStorage.getItem("token");

            if (!token) throw new Error("No token found");

            await api.post(`/${role}/logout`, null, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            });

        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            localStorage.clear();
            navigate(`/login`);
            window.location.href = "/login";
        }
    };

    return (
        <div className="w-64 h-screen bg-white border-r shadow-sm p-4">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">EduMate</h1>
            <ul className="space-y-3">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 ${
                                location.pathname === item.path
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700"
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <hr className="my-4" />
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-2 w-full rounded-lg text-red-600 hover:bg-red-100"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
