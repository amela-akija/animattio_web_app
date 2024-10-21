import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { t } from 'i18next';

interface TappedImage {
  index: number;
  reactionTime: number;
  interval: number;
}

interface GameData {
  tappedImages: TappedImage[];
}

interface ProcessedGamesChartProps {
  testId: string;
}

const ProcessedGamesChart: React.FC<ProcessedGamesChartProps> = ({ testId }) => {
  const [gamesData, setGamesData] = useState<GameData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIntervals, setActiveIntervals] = useState<{ [key: string]: boolean }>({
    '1250': true,
    '2250': true,
    '4250': true,
  });

  const normativeData = {
    1250: { mean: 348.84, stdDev: 59.53, color: "#8884d8" },
    2250: { mean: 393.66, stdDev: 74.68, color: "#82ca9d" },
    4250: { mean: 450.97, stdDev: 105.01, color: "#ff7300" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<GameData[]>(`http://localhost:8080/${testId}/processed-games`);
        setGamesData(response.data);
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

  const processData = (data: GameData[]) => {
    const groupedData: { [key: number]: { x: number; y: number }[] } = { 1250: [], 2250: [], 4250: [] };

    data.forEach((game) => {
      game.tappedImages.forEach((image) => {
        if (groupedData[image.interval]) {
          groupedData[image.interval].push({ x: image.index, y: image.reactionTime });
        }
      });
    });

    return Object.keys(groupedData).map((interval) => ({
      name: `${interval} ms`,
      data: groupedData[Number(interval)],
      key: interval,
    }));
  };

  const chartData = processData(gamesData);

  const maxIndex = Math.max(
    ...chartData.flatMap(lineData => lineData.data.map(point => point.x))
  );

  const handleLegendClick = (interval: string) => {
    const intervalKey = interval.replace(" ms", "");
    setActiveIntervals(prev => ({
      ...prev,
      [intervalKey]: !prev[intervalKey],
    }));
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" domain={[0, maxIndex]} tick={false} />
        <YAxis label={{ value: t('reactionTime'), angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend
          onClick={(e) => handleLegendClick(e.value)}
          formatter={(value) => {
            const intervalKey = value.replace(" ms", "");
            const displayValue = intervalKey === "1250" ? "1s" : intervalKey === "2250" ? "2s" : "4s";
            return (
              <span style={{ cursor: 'pointer', color: activeIntervals[intervalKey] ? '#000' : '#ccc' }}>
                {displayValue}
              </span>
            );
          }}
        />

        {chartData.map((lineData) => (
          <Line
            key={lineData.key}
            type="monotone"
            data={lineData.data}
            dataKey="y"
            name={lineData.name}
            stroke={lineData.key === '1250' ? "#8884d8" : lineData.key === '2250' ? "#82ca9d" : "#ff7300"}
            activeDot={{ r: 8 }}
            isAnimationActive={false}
            style={{ display: activeIntervals[lineData.key] ? 'block' : 'none' }}
          />
        ))}

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
