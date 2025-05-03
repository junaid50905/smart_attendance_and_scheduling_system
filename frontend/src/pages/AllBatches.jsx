import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../services/api"; // Axios instance

const AllBatches = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true); // loading state

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("admin/batches", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setBatches(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching batches:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBatches();
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <main className="p-6">
                    <h3 className="text-xl font-bold mb-5">All Batches</h3>

                    {loading ? (
                        <div className="text-center py-10 text-gray-600 text-lg">
                            Loading...
                        </div>
                    ) : (
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Batch Name</th>
                                        <th scope="col" className="px-6 py-3">Students</th>
                                        <th scope="col" className="px-6 py-3">Instructors</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches.map((batch) => (
                                        <tr key={batch.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {batch.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {batch.students_count}
                                            </td>
                                            <td className="px-6 py-4">
                                                {batch.instructors_count}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AllBatches;
