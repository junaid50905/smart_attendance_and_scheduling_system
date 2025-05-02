import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";

const Dashboard = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    const [instructorStat, setInstructorStat] = useState([])

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
                setData(response.data.overallinfo)
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setData([]); // fallback
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    useEffect(() => {
        const fetchInstructorStat = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get(`/${role}/statistics`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInstructorStat(response.batches)
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setInstructorStat([]); // fallback
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorStat();
    }, []);

    console.log(instructorStat);
    

    if (role == 'admin') {
      return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <main className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">All Info</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
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
                    )}
                </main>
            </div>
        </div>
    );
    } else if(role == 'instructor') {
      return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <main className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">All Info</h2>
                    <h4>Instructor</h4>
                </main>
            </div>
        </div>
    );
    }else{
      return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <main className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">All Info</h2>
                    <h4>Studnet</h4>
                </main>
            </div>
        </div>
    );
    }

    
};

export default Dashboard;
