
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MemberApplication } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ChartProps {
  members: MemberApplication[];
}

const MemberDistributionChart: React.FC<ChartProps> = ({ members }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#E5E7EB' : '#374151'; // gray-200 or gray-700
  const gridColor = theme === 'dark' ? '#4B5563' : '#D1D5DB'; // gray-600 or gray-300

  const data = useMemo(() => {
    const stateCounts: { [key: string]: number } = {};
    members.forEach(member => {
      stateCounts[member.state] = (stateCounts[member.state] || 0) + 1;
    });
    return Object.keys(stateCounts).map(state => ({
      name: state,
      Members: stateCounts[state],
    })).sort((a,b) => b.Members - a.Members);
  }, [members]);

  return (
    <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
            <BarChart
            data={data}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: tickColor }} />
            <YAxis tick={{ fill: tickColor }} />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', // gray-800 or white
                    borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB' // gray-600 or gray-300
                }}
                labelStyle={{ color: tickColor }}
                itemStyle={{ color: '#1565C0' }} // secondary color
            />
            <Legend wrapperStyle={{ color: tickColor }} />
            <Bar dataKey="Members" fill="#0D47A1" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default MemberDistributionChart;
