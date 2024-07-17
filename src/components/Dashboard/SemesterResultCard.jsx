import React from 'react';

const SemesterResultCard = () => {
  const semesters = [
    { semester: 1, cgpa: 3.8 },
    { semester: 2, cgpa: 3.9 },
    { semester: 3, cgpa: 3.7 },
    { semester: 4, cgpa: 3.6 },
    { semester: 5, cgpa: 3.5 },
    { semester: 6, cgpa: 3.8 }
  ];

  return (
    <div className="bg-[#dadad] shadow-md rounded-lg p-6 w-full md:w-72">
      <h2 className="text-xl font-semibold mb-4">Semester Results</h2>
      <div className="grid grid-cols-2 gap-4">
        {semesters.map(({ semester, cgpa }) => (
          <div key={semester} className="border border-gray-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Semester {semester}</h3>
            <p className="text-gray-600">CGPA: {cgpa}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterResultCard;