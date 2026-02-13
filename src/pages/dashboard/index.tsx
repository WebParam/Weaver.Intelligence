import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import OverviewTab from './OverviewTab';
import LiveMetricsTab from './LiveMetricsTab';
import ReportsTab from './ReportsTab';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: any, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Overview" />
          <Tab label="Live Metrics" />
          <Tab label="Reports" />
        </Tabs>
      </Box>

      <Grow in={tabValue === 0} timeout={500} unmountOnExit>
        <div>
          <OverviewTab />
        </div>
      </Grow>

      <Grow in={tabValue === 1} timeout={500} unmountOnExit>
        <div>
          <LiveMetricsTab />
        </div>
      </Grow>

      <Grow in={tabValue === 2} timeout={500} unmountOnExit>
        <div>
          <ReportsTab />
        </div>
      </Grow>
    </>
  );
};

export default Dashboard;
