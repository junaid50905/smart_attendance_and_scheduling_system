const ScheduleCard = ({ data }) => {
    return (
      <div className="bg-white shadow rounded-xl p-4 border">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">From {data.from} To {data.to}</div>
            <h3 className="text-lg font-semibold mt-1">{data.course}</h3>
            {data.lecture && <p className="text-sm text-gray-600">{data.lecture}</p>}
            {data.link && <a href={data.link} className="text-sm text-blue-500 underline mt-1 inline-block">Join Meeting</a>}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Teacher</div>
            <div className="font-medium text-gray-800">{data.teacher}</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">{data.students}+ students enrolled</div>
        <div className="mt-3 flex gap-2">
          <button className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-50">Cancel</button>
          <button className="text-blue-500 border border-blue-500 px-3 py-1 rounded hover:bg-blue-50">Reschedule</button>
        </div>
      </div>
    );
  };
  
  export default ScheduleCard;