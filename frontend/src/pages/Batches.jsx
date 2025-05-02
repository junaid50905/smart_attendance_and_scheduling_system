import { useEffect, useState } from "react";
import api from "./../services/api";
import Sidebar from "./../components/Sidebar";
import Header from "./../components/Header";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const Batches = () => {
    const [batches, setBatches] = useState([]);
    const [totalBatch, setTotalBatch] = useState(0);
    const [loading, setLoading] = useState(true);

    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const res = await api.get(`/${role}/batches`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setBatches(res.data.batches.batch_info);
                setTotalBatch(res.data.batches.total_batches);
            } catch (error) {
                console.error("Failed to fetch batches", error);
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
                    <h2 className="text-2xl font-semibold mb-6">
                        Total Batches : {totalBatch}
                    </h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                            {batches.map((batch, index) => (
                                <>
                                {/* {console.log(batch)
                                } */}
                                    <Link
                                        key={index}
                                        to={`/batches/${batch.batch_id}`}
                                    >
                                        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition">
                                            <h5 className="text-xl tracking-tight text-gray-500 mb-6">
                                                {batch.batch_name}
                                            </h5>
                                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center mb-2">
                                                <Users
                                                    className="mr-2"
                                                    title="Total students"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-2xl">
                                                        {batch.batch_students}
                                                    </span>
                                                    <span className="text-sm text-gray-500 font-normal">
                                                        Students
                                                    </span>
                                                </div>
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600">
                                                {batch.batch_schedules} Schedule
                                                Class(s)
                                            </p>
                                        </div>
                                    </Link>
                                </>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Batches;
