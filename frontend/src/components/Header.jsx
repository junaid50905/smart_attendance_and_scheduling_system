// src/components/Header.jsx
import { Bell, Settings } from "lucide-react";

const Header = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem('role')
    
    return (
        <div className="flex justify-between items-center bg-white p-4 shadow-sm border-b">
            {/* Search bar */}
            <div className="flex-1 max-w-md">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-4 ml-auto">
                <button className="text-gray-500 hover:text-blue-600">
                    <Bell size={20} />
                </button>
                <button className="text-gray-500 hover:text-blue-600">
                    <Settings size={20} />
                </button>

                {/* User info */}
                <div className="flex items-center gap-2">
                    <img
                        src="https://randomuser.me/api/portraits/women/45.jpg"
                        alt="User"
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            <span>{user.name}</span>
                            <span className="text-blue-600">({role})</span>
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
