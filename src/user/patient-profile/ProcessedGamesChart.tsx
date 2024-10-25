import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

interface ProcessedGamesChartProps {
  testId: string;
}

const ProcessedGamesChart: React.FC<ProcessedGamesChartProps> = ({ testId }) => {
  const [gamesData, setGamesData] = useState<{ [key: string]: number[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIntervals, setActiveIntervals] = useState<{ [key: string]: boolean }>({});

  const normativeData = {
    1250: { mean: 348.84, stdDev: 59.53, color: "#8884d8" },
    2250: { mean: 393.66, stdDev: 74.68, color: "#82ca9d" },
    4250: { mean: 450.97, stdDev: 105.01, color: "#ff7300" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ [key: string]: number[] }>(`http://localhost:8080/${testId}/processed-games`);
        setGamesData(response.data);

        const initialActiveIntervals = Object.keys(response.data).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as { [key: string]: boolean });

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

  const intervals = Object.keys(gamesData) as Array<"1250" | "2250" | "4250">;

  const handleLegendClick = (interval: string) => {
    setActiveIntervals((prev) => ({
      ...prev,
      [interval]: !prev[interval],
    }));
  };

  const intervalStats = intervals.reduce((acc, interval) => {
    const values = gamesData[interval];
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (values.length - 1);
    const stdDev = Math.sqrt(variance);
    acc[interval] = { mean, stdDev };
    return acc;
  }, {} as { [key: string]: { mean: number; stdDev: number } });

  const maxDataPoints = Math.max(...intervals.map(interval => gamesData[interval].length));

  const chartData = Array.from({ length: maxDataPoints }, (_, i) => {
    const dataPoint: { index: number; [key: string]: number | undefined; error?: number } = { index: i + 1 };
    intervals.forEach(interval => {
      if (i < gamesData[interval].length) {
        const value = gamesData[interval][i];
        const { stdDev } = intervalStats[interval];
        dataPoint[interval] = value;
        dataPoint[`error_${interval}`] = stdDev;
        console.log(`Interval: ${interval}, Value: ${value}, StdDev: ${stdDev}`);
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

export default ProcessedGamesChart;
