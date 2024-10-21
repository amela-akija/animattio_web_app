import React, { useState } from 'react';
import './ResultsPage.css';
import useResponsive from '../../ui-components/useResponsive';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import ProcessedGamesChart from './ProcessedGamesChart';
import { useParams } from 'react-router-dom';

function ResultsPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();

  const [selectedOption, setSelectedOption] = useState('');
  const [activeButton, setActiveButton] = useState<'general' | 'gender' | 'age'>('general');
  const { testId } = useParams<{ testId: string }>();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = (button: 'general' | 'gender' | 'age') => {
    setActiveButton(button);
  };

  console.log('Test ID:', testId);

  return (
    <div>
      <div className="result-button-container">
        <button
          className="result-button"
          onClick={() => handleButtonClick('general')}
          style={{
            backgroundColor: activeButton === 'general' ? '#FFC267' : '#FBE3BE',
          }}
        >
          <text className="result-text-button">{t('general')}:</text>
        </button>
      </div>

      <div className="plot-container">
        {testId ? <ProcessedGamesChart testId={testId} /> : <p>No test ID available.</p>}
      </div>

      <div className="result-button-container">
        <button
          onClick={() => handleButtonClick('gender')}
          className="result-button"
          style={{
            backgroundColor: activeButton === 'gender' ? '#FFC267' : '#FBE3BE',
          }}
        >
          <text className="result-text-button">{t('gender')}:</text>
        </button>
      </div>

      <div className="result-button-container">
        <button
          onClick={() => handleButtonClick('age')}
          className="result-button"
          style={{
            backgroundColor: activeButton === 'age' ? '#FFC267' : '#FBE3BE',
          }}
        >
          <text className="result-text-button">{t('age')}:</text>
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
