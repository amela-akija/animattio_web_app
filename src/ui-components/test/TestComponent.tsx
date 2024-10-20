import React from 'react';
import './TestComponent.css';
import Test from './Test';
import { useTranslation } from 'react-i18next';

interface tests {
  test: Test;
}

const TestComponent: React.FC<tests> = ({ test }) => {
  const { t } = useTranslation();
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
  return (
    <div className="test-container">
      <p className="game-details">
        <strong>{t("endDate")}:</strong> {test.endDate}
      </p>
      <p className="game-details">
        <strong>{t("mode")}:</strong> {displayMode()}
      </p>

      <button className="see-more-button">{t("see_more")}</button>
    </div>
  );
};

export default TestComponent;
