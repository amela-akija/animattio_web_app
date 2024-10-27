import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReactionTimeTable.css';
import { t } from 'i18next';

interface ReactionTimeTableProps {
  testId: string;
}

const normativeData = {
  1250: { mean: 348.84, stdDev: 59.53, color: "#8884d8" },
  2250: { mean: 393.66, stdDev: 74.68, color: "#82ca9d" },
  4250: { mean: 450.97, stdDev: 105.01, color: "#ff7300" },
};

type Interval = '1250' | '2250' | '4250';

interface IntervalStats {
  mean: number;
  stdDev: number;
  zScore: number;
}

const ReactionTimeTable: React.FC<ReactionTimeTableProps> = ({ testId }) => {
  const [gamesData, setGamesData] = useState<{ [key in Interval]: number[] }>({
    '1250': [],
    '2250': [],
    '4250': [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [intervalStats, setIntervalStats] = useState<{ [key in Interval]: IntervalStats }>({
    '1250': { mean: 0, stdDev: 0, zScore: 0 },
    '2250': { mean: 0, stdDev: 0, zScore: 0 },
    '4250': { mean: 0, stdDev: 0, zScore: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ [key in Interval]: number[] }>(`http://localhost:8080/${testId}/processed-games`);
        setGamesData(response.data);

        const stats = Object.keys(response.data).reduce((acc, interval) => {
          const values = response.data[interval as Interval];
          const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
          const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (values.length - 1);
          const stdDev = Math.sqrt(variance);

          const normativeMean = normativeData[interval as Interval].mean;
          const normativeStdDev = normativeData[interval as Interval].stdDev;
          const zScore = ((mean - normativeMean) / normativeStdDev);

          acc[interval as Interval] = { mean, stdDev, zScore };
          return acc;
        }, {} as { [key in Interval]: IntervalStats });

        setIntervalStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [testId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const intervals = Object.keys(gamesData) as Interval[];

  return (
    <div className="reaction-time-table-container">
      <div>
        <table className="reaction-time-table">
          <thead>
          <tr>
            <th>{t('interval')}</th>
            <th>{t('meanReactionTime')}</th>
            <th>{t('SD')}</th>
            <th>Z-Score</th>
          </tr>
          </thead>
          <tbody>
          {intervals.map(interval => (
            <tr key={interval}>
              <td>{interval === "1250" ? '1s' : interval === "2250" ? '2s' : '4s'}</td>
              <td>{intervalStats[interval]?.mean?.toFixed(2) || '-'}</td>
              <td>{intervalStats[interval]?.stdDev?.toFixed(2) || '-'}</td>
              <td>{intervalStats[interval]?.zScore?.toFixed(2) || '-'}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReactionTimeTable;
