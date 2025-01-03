import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, TooltipItem } from 'chart.js';
import PropTypes from 'prop-types';
import { t } from 'i18next';
import apiClient from '../../services/apiClient';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

type Gender = 'female' | 'male';
// Normative data interface
interface NormativeDataValue {
  mean: number;
  sd: number;
}
// Normative data grouped by age and gender interface
interface NormativeDataType {
  [ageGroup: string]: {
    female: NormativeDataValue;
    male: NormativeDataValue;
  };
}

const NormativeData: NormativeDataType = {
  '9-11': {
    female: { mean: 58.2, sd: 17.8 },
    male: { mean: 68.3, sd: 17.3 },
  },
  '12-13': {
    female: { mean: 52.3, sd: 20.6 },
    male: { mean: 66.3, sd: 16.9 },
  },
  '14-15': {
    female: { mean: 45.1, sd: 22.4 },
    male: { mean: 59.9, sd: 22.1 },
  },
  '16-18': {
    female: { mean: 40.5, sd: 22.2 },
    male: { mean: 53.6, sd: 18.9 },
  },
};
// Props interface for the CommissionGraph of specified user and specified test
interface CommissionGraphProps {
  testId: string;
  patientId: string;
}

const CommissionGraph: React.FC<CommissionGraphProps> = ({ testId, patientId }) => {
  const [commissionData, setCommissionData] = useState<{ totalCommissionErrors: number; percentage: number }>({
    totalCommissionErrors: 0,
    percentage: 0,
  });
  const [patientInfo, setPatientInfo] = useState<{ age: number; gender: Gender }>({ age: 0, gender: 'female' });
  const [loading, setLoading] = useState(true);
  const [totalStimuliCount, setTotalStimuliCount] = useState<number | null>(null);
  // Fetches the total count of non-stimuli for the specified test
  useEffect(() => {
    const fetchTotalStimuliCount = async () => {
      try {
        const response = await apiClient.get(`/tests/${testId}/non-stimuli-count`);
        setTotalStimuliCount(response.data);
      } catch (error) {
        console.error('Error fetching total stimuli count:', error);
      }
    };

    fetchTotalStimuliCount();
  }, [testId]); // User can navigate between all patient's tests
// Fetch commissions amount
  useEffect(() => {
    const fetchCommissionData = async () => {
      if (totalStimuliCount === null) return;

      try {
        const response = await apiClient.get(`/tests/${testId}/commissions`);
        const totalCommissionErrors = response.data.totalCommissionErrors;
        const percentageCommission = (totalCommissionErrors / totalStimuliCount) * 100; // Calculates percentage

        setCommissionData({
          totalCommissionErrors,
          percentage: percentageCommission,
        });
      } catch (error) {
        console.error('Error fetching commission data:', error);
      }
    };

    fetchCommissionData();
  }, [testId, totalStimuliCount]);
// Fetches patient info for normative data
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const [ageResponse, genderResponse] = await Promise.all([
          apiClient.get(`/patients/${patientId}/age`),
          apiClient.get(`/patients/${patientId}/gender`),
        ]);
        setPatientInfo({ age: ageResponse.data, gender: genderResponse.data });
      } catch (error) {
        console.error('Error fetching patient info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientInfo();
  }, [patientId]); // Ensures that the effect runs only when patientId changes

  if (loading || totalStimuliCount === null) return <div>Loading...</div>;
  // Determines normative data based on patient age and gender
  const getNormativeData = () => {
    let ageGroup: keyof typeof NormativeData = '9-11';
    if (patientInfo.age >= 12 && patientInfo.age <= 13) {
      ageGroup = '12-13';
    } else if (patientInfo.age >= 14 && patientInfo.age <= 15) {
      ageGroup = '14-15';
    } else if (patientInfo.age >= 16 && patientInfo.age <= 18) {
      ageGroup = '16-18';
    }
    const gender: Gender = patientInfo.gender.toLowerCase() as Gender;

    return NormativeData[ageGroup][gender];
  };
  // Values of normative data - mean and SD
  const normativeData = getNormativeData();
  const mean = normativeData.mean ?? 0;
  const sd = normativeData.sd ?? 0;
  // Data for the Commission graph
  const chartData = {
    labels: [t('patientResult'), t('normative')],
    datasets: [
      {
        label: 'Omission Errors (%)',
        data: [commissionData.percentage, mean],
        backgroundColor: ['rgba(9,62,2,0.6)', 'rgb(248,232,159)'],
      },
    ],
  };
  // Graph formatting
  const chartOptions = {
    scales: {
      y: {
        title: {
          display: true,
          text: t('errorCommission'),
        },
        min: 0,
        max: (() => {
          const maxCommissionValue = commissionData.percentage;
          const maxNormativeValue = mean + sd;
          const maxDataValue = Math.max(maxCommissionValue, maxNormativeValue); // Determines the larger number between the result and normative data
          const buffer = maxDataValue * 0.1; // Adds a 10% buffer to the max value so it has some space above until top of chart
          return Math.ceil(maxDataValue + buffer); // Rounds the result up to the nearest whole number for y-axis
        })(),
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const value = context.parsed.y;
            return `${value.toFixed(2)}%`; // Tooltip formatting when user hover over the graph
          },
        },
      },
    },
  };


