import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import './DailyErrorGraph.css';
import { parse, format } from 'date-fns';
import { pl as polishLocale } from 'date-fns/locale';
import { Locale } from 'date-fns';
interface ErrorsGraphProps {
  userId: string;
}

interface ErrorEntry {
  mode: string;
  date: string;
  commissions: number;
  omissions: number;
  targetStimuli: number;
  nonTargetStimuli: number;
}

interface ModeData {
  dates: string[];
  commissionPercentages: number[];
  omissionPercentages: number[];
}

const DailyErrorGraph: React.FC<ErrorsGraphProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [dataByMode, setDataByMode] = useState<Record<string, ModeData>>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ErrorEntry[]>(`http://localhost:8080/aggregate-errors-daily/${userId}`);
        const rawData = response.data;

        const groupedData = rawData.reduce((acc: Record<string, ModeData>, entry: ErrorEntry) => {
          const { mode, date, commissions, omissions, targetStimuli, nonTargetStimuli } = entry;
          const commissionPercentage = parseFloat(((commissions / nonTargetStimuli) * 100).toFixed(2));
          const omissionPercentage = parseFloat(((omissions / targetStimuli) * 100).toFixed(2));

          if (!acc[mode]) acc[mode] = { dates: [], commissionPercentages: [], omissionPercentages: [] };

          acc[mode].dates.push(date);
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
    if (!startDate && !endDate) return modeData;

    const filteredData = modeData.dates
      .map((dateString, index) => {
        const parsedDate = parse(dateString, "d MMMM yyyy", new Date(), { locale: polishLocale as Locale });

        const isWithinRange = (!startDate || parsedDate >= startDate) && (!endDate || parsedDate <= endDate);

        return isWithinRange
          ? {
            date: format(parsedDate, 'dd.MM.yyyy'),
            commissionPercentage: modeData.commissionPercentages[index],
            omissionPercentage: modeData.omissionPercentages[index]
          }
          : null;
      })
      .filter((entry) => entry !== null) as {
      date: string;
      commissionPercentage: number;
      omissionPercentage: number;
    }[];

    return {
      dates: filteredData.map((entry) => entry.date),
      commissionPercentages: filteredData.map((entry) => entry.commissionPercentage),
      omissionPercentages: filteredData.map((entry) => entry.omissionPercentage),
    };
  };


  const createChartData = (
    dates: string[],
    commissionPercentages: number[],
    omissionPercentages: number[]
  ) => ({
    labels: dates,
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
    <div className="daily-error-graph-container">
      <div className="daily-date-picker-container">
        <div className="daily-date-picker-wrapper">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText={t('startDailyDate')}
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText={t('endDailyDate')}
          />
        </div>
      </div>

      {Object.keys(dataByMode).map((mode) => {
        const filteredData = filterDataByDate(dataByMode[mode]);

        return (
          <div key={mode} className="daily-graph-container">
            {filteredData.dates.length > 0 ? (
              <Bar
                data={createChartData(
                  filteredData.dates,
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
              <p>{t('noDataForDate')}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DailyErrorGraph;
