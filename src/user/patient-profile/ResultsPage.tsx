import React, { useState } from 'react';
import './ResultsPage.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import ReactionTimesChart from './ReactionTimesChart';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import OmissionGraph from './OmissionGraph';
import ReactionTimeTable from './ReactionTimeTable';
import CommissionGraph from './CommissionGraph';
// Interface for test details
interface Test {
  testId: string;
  endDate: string;
  gameMode: string;
}

interface TestListProps {
  tests: Test[]; // List of tests
}

function ResultsPage() {
  const { t } = useTranslation();
  const { testId } = useParams<{ testId: string }>(); // Retrieves the test ID from the URL parameters
  const location = useLocation();
  const navigate = useNavigate();
  const { tests } = (location.state as TestListProps) || { tests: [] };
// State to track the active button
  const [activeButton, setActiveButton] = useState<'reactionTime' | 'commission' | 'omission'>('reactionTime');
  const patientId = localStorage.getItem('clicked_user');
  // Handles button clicks to switch between different parameters
  const handleButtonClick = (button: 'reactionTime' | 'commission' | 'omission') => {
    setActiveButton(button);
  };
// Index of the current test in the tests array to track between tests
  const currentTestIndex = tests.findIndex(test => test.testId === testId);
  const previousTest = tests[currentTestIndex - 1];
  const nextTest = tests[currentTestIndex + 1];
// Navigates to a specified test
  const navigateToTest = (testId: string) => {
    navigate(`/test-results/${testId}`, { state: { tests } });
  };
  console.log('OmissionGraph props:', { testId, patientId });
  console.log('CommissionGraph props:', { testId, patientId });
  console.log('Active button:', activeButton);
  // console.log('Device Type:', { isMobile, isTablet, isLaptop });


  return (
    <div>
      <div className="navigation-buttons">
        {previousTest && (
          <button onClick={() => navigateToTest(previousTest.testId)}>
            &larr;
          </button>
        )}
        {nextTest && (
          <button onClick={() => navigateToTest(nextTest.testId)}>
             &rarr;
          </button>
        )}
      </div>
      <div className="result-button-container">

        <button
          className="result-button"
          onClick={() => handleButtonClick('reactionTime')}
          style={{
            backgroundColor: activeButton === 'reactionTime' ? '#FFC267' : '#FBE3BE'
          }}>
          <span className="result-text-button">{t('reactionTime')}</span>
        </button>
      </div>


        {activeButton === 'reactionTime' && testId ? (
            <div className="plot-container">
          <>
            <ReactionTimeTable testId={testId} />
            <ReactionTimesChart testId={testId} />
          </>
            </div>

        ) : (
          activeButton === 'reactionTime' && !testId && <p>No test ID available.</p>
        )}

      <div className="result-button-container">
        <button
          onClick={() => handleButtonClick('commission')}
          className="result-button"
          style={{
            backgroundColor: activeButton === 'commission' ? '#FFC267' : '#FBE3BE'
          }}>
          <span className="result-text-button">{t('commission')}</span>
        </button>


        {activeButton === 'commission' && testId && patientId ? (
          <div className="omission-plot-container">
            <CommissionGraph testId={testId} patientId={patientId} />

          </div>
          ) : null}
      </div>

      <div className="result-button-container">
        <button
          onClick={() => handleButtonClick('omission')}
          className="result-button"
          style={{
            backgroundColor: activeButton === 'omission' ? '#FFC267' : '#FBE3BE'
          }}>
          <span className="result-text-button">{t('omission')}</span>
        </button>

          {activeButton === 'omission' && testId && patientId ? (
            <div className="omission-plot-container">
              <OmissionGraph testId={testId} patientId={patientId} />
            </div>

          ) : null}
            </div>
            </div>

            );
          }

export default ResultsPage;
