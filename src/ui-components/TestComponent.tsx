import React from 'react';
import './TestComponent.css';
import Test from './Test';

interface tests {
  test: Test;
}

const TestComponent: React.FC<tests> = ({ test }) => {
  const formattedDate = new Date(test.timestamp).toLocaleString();

  return (
    <div className="test-container">
      <p className="game-details">
        <strong>Patient ID:</strong> {test.id}
      </p>
      <p className="game-details">
        <strong>Mode:</strong> {test.mode}
      </p>
      <p className="game-details">
        <strong>Date:</strong> {formattedDate}
      </p>
      <button className="see-more-button">See more</button>
    </div>
  );
};

export default TestComponent;
