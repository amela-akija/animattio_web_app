import React, { useState, useEffect } from 'react';
import './ReactionTimeTable.css';
import { t } from 'i18next';
import apiClient from '../../services/apiClient';

interface ReactionTimeTableProps {
  testId: string; // // ID of the specified test
}

const normativeData = {
  1250: { mean: 348.84, stdDev: 59.53, color: "#8884d8" },
  2250: { mean: 393.66, stdDev: 74.68, color: "#82ca9d" },
  4250: { mean: 450.97, stdDev: 105.01, color: "#ff7300" },
};
// Available intervals values
type Interval = '1250' | '2250' | '4250';
// Table data
interface IntervalStats {
  mean: number;
  stdDev: number;
  zScore: number;
}

const ReactionTimeTable: React.FC<ReactionTimeTableProps> = ({ testId }) => {
  // Stores the data fetched for each interval value
  const [gamesData, setGamesData] = useState<{ [key in Interval]: number[] }>({
    '1250': [],
    '2250': [],
    '4250': [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  // Stores calculated parameters for each interval
  const [intervalStats, setIntervalStats] = useState<{ [key in Interval]: IntervalStats }>({
    '1250': { mean: 0, stdDev: 0, zScore: 0 },
    '2250': { mean: 0, stdDev: 0, zScore: 0 },
    '4250': { mean: 0, stdDev: 0, zScore: 0 },
  });
// Fetches reaction times data for the test
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<{ [key in Interval]: number[] }>(`/tests/${testId}/processed-games`);
        setGamesData(response.data);
        // Calculates mean, standard deviation, and Z-score for each interval
        const stats = Object.keys(response.data).reduce((acc, interval) => { // Retrieves an array of interval keys from the fetched data
          const values = response.data[interval as Interval]; // Retrieves the array of reaction times for the current interval being processed
          const mean = values.reduce((sum, value) => sum + value, 0) / values.length; // Calculates mean reaction time
          const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (values.length - 1);
          const stdDev = Math.sqrt(variance); // Calculates SD
          // Retrieves the normative mean and SD values for the current interval
          const normativeMean = normativeData[interval as Interval].mean;
          const normativeStdDev = normativeData[interval as Interval].stdDev;
          const zScore = ((mean - normativeMean) / normativeStdDev); // Calculates the Z-score for the interval by comparing the
          // calculated mean with the normative mean, normalized by the normative standard deviation

          acc[interval as Interval] = { mean, stdDev, zScore };
          return acc; // Used for iteration, it is an object that stores computed stats for all intervals
        }, {} as { [key in Interval]: IntervalStats });

        setIntervalStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [testId]); // Executes when the testId changes

  if (loading) {
    return <div>Loading...</div>;
  }

  const intervals = Object.keys(gamesData) as Interval[]; // retrieves the keys of the gamesData object

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
              <td>{intervalStats[interval]?.mean?.toFixed(0) || '-'}</td>
              <td>{intervalStats[interval]?.stdDev?.toFixed(0) || '-'}</td>
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
