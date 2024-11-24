import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const Graph = ({ graphType, data }) => {
  if (!data) return null;

  return (
    <div style={{ marginTop: '30px' }}>
      {graphType?.value === 'bar' && <Bar data={data} />}
      {graphType?.value === 'pie' && <Pie data={data} />}
    </div>
  );
};

export default Graph;