// Error bar formatting
  const errorBarPlugin = {
    id: 'errorBarPlugin',
    afterDraw: (chart: Chart) => { // afterDraw: a method executed after the chart has been drawn, allowing to draw custom graphics on chart
      const ctx = chart.ctx; // Canvas rendering context used for drawing
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;
      const dataset = chart.data.datasets[0]; // Patient data and normative data
      const dataIndex = dataset.data.length - 1; // Normativa data values

      const meanValue = dataset.data[dataIndex] as number; // Retrieves mean normative value
      const sdValue = normativeData.sd ?? 0; // Retrieves SD normative value

      const barWidth = xAxis.width / dataset.data.length;
      const barX = xAxis.getPixelForValue(dataIndex) - barWidth / 2;
      // Calculates the Y-coordinates for the top and bottom of the error bar, ensuring the bottom doesn't go below 0
      const sdTopY = yAxis.getPixelForValue(meanValue + sdValue);
      const sdBottomY = yAxis.getPixelForValue(Math.max(meanValue - sdValue, 0));
      // Formatting
      ctx.fillStyle = 'rgba(244,219,102,0.2)';
      ctx.fillRect(barX, sdTopY, barWidth, sdBottomY - sdTopY); // Rectangle symbolizing SD
      // Labels
      ctx.font = '10px Arial';
      ctx.fillStyle = 'rgba(230,199,50,0.9)';
      ctx.fillText(`+${(meanValue + sdValue).toFixed(2)}`, barX + barWidth / 2 + 15, sdTopY - 5);
      if (meanValue - sdValue >= 0) {
        ctx.fillText(`-${(meanValue - sdValue).toFixed(2)}`, barX + barWidth / 2 + 15, sdBottomY + 12);
      }
    },
  };


  return (
    <div>
      <table
        style={{
          // marginLeft: '10%',
          border: '1px solid #2A470C',
          borderCollapse: 'collapse',
          width: 'fit-content',
          color: '#2A470C',
          textAlign: 'right',
          fontFamily: 'Karla'
        }}>
        <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#2A470C', color: '#FFFBEE', textAlign:"center" }}>{t('nonStimuliCount')}</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#2A470C', color: '#FFFBEE', textAlign:"center" }}>{t('commissionCount')}</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#2A470C', color: '#FFFBEE', textAlign:"center" }}>{t('commissionPercentage')}</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#2A470C', color: '#FFFBEE', textAlign:"center" }}>{t('normative')}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{totalStimuliCount}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>
            {commissionData.totalCommissionErrors}
          </td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>
            {commissionData.percentage.toFixed(2)}%
          </td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>
            {mean.toFixed(2)}%
          </td>
        </tr>
        </tbody>
      </table>
      <Bar data={chartData} options={chartOptions} plugins={[errorBarPlugin]} />
    </div>
  );
};

CommissionGraph.propTypes = {
  testId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
};

export default CommissionGraph;
