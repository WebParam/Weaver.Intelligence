import { useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import RateChip from 'components/chips/RateChip';
import DateSelect from 'components/dates/DateSelect';
import EChartsReactCore from 'echarts-for-react/lib/core';
import RevenueChartLegends from './RevenueChartLegends';
import RevenueChart from './RevenueChart';

export const revenueData = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  series: [
    {
      name: 'Gemini 1.5 Pro',
      data: [32000, 45000, 58000, 62000, 71000, 85000, 92000, 88000, 76000, 64000, 52000, 48000],
    },
    {
      name: 'Claude 3.5 Sonnet',
      data: [15000, 22000, 31000, 38000, 42000, 55000, 68000, 62000, 54000, 42000, 31000, 24000],
    },
    {
      name: 'GPT-4o / Turbo',
      data: [25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000],
    },
  ],
};

const RevenueByCustomer = () => {
  const chartRef = useRef<EChartsReactCore>(null);

  return (
    <Paper sx={{ height: { xs: 540, md: 500 } }}>
      {/* header */}
      <Typography variant="subtitle1" color="text.secondary">
        Token Usage Analytics (All Envs)
      </Typography>

      {/* subheader */}
      <Stack justifyContent="space-between" mt={1}>
        <Stack alignItems="center" gap={0.875}>
          <Typography variant="h3" fontWeight={600} letterSpacing={1}>
            482.5M
          </Typography>
          <RateChip rate={'14.8%'} isUp={true} />
        </Stack>

        <Stack alignItems="center" spacing={2}>
          {/* legends for bigger screen */}
          <Box display={{ xs: 'none', md: 'block' }}>
            <RevenueChartLegends chartRef={chartRef} sm={false} />
          </Box>
          <DateSelect />
        </Stack>
      </Stack>

      {/* legends for smaller screen */}
      <Box display={{ xs: 'block', md: 'none' }}>
        <RevenueChartLegends chartRef={chartRef} sm={true} />
      </Box>

      {/* stacked bar chart */}
      <Box height={400}>
        <RevenueChart chartRef={chartRef} data={revenueData} sx={{ minHeight: 1 }} />
      </Box>
    </Paper>
  );
};

export default RevenueByCustomer;
