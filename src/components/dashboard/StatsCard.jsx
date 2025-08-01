import React from 'react';

const StatsCard = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;