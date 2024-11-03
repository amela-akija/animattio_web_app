import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, TooltipItem } from 'chart.js';
import PropTypes from 'prop-types';
import { t } from 'i18next';

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
  '12-13': { female: { mean: 5.4, sd: 6.4 }, male: { mean: 3.5, sd: 5.1 } },
  '14-15': { female: { mean: 2.3, sd: 6.4 }, male: { mean: 3.0, sd: 5.1 } },
  '16-18': { female: { mean: 2.1, sd: 6.4 }, male: { mean: 2.9, sd: 5.1 } },
};

interface OmissionGraphProps {
  testId: string;
  patientId: string;
}

const OmissionGraph: React.FC<OmissionGraphProps> = ({ testId, patientId }) => {
  const [omissionData, setOmissionData] = useState<{ percentage: number }>({ percentage: 0 });
  const [patientInfo, setPatientInfo] = useState<{ age: number; gender: Gender }>({ age: 0, gender: 'female' });
  const [loading, setLoading] = useState(true);
  const [totalStimuliCount, setTotalStimuliCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalStimuliCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/${testId}/stimuli-count`);
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
        const response = await axios.get(`http://localhost:8080/${testId}/omissions`);
        const totalOmissionErrors = response.data.totalOmissionErrors;
        const percentageOmission = (totalOmissionErrors / totalStimuliCount) * 100;
        setOmissionData({ percentage: percentageOmission });
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
          axios.get(`http://localhost:8080/patients/${patientId}/age`),
          axios.get(`http://localhost:8080/patients/${patientId}/gender`),
        ]);
        setPatientInfo({ age: ageResponse.data, gender: genderResponse.data as Gender });
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
      const sdBottomY = yAxis.getPixelForValue(meanValue - sdValue);

      ctx.fillStyle = 'rgba(244,219,102,0.2)';
      ctx.fillRect(barX, sdTopY, barWidth, sdBottomY - sdTopY);

      // ctx.beginPath();
      // ctx.arc(barX + barWidth / 2, yAxis.getPixelForValue(meanValue), 4, 0, 2 * Math.PI);
      // ctx.fillStyle = 'rgba(9,62,2,0.8)';
      // ctx.fill();

      ctx.font = '10px Arial';
      ctx.fillStyle = 'rgba(230,199,50,0.9)';
      ctx.fillText(`+${(meanValue + sdValue).toFixed(2)}`, barX + barWidth / 2 + 15, sdTopY - 5);
      ctx.fillText(`-${(meanValue - sdValue).toFixed(2)}`, barX + barWidth / 2 + 15, sdBottomY + 12);
    },
  };

  return (
    <div>
      <Bar
        data={chartData}
        options={chartOptions}
        plugins={[errorBarPlugin]}
      />
    </div>
  );
};

OmissionGraph.propTypes = {
  testId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
};

export default OmissionGraph;
