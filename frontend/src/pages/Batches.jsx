// src/pages/UpcomingClasses.jsx
import Sidebar from "./../components/Sidebar";
import Header from "./../components/Header";
import { Users } from "lucide-react";

const Batches = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <main className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Batches</h2>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="text-xl tracking-tight text-gray-500 mb-6">
                                Batch xgege
                            </h5>
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center mb-2">
                                <Users
                                    className="mr-2"
                                    title="Total students"
                                />
                                <span>12</span>
                            </h3>
                            <p>Students</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Batches;
