
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color = 'blue' }) => {
  const colors = {
    blue: 'border-blue-500 text-blue-500',
    green: 'border-green-500 text-green-500',
    yellow: 'border-yellow-500 text-yellow-500',
    red: 'border-red-500 text-red-500',
  };

  return (
    <div className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${colors[color]}`}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-dark">{value}</p>
    </div>
  );
};

export default StatCard;
