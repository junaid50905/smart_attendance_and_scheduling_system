// src/pages/UpcomingClasses.jsx
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const upcomingClasses = [
  {
    id: 1,
    date: '2025-05-02',
    time: '10:00 AM - 11:30 AM',
    course: 'Macroeconomics',
    topic: 'GDP & Inflation',
    instructor: 'Dr. Sarah Thompson',
    link: 'https://meet.google.com/example123'
  },
  {
    id: 2,
    date: '2025-05-03',
    time: '2:00 PM - 3:30 PM',
    course: 'Microeconomics',
    topic: 'Consumer Behavior',
    instructor: 'Prof. Mark Reynolds',
    link: 'https://meet.google.com/example456'
  }
];

const UpcomingClasses = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Upcoming Classes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-blue-600">{cls.course}</h3>
                  <span className="text-sm text-gray-500">{cls.date}</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Time:</span> {cls.time}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Topic:</span> {cls.topic}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">Instructor:</span> {cls.instructor}
                </p>
                <a
                  href={cls.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Join Class
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpcomingClasses;
