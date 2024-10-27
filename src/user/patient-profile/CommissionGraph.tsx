import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, TooltipItem } from 'chart.js';
import PropTypes from 'prop-types';

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

interface CommissionGraphProps {
  testId: string;
  patientId: string;
}

const CommissionGraph: React.FC<CommissionGraphProps> = ({ testId, patientId }) => {
  const [commissionData, setCommissionData] = useState<{ percentage: number }>({ percentage: 0 });
  const [patientInfo, setPatientInfo] = useState<{ age: number; gender: Gender }>({ age: 0, gender: 'female' });
  const [loading, setLoading] = useState(true);
  const [totalStimuliCount, setTotalStimuliCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalStimuliCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/${testId}/non-stimuli-count`);
        setTotalStimuliCount(response.data);
      } catch (error) {
        console.error('Error fetching total stimuli count:', error);
      }
    };

    fetchTotalStimuliCount();
  }, [testId]);

  useEffect(() => {
    const fetchCommissionData = async () => {
      if (totalStimuliCount === null) return;

      try {
        const response = await axios.get(`http://localhost:8080/${testId}/commissions`);
        const totalCommissionErrors = response.data.totalCommissionErrors;
        const percentageCommission = (totalCommissionErrors / totalStimuliCount) * 100;
        setCommissionData({ percentage: percentageCommission });
        console.log("comission", totalCommissionErrors);
        console.log("stimuli", totalStimuliCount);
      } catch (error) {
        console.error('Error fetching commission data:', error);
      }
    };

    fetchCommissionData();
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
    labels: ['Patient Result', `Normative ${patientInfo.gender}`],
    datasets: [
      {
        label: 'Commission Errors (%)',
        data: [commissionData.percentage, mean],
        backgroundColor: ['rgba(9,62,2,0.6)', 'rgb(248,232,159)'],
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Error of Commission (%)',
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

      ctx.beginPath();
      ctx.moveTo(barX + barWidth / 2, sdTopY);
      ctx.lineTo(barX + barWidth / 2, sdBottomY);
      ctx.strokeStyle = 'rgb(244,219,102)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(barX + barWidth / 2 - 4, sdTopY);
      ctx.lineTo(barX + barWidth / 2 + 4, sdTopY);
      ctx.moveTo(barX + barWidth / 2 - 4, sdBottomY);
      ctx.lineTo(barX + barWidth / 2 + 4, sdBottomY);
      ctx.strokeStyle = 'rgba(230,199,50,0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const errorBarMeanPlusSD = (meanValue + sdValue).toFixed(2);
      const errorBarMeanMinusSD = (meanValue - sdValue).toFixed(2);

      ctx.fillStyle = 'rgba(230,199,50,0.9)';
      ctx.fillText(`${errorBarMeanPlusSD}`, barX + barWidth / 2 + 10, sdTopY - 10);
      ctx.fillText(`${errorBarMeanMinusSD}`, barX + barWidth / 2 + 10, sdBottomY + 15);
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

CommissionGraph.propTypes = {
  testId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
};

export default CommissionGraph;
