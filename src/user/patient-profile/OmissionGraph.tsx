import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, TooltipItem } from 'chart.js';
import PropTypes from 'prop-types';
import { t } from 'i18next';
import apiClient from '../../services/apiClient';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

type Gender = 'female' | 'male';

interface NormativeDataValue {
  mean: number;
  sd: number;
}

interface NormativeDataType {
  [ageGroup: string]: {
    female: NormativeDataValue;
    male: NormativeDataValue;
  };
}

const NormativeData: NormativeDataType = {
  '9-11': { female: { mean: 6.7, sd: 6.4 }, male: { mean: 6.5, sd: 5.1 } },
  '12-13': { female: { mean: 3.5, sd: 3.1 }, male: { mean: 5.4, sd: 4.7 } },
  '14-15': { female: { mean: 2.3, sd: 3.8 }, male: { mean: 3.0, sd: 5.0 } },
  '16-18': { female: { mean: 2.1, sd: 3.4 }, male: { mean: 2.9, sd: 3.0 } },
};

interface OmissionGraphProps {
  testId: string;
  patientId: string;
}

const OmissionGraph: React.FC<OmissionGraphProps> = ({ testId, patientId }) => {
  const [omissionData, setOmissionData] = useState<{ count: number; percentage: number }>({ count: 0, percentage: 0 });
  const [patientInfo, setPatientInfo] = useState<{ age: number; gender: Gender }>({ age: 0, gender: 'female' });
  const [loading, setLoading] = useState(true);
  const [totalStimuliCount, setTotalStimuliCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalStimuliCount = async () => {
      try {
        const response = await apiClient.get(`/tests/${testId}/stimuli-count`);
        setTotalStimuliCount(response.data);
      } catch (error) {
        console.error('Error fetching total stimuli count:', error);
      }
    };

    fetchTotalStimuliCount();
  }, [testId]);

  useEffect(() => {
    const fetchOmissionData = async () => {
      if (totalStimuliCount === null) return;

      try {
        const response = await apiClient.get(`/tests/${testId}/omissions`);
        const totalOmissionErrors = response.data.totalOmissionErrors;
        const percentageOmission = ((totalOmissionErrors / totalStimuliCount) * 100).toFixed(2);
        setOmissionData({ count: totalOmissionErrors, percentage: parseFloat(percentageOmission) });
      } catch (error) {
        console.error('Error fetching omission data:', error);
      }
    };

    fetchOmissionData();
  }, [testId, totalStimuliCount]);

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
  }, [patientId]);

  if (loading) return <div>Loading...</div>;

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

  const normativeData = getNormativeData();
  const mean = normativeData.mean ?? 0;
  const sd = normativeData.sd ?? 0;

  const chartData = {
    labels: [t('patientResult'), t('normative')],
    datasets: [
      {
        label: 'Omission Errors (%)',
        data: [omissionData.percentage, mean],
        backgroundColor: ['rgba(9,62,2,0.6)', 'rgb(248,232,159)'],
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        title: {
          display: true,
          text: t('errorOmission'),
        },
        min: 0,
        max: (() => {
          const maxDataValue = omissionData.percentage + sd;
          const buffer = maxDataValue * 0.1;
          return Math.ceil(maxDataValue + buffer);
        })(),
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const value = context.parsed.y;
            return `${value.toFixed(2)}%`;
          },
        },
      },
    },
  };


  const errorBarPlugin = {
    id: 'errorBarPlugin',
    afterDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;
      const dataset = chart.data.datasets[0];
      const dataIndex = dataset.data.length - 1;

      const meanValue = dataset.data[dataIndex] as number;
      const sdValue = normativeData.sd ?? 0;

      const barWidth = xAxis.width / dataset.data.length;
      const barX = xAxis.getPixelForValue(dataIndex) - barWidth / 2;

      const sdTopY = yAxis.getPixelForValue(meanValue + sdValue);
      const sdBottomY = yAxis.getPixelForValue(Math.max(meanValue - sdValue, 0));

      ctx.fillStyle = 'rgba(244,219,102,0.2)';
      ctx.fillRect(barX, sdTopY, barWidth, sdBottomY - sdTopY);

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
          border: '1px solid #2A470C',
          borderCollapse: 'collapse',
          width: 'fit-content',
          marginLeft:'10%',
          color: '#2A470C',
          textAlign: 'right',
          fontFamily: 'Karla',
        }}>
        <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#2A470C', color: '#FFFBEE', textAlign:"center" }}>
            {t('stimuliCount')}
          </th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#2A470C', color: '#FFFBEE' , textAlign:"center"}}>
            {t('omissionsCount')}
          </th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#2A470C', color: '#FFFBEE', textAlign:"center" }}>
            {t('omissionPercentage')}
          </th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#2A470C', color: '#FFFBEE', textAlign:"center" }}>
            {t('normative')}
          </th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{totalStimuliCount}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{omissionData.count}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{omissionData.percentage}%</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{normativeData.mean}%</td>
        </tr>
        </tbody>
      </table>
      <Bar data={chartData} options={chartOptions} plugins={[errorBarPlugin]}/>
    </div>
  );
};

OmissionGraph.propTypes = {
  testId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
};

export default OmissionGraph;
