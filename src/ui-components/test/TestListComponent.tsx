import React from 'react';
import Test from './Test';
import TestComponent from './TestComponent';
import './TestComponent.css';

interface Tests {
  tests: Test[];
}

const TestsList: React.FC<Tests> = ({ tests }) => {
  return (
    <div className="test-list">
      {tests.map((test) => (
        <TestComponent key={test.id} test={test} />
      ))}
    </div>
  );
};

export default TestsList;
