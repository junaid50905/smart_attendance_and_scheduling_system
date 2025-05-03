import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";

const UpcomingClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchUpcomingClasses = async () => {
            try {
                const res = await api.get("/student/upcoming-classes", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

        // Update current time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleMarkAttendance = async (classScheduleId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const studentId = user.id;

        try {
            const res = await api.post(
                `/student/mark-attendance/${classScheduleId}/${studentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            alert(res.data.message || "Attendance marked.");

            // Update local state to reflect attendance
            setClasses((prevClasses) =>
                prevClasses.map((cls) =>
                    cls.id === classScheduleId
                        ? { ...cls, attendance: { status: "present" } }
                        : cls
                )
            );
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
                                const startTime = new Date(cls.start_time);
                                const endTime = new Date(startTime.getTime() + cls.duration * 60000);
                                const attendanceWindowEnd = new Date(startTime.getTime() + 10 * 60000);
                                const isExactlyStartTime = Math.abs(currentTime - startTime) < 1000;
                                const isWithinAttendanceWindow = currentTime >= startTime && currentTime <= attendanceWindowEnd;
                                const isAttendanceMarked = cls.attendance?.status === "present";
                                const isButtonDisabled = currentTime > endTime || isAttendanceMarked;

                                const renderer = ({ minutes, seconds, completed }) => {
                                    return completed ? (
                                        <span>Attendance window closed</span>
                                    ) : (
                                        <span>
                                            Time left for attendance: {minutes}:
                                            {seconds < 10 ? `0${seconds}` : seconds}
                                        </span>
                                    );
                                };

                                return (
                                    <div
                                        key={cls.id}
                                        className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-bold text-blue-600">
                                                {cls.batch?.name || "Batch"} {cls.id}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">
                                                    {cls.formatted_start_time}
                                                </span>
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-medium">Duration:</span> {cls.duration} Minutes
                                        </p>
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-medium">Topic:</span> {cls.topic}
                                        </p>
                                        <p className="text-sm text-gray-700 mb-3">
                                            <span className="font-medium">Instructor:</span> {cls.instructor?.name || "TBA"}
                                        </p>

                                        <div className="flex gap-2">
                                            {currentTime > startTime && currentTime <= endTime && !isExactlyStartTime && (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    Class Running
                                                </span>
                                            )}
                                            {currentTime > endTime && (
                                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    Class Ended
                                                </span>
                                            )}
                                            {cls.attendance && (
                                                <span
                                                    className={`text-xs font-medium px-2.5 py-0.5 rounded-sm ${
                                                        cls.attendance.status === "present"
                                                            ? "bg-green-100 text-green-800"
                                                            : cls.attendance.status === "late"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {cls.attendance.status}
                                                </span>
                                            )}
                                        </div>

                                        {isWithinAttendanceWindow && !isAttendanceMarked && (
                                            <div className="mt-2">
                                                <Countdown date={attendanceWindowEnd} renderer={renderer} />
                                            </div>
                                        )}

                                        <button
                                            disabled={isButtonDisabled}
                                            className={`inline-block mt-2 text-sm text-white px-4 py-2 rounded transition ${
                                                !isButtonDisabled
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                            onClick={() => handleMarkAttendance(cls.id)}
                                        >
                                            {isAttendanceMarked ? "Attendance Marked" : "Mark Attendance"}
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
