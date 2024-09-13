import React from 'react';
import './TestComponent.css';
import Test from './Test';
import { useTranslation } from 'react-i18next';

interface tests {
  test: Test;
}

const TestComponent: React.FC<tests> = ({ test }) => {
  const formattedDate = new Date(test.timestamp).toLocaleString();
  const { t } = useTranslation();

  return (
    <div className="test-container">
      <p className="game-details">
        <strong>{t("patient_id")}:</strong> {test.id}
      </p>
      <p className="game-details">
        <strong>{t("mode")}:</strong> {test.mode}
      </p>
      <p className="game-details">
        <strong>{t("date")}:</strong> {formattedDate}
      </p>
      <button className="see-more-button">{t("see_more")}</button>
    </div>
  );
};

export default TestComponent;
