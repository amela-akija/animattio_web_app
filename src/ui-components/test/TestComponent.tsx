import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
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
    <Card
      elevation={2}
      sx={{
        backgroundColor: '#FFFBEE',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body1" color="#2A470C">
            <strong>{t('endDate')}:</strong> {test.endDate}
          </Typography>
          <Typography variant="body1" color="#2A470C">
            <strong>{t('mode')}:</strong> {displayMode()}
          </Typography>
          <Button
            variant="contained"
            onClick={() => goToResultPage(test.testId)}
            sx={{
              backgroundColor: '#FFC267',
              color: '#2A470C',
              '&:hover': {
                backgroundColor: '#EADAC3',
              },
            }}
          >
            {t('see_more')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestComponent;
