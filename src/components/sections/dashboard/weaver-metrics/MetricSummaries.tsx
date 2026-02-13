import { useMemo, useState } from 'react';
import { Grid, Paper, Typography, Box, Stack, useTheme, Tabs, Tab } from '@mui/material';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([RadarChart, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

interface MetricPreset {
    name: string;
    color: string;
    values: number[];
}

const modelPresets: Record<number, MetricPreset[]> = {
    0: [
        { name: 'Gemini 1.5 Pro', color: '#00D9FF', values: [0.92, 0.88, 0.95, 0.82, 0.98] },
        { name: 'Claude 3.5 Sonnet', color: '#BB86FC', values: [0.85, 0.92, 0.88, 0.95, 0.96] }
    ],
    1: [
        { name: 'GPT-4o', color: '#10A37F', values: [0.88, 0.90, 0.92, 0.85, 0.94] },
        { name: 'Llama 3.1 405B', color: '#0668E1', values: [0.82, 0.85, 0.80, 0.88, 0.90] }
    ],
    2: [
        { name: 'Mistral Large-2', color: '#F3D13D', values: [0.75, 0.80, 0.82, 0.78, 0.85] },
        { name: 'Llama 3.1 70B', color: '#0668E1', values: [0.80, 0.78, 0.85, 0.82, 0.88] }
    ]
};

const agentPresets: Record<number, MetricPreset[]> = {
    0: [
        { name: 'Advisor Agent', color: '#00D9FF', values: [0.95, 0.90, 0.85, 0.98, 0.92] },
        { name: 'Support Bot', color: '#03DAC6', values: [0.88, 0.95, 0.90, 0.85, 0.88] }
    ],
    1: [
        { name: 'Auditor-X', color: '#BB86FC', values: [0.98, 0.85, 0.95, 0.92, 0.90] },
        { name: 'Policy-Bot', color: '#FFC107', values: [0.90, 0.92, 0.88, 0.95, 0.85] }
    ],
    2: [
        { name: 'Sandbox-AI', color: '#4CAF50', values: [0.80, 0.82, 0.78, 0.85, 0.80] },
        { name: 'Test-Bot', color: '#F44336', values: [0.75, 0.78, 0.85, 0.80, 0.75] }
    ]
};

interface RadarIndicator {
    name: string;
    max: number;
}

const MetricSummaries = () => {
    const theme = useTheme();
    const [modelTab, setModelTab] = useState(0);
    const [agentTab, setAgentTab] = useState(0);

    const getRadarOption = (presets: Record<number, MetricPreset[]>, tab: number, indicators: RadarIndicator[]) => {
        const items = presets[tab];
        return {
            tooltip: { trigger: 'item' },
            legend: {
                bottom: 0,
                data: items.map(m => m.name),
                textStyle: { color: theme.palette.text.secondary, fontSize: 10 }
            },
            radar: {
                indicator: indicators,
                splitArea: { show: false },
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [{
                type: 'radar',
                data: items.map(m => ({
                    value: m.values,
                    name: m.name,
                    itemStyle: { color: m.color },
                    areaStyle: { color: `${m.color}33` }
                }))
            }]
        };
    };

    const modelOption = useMemo(() => getRadarOption(modelPresets, modelTab, [
        { name: 'Faithfulness', max: 1 },
        { name: 'Relevancy', max: 1 },
        { name: 'Coherence', max: 1 },
        { name: 'Conciseness', max: 1 },
        { name: 'Safety', max: 1 }
    ]), [theme, modelTab]);

    const agentOption = useMemo(() => getRadarOption(agentPresets, agentTab, [
        { name: 'Accuracy', max: 1 },
        { name: 'Safety', max: 1 },
        { name: 'Protocol', max: 1 },
        { name: 'Speed', max: 1 },
        { name: 'Retention', max: 1 }
    ]), [theme, agentTab]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: 420 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" fontWeight={700}>Model Evaluation Summary</Typography>
                        <Tabs
                            value={modelTab}
                            onChange={(_, v) => setModelTab(v)}
                            sx={{ minHeight: 0, '& .MuiTab-root': { minHeight: 32, fontSize: '0.65rem', px: 1 } }}
                        >
                            <Tab label="Prod" />
                            <Tab label="Stage" />
                            <Tab label="Dev" />
                        </Tabs>
                    </Stack>
                    <Box sx={{ height: 280, mt: 2 }}>
                        <ReactEchart echarts={echarts} option={modelOption} sx={{ height: '100%' }} />
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: 420 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" fontWeight={700}>Agent Evaluation Summary</Typography>
                        <Tabs
                            value={agentTab}
                            onChange={(_, v) => setAgentTab(v)}
                            sx={{ minHeight: 0, '& .MuiTab-root': { minHeight: 32, fontSize: '0.65rem', px: 1 } }}
                        >
                            <Tab label="Prod" />
                            <Tab label="Stage" />
                            <Tab label="Dev" />
                        </Tabs>
                    </Stack>
                    <Box sx={{ height: 280, mt: 2 }}>
                        <ReactEchart echarts={echarts} option={agentOption} sx={{ height: '100%' }} />
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default MetricSummaries;
