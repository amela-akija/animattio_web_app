import React, { useState } from 'react';
import './ResultsPage.css';
import useResponsive from '../../ui-components/useResponsive';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import ProcessedGamesChart from './ProcessedGamesChart';
import { useParams } from 'react-router-dom';
import OmissionGraph from './OmissionGraph';
import ReactionTimeTable from './ReactionTimeTable';

function ResultsPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();

  const [selectedOption, setSelectedOption] = useState('');
  const [activeButton, setActiveButton] = useState<'reactionTime' | 'commission' | 'omission'>('reactionTime');
  const { testId } = useParams<{ testId: string }>();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = (button: 'reactionTime' | 'commission' | 'omission') => {
    setActiveButton(button);
  };

  console.log('Test ID:', testId);

  return (
    <div>
      <div className="result-button-container">
        <button
          className="result-button"
          onClick={() => handleButtonClick('reactionTime')}
          style={{
            backgroundColor: activeButton === 'reactionTime' ? '#FFC267' : '#FBE3BE',
          }}
        >
          <text className="result-text-button">{t('reactionTime')}:</text>
        </button>
      </div>

      <div className="plot-container">
        {activeButton === 'reactionTime' && testId ? (
          <>
            <ReactionTimeTable testId={testId} />
            <ProcessedGamesChart testId={testId} />
          </>
        ) : (
          activeButton === 'reactionTime' && !testId && <p>No test ID available.</p>
        )}
      </div>

      <div className="result-button-container">
        <button
          onClick={() => handleButtonClick('commission')}
          className="result-button"
          style={{
            backgroundColor: activeButton === 'commission' ? '#FFC267' : '#FBE3BE',
          }}
        >
          <text className="result-text-button">{t('commission')}:</text>
        </button>
      </div>

      <div className="result-button-container">
        <button
          onClick={() => handleButtonClick('omission')}
          className="result-button"
          style={{
            backgroundColor: activeButton === 'omission' ? '#FFC267' : '#FBE3BE',
          }}
        >
          <text className="result-text-button">{t('omission')}:</text>
        </button>
        {activeButton === 'omission' && testId ? (
          <OmissionGraph testId={testId} />
        ) : null}
      </div>
    </div>
  );
}

export default ResultsPage;
