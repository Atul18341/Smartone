import React from 'react';

const HistoryCard = ({ historyItems }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden md:max-w-2xl my-4">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img className="h-48 w-full object-cover md:w-48" src="https://via.placeholder.com/150" alt="History" />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">History</div>
          <ul className="mt-4 space-y-2">
            {historyItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
                <div className="text-gray-700">
                  <p className="font-medium">{item.date}</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;