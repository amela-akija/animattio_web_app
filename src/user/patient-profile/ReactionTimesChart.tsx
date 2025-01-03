import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ErrorBar,
  ReferenceArea
} from 'recharts';
import { t } from 'i18next';
import apiClient from '../../services/apiClient';

interface ReactionTimesProps {
  testId: string;
}

const ReactionTimesChart: React.FC<ReactionTimesProps> = ({ testId }) => {
  // State for holding the data for each interval
  const [gamesData, setGamesData] = useState<{ [key: string]: number[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  // State to track what interval data is visible
  const [activeIntervals, setActiveIntervals] = useState<{ [key: string]: boolean }>({});

  const normativeData = {
    1250: { mean: 348.84, stdDev: 59.53, color: "#8884d8" },
    2250: { mean: 393.66, stdDev: 74.68, color: "#82ca9d" },
    4250: { mean: 450.97, stdDev: 105.01, color: "#ff7300" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<{ [key: string]: number[] }>(`/tests/${testId}/processed-games`);
        setGamesData(response.data);
        // Loops over all the interval keys in the response
        const initialActiveIntervals = Object.keys(response.data).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as { [key: string]: boolean }); // All intervals visible

        setActiveIntervals(initialActiveIntervals);
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
// Extracts the interval keys from the gamesData
  const intervals = Object.keys(gamesData) as Array<"1250" | "2250" | "4250">;
  // Handles toggling the visibility of intervals when legend items are clicked
  const handleLegendClick = (interval: string) => {
    setActiveIntervals((prev) => ({
      ...prev,
      [interval]: !prev[interval],
    }));
  };
// Calculates mean and standard deviation for each interval
  const intervalStats = intervals.reduce((acc, interval) => {
    // Iterates over all interval keys (1250, 2250, 4250) from the intervals array
    // Builds an accumulator object that will store the calculated mean and SD for each interval
    const values = gamesData[interval]; // Retrieves the array of reaction times for the current interval
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length; // Sums up all reaction time values for the interval using reduce and divides to calculate mean
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (values.length - 1);
    const stdDev = Math.sqrt(variance);
    acc[interval] = { mean, stdDev };
    return acc;
  }, {} as { [key: string]: { mean: number; stdDev: number } });
// Determines the maximum number of data points across intervals
  const maxDataPoints = Math.max(...intervals.map(interval => gamesData[interval].length));
  // Aligns data points and adds error bars for each interval
  const chartData = Array.from({ length: maxDataPoints }, (_, i) => { // Creates an array with maxDataPoints elements corresponding to indexes
    const dataPoint: { index: number; [key: string]: number | undefined; error?: number } = { index: i + 1 }; // Creates a data point object for the current index
    intervals.forEach(interval => {
      if (i < gamesData[interval].length) { // Current index exists in the data for the current interval
        const value = gamesData[interval][i];
        const { stdDev } = intervalStats[interval]; // Fetches the standard deviation for the current interval from intervalStats
        dataPoint[interval] = value; // Adds the interval value to the dataPoint object under interval key
        dataPoint[`error_${interval}`] = stdDev; // Adds the standard deviation for the interval to the dataPoint object under interval key
      }
    });
    return dataPoint;
  });


  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis label={{ value: t('reactionTime'), angle: -90, position: "insideLeft" }}/>
        <Tooltip />
        <Legend
          onClick={(e) => handleLegendClick(e.value)}
          formatter={(value) => {
            const labelMap: { [key: string]: string } = {
              '1250': '1s',
              '2250': '2s',
              '4250': '4s'
            };
            return (
              <span style={{ cursor: 'pointer', color: activeIntervals[value] ? '#000' : '#ccc' }}>
                {labelMap[value] || value}
              </span>
            );
          }}
        />
        {intervals.map((interval) => {
          const color = normativeData[interval].color;

          return (
            <Line
              key={interval}
              type="monotone"
              dataKey={interval}
              name={`${interval}`}
              stroke={color}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
              hide={!activeIntervals[interval]}
            >
              <ErrorBar
                dataKey={`error_${interval}`}
                stroke={color}
                width={4}
              />
            </Line>
          );
        })}
        {Object.entries(normativeData).map(([key, { mean, stdDev, color }]) => (
          activeIntervals[key] && (
            <ReferenceArea
              key={key}
              y1={mean - stdDev}
              y2={mean + stdDev}
              fill={color + "33"}
              stroke={color}
              strokeWidth={1}
              fillOpacity={0.3}
            />
          )
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReactionTimesChart;
