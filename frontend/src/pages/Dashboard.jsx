import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendanceStats, setAttendanceStats] = useState([]);
    const [instructorStat, setInstructorStat] = useState({});

    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get(`/${role}/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.overallinfo);
                setAttendanceStats(response.data.attendanceStats || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setData([]);
                setAttendanceStats([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchInstructorStat = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get(`/${role}/statistics`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInstructorStat(response.data);
            } catch (error) {
                console.error("Failed to fetch instructor stats:", error);
                setInstructorStat({});
            }
        };

        fetchDashboardData();

        if (role === "instructor") {
            fetchInstructorStat();
        }
    }, [role]);

    if (role === "admin") {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-50 min-h-screen">
                    <Header />
                    <main className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            All Info
                        </h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {data.map((item, i) => (
                                        <div
                                            key={i}
                                            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                                Total {item.name}
                                            </p>
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                {item.count}
                                            </h5>
                                        </div>
                                    ))}
                                </div>

                                {attendanceStats.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                        <div className="mt-10 bg-white p-6 rounded-lg shadow">
                                            <h3 className="text-xl font-semibold mb-4">
                                                Attendance Overview
                                            </h3>
                                            <Bar
                                                data={{
                                                    labels: attendanceStats.map(
                                                        (item) => item.status
                                                    ),
                                                    datasets: [
                                                        {
                                                            label: "Attendance Count",
                                                            data: attendanceStats.map(
                                                                (item) =>
                                                                    item.count
                                                            ),
                                                            backgroundColor: [
                                                                "#2ecc71",
                                                                "#c0392b",
                                                                "#f1c40f",
                                                            ],
                                                        },
                                                    ],
                                                }}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: "top",
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: "Attendance Summary",
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        );
    } else if (role === "instructor") {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-50 min-h-screen">
                    <Header />
                    <main className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            All Statistics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {instructorStat.batches || 0}
                                    <br />
                                    <span className="text-sm">
                                        Batches you are connected with
                                    </span>
                                </h5>
                            </div>
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {instructorStat.class_schedule || 0}
                                    <br />
                                    <span className="text-sm">
                                        Total scheduled classes
                                    </span>
                                </h5>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-50 min-h-screen">
                    <Header />
                    <main className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            All Info
                        </h2>
                        <h4>Student</h4>
                    </main>
                </div>
            </div>
        );
    }
};

export default Dashboard;
