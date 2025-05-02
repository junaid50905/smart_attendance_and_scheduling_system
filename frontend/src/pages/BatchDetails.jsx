import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./../services/api";
import Sidebar from "./../components/Sidebar";
import Header from "./../components/Header";
import { CirclePlus } from "lucide-react";
import { CircleX } from "lucide-react";

const BatchDetails = () => {
    const { id } = useParams();
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        topic: "",
        start_time: "",
        duration: "",
    });

    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const res = await api.get(`/${role}/batches/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setBatch(res.data);
            } catch (err) {
                console.error("Error fetching batch details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBatch();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSchedule((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // const handleCreateSchedule = async () => {
    //     try {
    //         // Example API request to create the schedule
    //         await api.post("/create-schedule", newSchedule, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             },
    //         });
    //         // Close the modal after creation
    //         setShowModal(false);
    //         // Optionally, refresh the batch data
    //         const res = await api.get(`/${role}/batches/${id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             },
    //         });
    //         setBatch(res.data);

    //     } catch (err) {
    //         console.error("Error creating schedule", err);
    //     }
    // };

    const handleCreateSchedule = async () => {
        const instructorId = user.id

        try {
            const res = await api.post(
                `/${role}/batches/${id}/create-new-schedule-class/${instructorId}`,
                newSchedule,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            console.log("Schedule created:", res.data);

            setShowModal(false);

            // Refresh the batch data
            const refreshed = await api.get(`/${role}/batches/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setBatch(refreshed.data);
        } catch (err) {
            console.error(
                "Error creating schedule:",
                err.response?.data || err.message
            );
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <main className="p-6">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-4 gap-6">
                            {/* Left Column - Batch Info (takes 3/4 width) */}
                            <div className="col-span-3 bg-white rounded shadow p-6">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Batch Information
                                </h2>
                                <h2 className="text-xl mb-2">
                                    <strong>Batch Name:</strong>{" "}
                                    {batch.batch_name}
                                </h2>

                                {/* Button to open the modal */}
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-4 p-2 bg-blue-500 text-white rounded flex items-center"
                                >
                                    <CirclePlus className="mr-2" /> Create new
                                    schedule class
                                </button>

                                {/* Class Schedules Section */}
                                <div className="mt-6">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">
                                            Schedule Classes:{" "}
                                            {batch.schedule_count}
                                        </h3>
                                    </div>
                                    {batch.class_schedules.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {batch.class_schedules.map(
                                                (schedule, index) => (
                                                    <div
                                                        key={index}
                                                        className="border rounded p-4 shadow-sm bg-gray-50"
                                                    >
                                                        <p className="text-gray-700">
                                                            <strong>
                                                                Topic:
                                                            </strong>{" "}
                                                            {schedule.topic}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <strong>
                                                                Start Time:
                                                            </strong>{" "}
                                                            {
                                                                schedule.start_time
                                                            }
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <strong>
                                                                Duration:
                                                            </strong>{" "}
                                                            {schedule.duration}{" "}
                                                            mins
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <strong>
                                                                Instructor:
                                                            </strong>{" "}
                                                            {schedule.instructor
                                                                ? schedule
                                                                      .instructor
                                                                      .name
                                                                : "N/A"}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">
                                            No schedules available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Students (takes 1/4 width) */}
                            <div className="col-span-1 bg-white rounded shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Students ({batch.total_students})
                                </h2>
                                <ul className="list-disc list-inside space-y-1">
                                    {batch.batch_students.map(
                                        (student, index) => (
                                            <li key={index}>{student.name}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal for Creating Schedule Class */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-opacity-30 flex justify-center items-center"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-gray-500 text-white p-6 rounded shadow-lg w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="text-xl font-semibold">
                                Create New Schedule Class
                            </h4>
                            <CircleX
                                className="cursor-pointer"
                                onClick={() => setShowModal(false)}
                            />
                        </div>
                        <hr className="mt-4 mb-3" />

                        <form>
                            {/* Topic Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium">
                                    Topic
                                </label>
                                <input
                                    type="text"
                                    name="topic"
                                    value={newSchedule.topic}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 w-full border border-gray-300 rounded"
                                    placeholder="Enter topic"
                                />
                            </div>

                            {/* Start Time Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium">
                                    Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="start_time"
                                    value={newSchedule.start_time}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 w-full border border-gray-300 rounded"
                                />
                            </div>

                            {/* Duration Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={newSchedule.duration}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 w-full border border-gray-300 rounded"
                                    placeholder="Enter duration"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleCreateSchedule}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Create Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BatchDetails;
