import React from 'react';
import './TestComponent.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Test {
  testId: string;
  endDate: string;
  gameMode: string;
}

interface TestComponentProps {
  test: Test;
  tests: Test[];
}

const TestComponent: React.FC<TestComponentProps> = ({ test, tests }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const displayMode = () => {
    switch (test.gameMode) {
      case 'mode1':
        return '1';
      case 'mode2':
        return '2';
      default:
        return 'N/A';
    }
  };

  const goToResultPage = (testId: string) => {
    navigate(`/test-results/${testId}`, { state: { tests } });
  };

  return (
    <div className="test-container">
      <p className="game-details">
        <strong>{t("endDate")}:</strong> {test.endDate}
      </p>
      <p className="game-details">
        <strong>{t("mode")}:</strong> {displayMode()}
      </p>
      <button className="see-more-button" onClick={() => goToResultPage(test.testId)}>
        {t("see_more")}
      </button>
    </div>
  );
};

export default TestComponent;
