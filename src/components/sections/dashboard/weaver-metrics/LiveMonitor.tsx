import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Stack } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const LiveMonitor = () => {
    const [metrics, setMetrics] = useState({
        envelopes: 124582,
        passRate: 98.4,
        latency: 245,
        throughput: 42
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                envelopes: prev.envelopes + Math.floor(Math.random() * 5),
                passRate: 98.4 + (Math.random() * 0.4 - 0.2),
                latency: 220 + Math.floor(Math.random() * 80),
                throughput: 35 + Math.floor(Math.random() * 15)
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const metricItems = [
        {
            label: 'Total Envelopes',
            value: metrics.envelopes.toLocaleString(),
            sub: '+2.4k today',
            icon: 'mdi:package-variant-closed',
            color: '#00D9FF'
        },
        {
            label: 'Governance Pass Rate',
            value: `${metrics.passRate.toFixed(2)}%`,
            sub: 'Target: 99.0%',
            icon: 'mdi:shield-check',
            color: '#4CAF50'
        },
        {
            label: 'Avg Latency',
            value: `${metrics.latency}ms`,
            sub: 'p95: 412ms',
            icon: 'mdi:speedometer',
            color: '#FFC107'
        },
        {
            label: 'Requests / Sec',
            value: metrics.throughput,
            sub: 'Normal load',
            icon: 'mdi:chart-timeline-variant',
            color: '#9C27B0'
        }
    ];

    return (
        <Grid container spacing={3}>
            {metricItems.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                    <Paper sx={{
                        p: 2.5,
                        bgcolor: 'rgba(255, 255, 255, 0.02)', // Darker/Translucent instead of default white
                        backgroundImage: 'none',
                        border: '1px solid rgba(255,255,255,0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '4px',
                            height: '100%',
                            bgcolor: item.color
                        }
                    }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{
                                p: 1,
                                borderRadius: 1.5,
                                bgcolor: `${item.color}15`,
                                color: item.color,
                                display: 'flex'
                            }}>
                                <IconifyIcon icon={item.icon} fontSize={24} />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {item.label}
                                </Typography>
                                <Typography variant="h5" fontWeight={700}>
                                    {item.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: item.label === 'Avg Latency' && metrics.latency > 300 ? 'error.main' : 'text.secondary' }}>
                                    {item.sub}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default LiveMonitor;
