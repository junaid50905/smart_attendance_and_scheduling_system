import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "Asia/Dhaka";

const UpcomingClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcomingClasses = async () => {
            try {
                const res = await api.get("/student/upcoming-classes", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setClasses(res.data.upcoming_classes);
                console.log(res.data.upcoming_classes);
            } catch (error) {
                console.error("Error fetching upcoming classes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingClasses();
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <main className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Upcoming Classes</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : classes.length === 0 ? (
                        <p className="text-gray-500">No upcoming classes.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {classes.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="p-5 bg-white rounded-lg shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {cls.topic}
                                    </h5>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">
                                        <strong>Batch:</strong> {cls.batch?.name} <br />
                                        <strong>Instructor:</strong> {cls.instructor?.name} <br />
                                        <strong>Start Time:</strong>{" "}
                                        {dayjs
                                            .utc(cls.start_time)
                                            .tz(TIMEZONE)
                                            .format("dddd, MMM D - hh:mm A")}{" "}
                                        <br />
                                        <strong>Duration:</strong> {cls.duration} minutes <br />
                                        <strong>Starts In:</strong>{" "}
                                        <Countdown
                                            date={dayjs
                                                .utc(cls.start_time)
                                                .tz(TIMEZONE)
                                                .toDate()}
                                        />
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UpcomingClasses;
