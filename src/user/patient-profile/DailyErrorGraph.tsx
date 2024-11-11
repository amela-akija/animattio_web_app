import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import './DailyErrorGraph.css';
import { parse, format } from 'date-fns';
import { pl as polishLocale } from 'date-fns/locale';
import apiClient from '../../services/apiClient';

interface ErrorsGraphProps {
  userId: string;
  selectedMode?: string;
  age: number;
  gender: 'male' | 'female';
}

interface ErrorEntry {
  mode: string;
  date: string;
  commissions: number;
  omissions: number;
  targetStimuli: number;
  nonTargetStimuli: number;
}

interface ProcessedErrorEntry {
  date: Date;
  mode: string;
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

const normativeDataCommission = {
  '9-11': { female: { mean: 58.2 }, male: { mean: 68.3 } },
  '12-13': { female: { mean: 52.3 }, male: { mean: 66.3 } },
  '14-15': { female: { mean: 45.1 }, male: { mean: 59.9 } },
  '16-18': { female: { mean: 40.5 }, male: { mean: 53.6 } },
};

const normativeDataOmission = {
  '9-11': { female: { mean: 6.7 }, male: { mean: 6.5 } },
  '12-13': { female: { mean: 5.4 }, male: { mean: 3.5 } },
  '14-15': { female: { mean: 2.3 }, male: { mean: 3.0 } },
  '16-18': { female: { mean: 2.1 }, male: { mean: 2.9 } },
};

const DailyErrorGraph: React.FC<ErrorsGraphProps> = ({ userId, selectedMode, age, gender }) => {
  const { t } = useTranslation();
  const [dataByMode, setDataByMode] = useState<Record<string, ModeData>>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const getNormativeData = () => {
    const ageGroup = age < 12 ? '9-11' : age < 14 ? '12-13' : age < 16 ? '14-15' : '16-18';

    const normativeCommission = normativeDataCommission[ageGroup][gender].mean;
    const normativeOmission = normativeDataOmission[ageGroup][gender].mean;

    return { normativeCommission, normativeOmission };
  };

  const { normativeCommission, normativeOmission } = getNormativeData();

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<ErrorEntry[]>(`/tests/aggregate-errors-daily/${userId}`);
        const rawData = response.data;

        const processedData = rawData.map<ProcessedErrorEntry>(entry => {
          const parsedDate = parse(entry.date, 'd MMMM yyyy', new Date(), { locale: polishLocale });
          return {
            ...entry,
            date: parsedDate,
          };
        });

        const groupedData = processedData.reduce((acc: Record<string, ModeData>, entry: ProcessedErrorEntry) => {
          const { mode, date, commissions, omissions, targetStimuli, nonTargetStimuli } = entry;
          const commissionPercentage = parseFloat(((commissions / nonTargetStimuli) * 100).toFixed(2));
          const omissionPercentage = parseFloat(((omissions / targetStimuli) * 100).toFixed(2));

          if (!acc[mode]) acc[mode] = { dates: [], commissionPercentages: [], omissionPercentages: [] };

          acc[mode].dates.push(format(date, 'dd.MM.yyyy'));
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
        const parsedDate = parse(dateString, 'dd.MM.yyyy', new Date(), { locale: polishLocale });

        const isWithinRange = (!startDate || parsedDate >= startDate) && (!endDate || parsedDate <= endDate);

        return isWithinRange
          ? {
            date: dateString,
            commissionPercentage: modeData.commissionPercentages[index],
            omissionPercentage: modeData.omissionPercentages[index],
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
    omissionPercentages: number[],
    normativeCommission: number,
    normativeOmission: number
  ) => ({
    labels: dates,
    datasets: [
      {
        label: t('Commission'),
        data: commissionPercentages,
        backgroundColor: 'rgba(230,199,50,0.9)',
        borderColor: 'rgb(244,219,102)',
        borderWidth: 1,
      },
      {
        label: t('Omission'),
        data: omissionPercentages,
        backgroundColor: 'rgba(9,62,2,0.6)',
        borderColor: 'rgba(17,81,10,0.6)',
        borderWidth: 1,
      },
      {
        label: t('Normative Commission'),
        data: new Array(dates.length).fill(normativeCommission),
        backgroundColor: 'rgba(241,175,53,0.98)',
        borderColor: 'rgba(241,175,53,0.98)',
        borderWidth: 1,
      },
      {
        label: t('Normative Omission'),
        data: new Array(dates.length).fill(normativeOmission),
        backgroundColor: 'rgba(74,151,54,0.6)',
        borderColor: 'rgba(74,151,54,0.6)',
        borderWidth: 1,
      },
    ],
  });

  return (
    <div className="daily-error-graph-container">
      <h1 className="daily-title">{t('dailyGraph')}</h1>
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
        if (selectedMode && selectedMode !== mode) return null;

        const filteredData = filterDataByDate(dataByMode[mode]);

        return (
          <div key={mode} className="daily-graph-container">
            {filteredData.dates.length > 0 ? (
              <Bar
                data={createChartData(
                  filteredData.dates,
                  filteredData.commissionPercentages,
                  filteredData.omissionPercentages,
                  normativeCommission,
                  normativeOmission
                )}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { callback: (value) => `${value}%` },
                      title: { display: true, text: '%' },
                    },
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
