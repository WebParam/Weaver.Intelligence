import { useMemo } from 'react';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ReactEchart from 'components/base/ReactEchart';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TooltipComponent,
    GridComponent,
    LineChart,
    CanvasRenderer,
    LegendComponent,
]);

const RequestTimeline = () => {
    const theme = useMuiTheme();

    const option = useMemo(() => ({
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['LLM Requests'],
            textStyle: { color: theme.palette.text.secondary },
            top: 0,
            right: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Jan 14', 'Jan 20', 'Jan 26', 'Feb 1', 'Feb 7', 'Feb 12'],
            axisLabel: { color: theme.palette.text.secondary },
            axisLine: { lineStyle: { color: theme.palette.divider } },
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1,
            interval: 1,
            axisLabel: { color: theme.palette.text.secondary },
            splitLine: { lineStyle: { color: theme.palette.divider } },
        },
        series: [
            {
                name: 'LLM Requests',
                type: 'line',
                smooth: false,
                symbol: 'none',
                lineStyle: {
                    color: '#00cc66',
                    width: 2
                },
                data: [0, 0, 0, 0, 0, 0],
            },
        ],
    }), [theme]);

    return (
        <Paper sx={{ p: 2.5, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        Model Requests
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Total number of LLM requests over time
                    </Typography>
                </Box>
                <ToggleButtonGroup size="small" value="all" exclusive>
                    <ToggleButton value="all" sx={{ textTransform: 'none', px: 1.5 }}>All</ToggleButton>
                    <ToggleButton value="model" sx={{ textTransform: 'none', px: 1.5 }}>Model</ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            <Box sx={{ height: 300 }}>
                <ReactEchart echarts={echarts} option={option} style={{ width: '100%', height: '100%' }} />
            </Box>
        </Paper>
    );
};

export default RequestTimeline;
