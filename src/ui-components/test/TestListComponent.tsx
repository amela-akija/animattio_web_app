import React from 'react';
import TestComponent from './TestComponent';
import { Box, Typography } from '@mui/material';

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
    <Box display="flex" flexDirection="column" gap={2}>
      {tests.map((test) => (
        <TestComponent key={test.testId} test={test} tests={tests} />
      ))}
      {tests.length === 0 && (
        <Typography variant="h6" color="textSecondary" textAlign="center">
          No tests available.
        </Typography>
      )}
    </Box>
  );
};

export default TestsList;
