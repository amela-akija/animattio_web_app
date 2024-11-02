import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import './MonthlyErrorGraph.css';

interface ErrorsGraphProps {
  userId: string;
  selectedMode?: string;
}

interface ErrorEntry {
  month: string;
  mode: string;
  targetStimuli: number;
  commissions: number;
  nonTargetStimuli: number;
  omissions: number;
}

interface ModeData {
  months: string[];
  commissionPercentages: number[];
  omissionPercentages: number[];
}

const MonthlyErrorGraph: React.FC<ErrorsGraphProps> = ({ userId, selectedMode }) => {
  const { t } = useTranslation();
  const [dataByMode, setDataByMode] = useState<Record<string, ModeData>>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}.${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ErrorEntry[]>(`http://localhost:8080/aggregate-errors-monthly/${userId}`);
        const rawData = response.data;

        const groupedData = rawData.reduce((acc: Record<string, ModeData>, entry: ErrorEntry) => {
          const { mode, month, commissions, omissions, targetStimuli, nonTargetStimuli } = entry;

          const formattedMonth = month;

          const commissionPercentage = parseFloat(((commissions / nonTargetStimuli) * 100).toFixed(2));
          const omissionPercentage = parseFloat(((omissions / targetStimuli) * 100).toFixed(2));

          if (!acc[mode]) acc[mode] = { months: [], commissionPercentages: [], omissionPercentages: [] };

          acc[mode].months.push(formattedMonth);
          acc[mode].commissionPercentages.push(commissionPercentage);
          acc[mode].omissionPercentages.push(omissionPercentage);

          return acc;
        }, {});

        setDataByMode(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  

  const filterDataByDate = (modeData: ModeData) => {
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    const filteredMonths = modeData.months
      .filter((month) => {
        if (formattedStart && month < formattedStart) return false;
        if (formattedEnd && month > formattedEnd) return false;
        return true;
      })
      .sort((a, b) => {
        const [monthA, yearA] = a.split('.').map(Number);
        const [monthB, yearB] = b.split('.').map(Number);
        return yearA === yearB ? monthA - monthB : yearA - yearB;
      });

    const filteredCommissionPercentages = modeData.commissionPercentages.slice(0, filteredMonths.length);
    const filteredOmissionPercentages = modeData.omissionPercentages.slice(0, filteredMonths.length);

    return {
      months: filteredMonths,
      commissionPercentages: filteredCommissionPercentages,
      omissionPercentages: filteredOmissionPercentages,
    };
  };

  const createChartData = (
    months: string[],
    commissionPercentages: number[],
    omissionPercentages: number[]
  ) => ({
    labels: months,
    datasets: [
      {
        label: t('Commission'),
        data: commissionPercentages,
        backgroundColor: 'rgba(230,199,50,0.9)',
        borderColor: 'rgb(244,219,102)',
        borderWidth: 1
      },
      {
        label: t('Omission'),
        data: omissionPercentages,
        backgroundColor: 'rgba(9,62,2,0.6)',
        borderColor: 'rgba(17,81,10,0.6)',
        borderWidth: 1
      }
    ]
  });

  return (
    <div className="monthly-error-graph-container">
      <h1 className="monthly-title"> {t('monthlyGraph')}</h1>
      <div className="date-picker-container">
        <div className="date-picker-wrapper">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText={t('startMonth')}
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText={t('endMonth')}
          />
        </div>
      </div>

      {Object.keys(dataByMode)
        .filter(mode => !selectedMode || mode === selectedMode)
        .map((mode) => {
          const filteredData = filterDataByDate(dataByMode[mode]);

          return (
            <div key={mode} className="graph-container">
              {filteredData.months.length > 0 ? (
                <Bar
                  data={createChartData(
                    filteredData.months,
                    filteredData.commissionPercentages,
                    filteredData.omissionPercentages
                  )}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { callback: (value) => `${value}%` },
                        title: { display: true, text: '%' }
                      }
                    },
                  }}
                />
              ) : (
                <p>{t('noDataForMonth')}</p>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default MonthlyErrorGraph;
