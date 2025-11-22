
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MemberApplication } from '../../types';

interface ChartProps {
  members: MemberApplication[];
}

const MemberDistributionChart: React.FC<ChartProps> = ({ members }) => {
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Members" fill="#0D47A1" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default MemberDistributionChart;
