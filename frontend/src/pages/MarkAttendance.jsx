// src/pages/MarkAttendance.jsx
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useState } from 'react';

const mockAttendanceData = [
  {
    id: 1,
    course: 'Behavioral Economics',
    time: '09:00 AM - 10:30 AM',
    instructor: 'Julie Dawson',
    isMarked: false
  },
  {
    id: 2,
    course: 'Microeconomics',
    time: '11:00 AM - 12:30 PM',
    instructor: 'Ida Aguirre',
    isMarked: false
  }
];

const MarkAttendance = () => {
  const [attendanceList, setAttendanceList] = useState(mockAttendanceData);

  const handleMarkAttendance = (id) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isMarked: true } : item
      )
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Mark Attendance</h2>
          <div className="space-y-4">
            {attendanceList.map((session) => (
              <div
                key={session.id}
                className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">{session.course}</h3>
                  <p className="text-sm text-gray-600">Instructor: {session.instructor}</p>
                  <p className="text-sm text-gray-600">Time: {session.time}</p>
                </div>
                {session.isMarked ? (
                  <span className="text-green-600 font-medium">Attendance Marked</span>
                ) : (
                  <button
                    onClick={() => handleMarkAttendance(session.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Mark Present
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarkAttendance;
