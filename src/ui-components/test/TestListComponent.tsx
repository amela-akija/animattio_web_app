import React from 'react';
import TestComponent from './TestComponent';

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
    <div>
      {tests.map((test) => (
        <TestComponent key={test.testId} test={test} tests={tests} />
      ))}
    </div>
  );
};

export default TestsList;
