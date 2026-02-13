import { ReactNode } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface ChartCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    actions?: ReactNode;
}

const ChartCard = ({ title, subtitle, children, actions }: ChartCardProps) => (
    <Paper sx={{ p: 2.5, height: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            </Box>
            {actions}
        </Stack>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {children}
        </Box>
    </Paper>
);

const CostLatencyCharts = () => {
    // If no data, we can show "No data found" like in the screenshot
    const noDataOverlay = (
        <Typography variant="body2" color="text.secondary">
            No data found
        </Typography>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
                <ChartCard
                    title="Model Cost"
                    subtitle="Breakdown of LLM costs across different models over time"
                    actions={
                        <ToggleButtonGroup size="small" value="model" exclusive>
                            <ToggleButton value="model" sx={{ textTransform: 'none', px: 1.5 }}>Model</ToggleButton>
                            <ToggleButton value="io" sx={{ textTransform: 'none', px: 1.5 }}>Input/Output</ToggleButton>
                        </ToggleButtonGroup>
                    }
                >
                    {noDataOverlay}
                </ChartCard>
            </Grid>
            <Grid item xs={12} lg={6}>
                <ChartCard
                    title="Model Latency"
                    subtitle="Displaying average model latencies"
                    actions={
                        <ToggleButtonGroup size="small" value="avg" exclusive>
                            <ToggleButton value="avg" sx={{ textTransform: 'none', px: 1 }}>Average</ToggleButton>
                            <ToggleButton value="p50" sx={{ textTransform: 'none', px: 1 }}>p50</ToggleButton>
                            <ToggleButton value="p90" sx={{ textTransform: 'none', px: 1 }}>p90</ToggleButton>
                            <ToggleButton value="p99" sx={{ textTransform: 'none', px: 1 }}>p99</ToggleButton>
                        </ToggleButtonGroup>
                    }
                >
                    {noDataOverlay}
                </ChartCard>
            </Grid>
        </Grid>
    );
};

export default CostLatencyCharts;
