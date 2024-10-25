import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import PropTypes from 'prop-types';

Chart.register(CategoryScale, LinearScale, BarElement, Title);

interface OmissionGraphProps {
  testId: string;
}

const NormativeData = {
  '9-11': {
    female: 6.7,
    male: 6.5
  },
};

const OmissionGraph: React.FC<OmissionGraphProps> = ({ testId }) => {
  const [omissionData, setOmissionData] = useState<{ percentage: number }>({ percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOmissionData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/${testId}/omissions`);
        const totalOmissionErrors = response.data.totalOmissionErrors;
        const percentageOmission = (totalOmissionErrors / 360) * 100;
        setOmissionData({ percentage: percentageOmission });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOmissionData();
  }, [testId]);

  if (loading) return <div>Loading...</div>;

  const chartData = {
    labels: ['Your Result', 'Normative Female', 'Normative Male'],
    datasets: [
      {
        label: 'Omission Errors (%)',
        data: [omissionData.percentage, NormativeData['9-11'].female, NormativeData['9-11'].male],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
      },
    ],
  };

  return (
    <div>
      <h2>Omission Errors Comparison</h2>
      <Bar data={chartData} />
    </div>
  );
};

OmissionGraph.propTypes = {
  testId: PropTypes.string.isRequired,
};

export default OmissionGraph;
