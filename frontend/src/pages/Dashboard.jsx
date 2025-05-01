import Sidebar from '../components/Sidebar';
import ScheduleCard from '../components/ScheduleCard';
import Header from '../components/Header';

const mockSchedule = [
  {
    id: 1,
    from: '09:00 AM',
    to: '10:20 AM',
    course: 'Behavioral Economics',
    lecture: 'Cognitive Biases and Decision Making',
    link: 'https://meet.google.com/les02-efg',
    teacher: 'Julie Dawson',
    students: 13
  },
  {
    id: 2,
    from: '01:20 PM',
    to: '03:00 PM',
    course: 'International Economics',
    teacher: 'Ida Aguirre',
    students: 10
  }
];

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header /> {/* 🔹 Header at the top of main content */}
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Today’s Classes</h2>
          <div className="space-y-4">
            {mockSchedule.map(classItem => (
              <ScheduleCard key={classItem.id} data={classItem} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
