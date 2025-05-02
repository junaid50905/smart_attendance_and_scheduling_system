import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";

const UpcomingClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcomingClasses = async () => {
            try {
                const res = await api.get("/student/upcoming-classes", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setClasses(res.data.upcoming_classes);
            } catch (error) {
                console.error("Error fetching upcoming classes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingClasses();
    }, []);

    const isWithinAttendanceWindow = (startTimeStr) => {
        const now = new Date();
        const startTime = new Date(startTimeStr);
        const earlyWindow = new Date(startTime.getTime() - 10 * 60000); // 10 min before
        const lateWindow = new Date(startTime.getTime() + 10 * 60000); // 10 min after
        return now >= earlyWindow && now <= lateWindow;
    };

    const handleMarkAttendance = async (classScheduleId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const studentId = user.id;

        try {
            const res = await api.post(
                `/student/mark-attendance/${classScheduleId}/${studentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            alert(res.data.message || "Attendance marked.");
        } catch (error) {
            if (error.response?.status === 409) {
                alert("Attendance already marked.");
            } else {
                alert("Error marking attendance.");
                console.error(error);
            }
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <main className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">
                        Upcoming Classes
                    </h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : classes.length === 0 ? (
                        <p className="text-gray-500">No upcoming classes.</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {classes.map((cls) => {
                                console.log(cls);

                                const now = new Date();
                                const startTime = new Date(cls.start_time);
                                const endTime = new Date(
                                    startTime.getTime() + cls.duration * 60000
                                );

                                let statusBadge = null;

                                if (now >= startTime && now <= endTime) {
                                    // Class is currently running
                                    statusBadge = (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            Class Running
                                        </span>
                                    );
                                } else if (now > endTime) {
                                    // Class has ended
                                    statusBadge = (
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            Class Ended
                                        </span>
                                    );
                                }

                                return (
                                    <div
                                        key={cls.id}
                                        className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-bold text-blue-600">
                                                {cls.batch?.name || "Batch"}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">
                                                    {new Date(
                                                        cls.start_time
                                                    ).toLocaleDateString()}
                                                </span>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-medium">
                                                Start Time:
                                            </span>{" "}
                                            {new Date(
                                                cls.start_time
                                            ).toLocaleTimeString()}
                                        </p>
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-medium">
                                                Duration:
                                            </span>{" "}
                                            {cls.duration} Minutes
                                        </p>
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-medium">
                                                Topic:
                                            </span>{" "}
                                            {cls.topic}
                                        </p>
                                        <p className="text-sm text-gray-700 mb-3">
                                            <span className="font-medium">
                                                Instructor:
                                            </span>{" "}
                                            {cls.instructor?.name || "TBA"}
                                        </p>

                                        <div className="flex gap-2">
                                            {statusBadge}
                                            {cls.attendance && (
                                                <span
                                                    className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${
                                                        cls.attendance
                                                            .status ===
                                                        "present"
                                                            ? "bg-green-100 text-green-800"
                                                            : cls.attendance
                                                                  .status ===
                                                              "late"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {cls.attendance.status}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            disabled={
                                                !isWithinAttendanceWindow(
                                                    cls.start_time
                                                )
                                            }
                                            className={`inline-block mt-2 text-sm text-white px-4 py-2 rounded transition ${
                                                isWithinAttendanceWindow(
                                                    cls.start_time
                                                )
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                            onClick={() =>
                                                handleMarkAttendance(cls.id)
                                            }
                                        >
                                            Mark Attendance
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UpcomingClasses;
