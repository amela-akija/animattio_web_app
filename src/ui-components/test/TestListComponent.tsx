import React from 'react';
import TestComponent from './TestComponent';
import './TestComponent.css';

interface Test {
  testId: string;
  endDate: string;
  gameMode: string;
}

interface TestsListProps {
  tests: Test[];
}

const TestsList: React.FC<TestsListProps> = ({ tests }) => {
  return (
    <div className="test-list">
      {tests.map((test) => (
        <TestComponent key={test.testId} test={test} tests={tests} />
      ))}
    </div>
  );
};

export default TestsList;
