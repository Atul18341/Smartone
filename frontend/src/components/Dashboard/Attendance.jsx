import React from 'react';

const AttendanceDashboard = ({ presentPercentage }) => {
  const absentPercentage = 100 - presentPercentage;

  return (
    <div className="flex items-center justify-center h-fit">
      <div className="relative flex items-center justify-center w-52 h-52">
        <svg className="absolute w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            style={{color:"#8ccccc"}}
            strokeWidth="4"
            strokeDasharray={`${presentPercentage}, 100`}
            stroke="currentColor"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="flex flex-col items-center justify-center">
          <span className="text-3xl font-bold " style={{color:"#8ccccc"}}>{presentPercentage}%</span>
          <span className="text-lg text-gray-600">Present</span>
          <span className="mt-2 text-3xl font-bold" style={{color:"red"}}>{absentPercentage}%</span>
          <span className="text-lg text-gray-600">Absent</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;