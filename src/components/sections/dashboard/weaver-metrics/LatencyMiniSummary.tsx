import { Box, Typography, Stack, LinearProgress } from '@mui/material';

const latencyData = [
    { label: 'p50 (Median)', value: 240, color: '#00D9FF' },
    { label: 'p90 (Fast)', value: 480, color: '#03DAC6' },
    { label: 'p95 (Target)', value: 560, color: '#BB86FC' },
    { label: 'p99 (Limit)', value: 1200, color: '#F44336', max: 2000 }
];

const LatencyMiniSummary = () => {
    return (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', mb: 1.5, display: 'block' }}>
                Latency Percentiles (Live)
            </Typography>
            <Stack spacing={1.5}>
                {latencyData.map((item) => (
                    <Box key={item.label}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600 }}>{item.label}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace' }}>{item.value}ms</Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(100, (item.value / (item.max || 1000)) * 100)}
                            sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'rgba(255,255,255,0.05)',
                                '& .MuiLinearProgress-bar': { bgcolor: item.color }
                            }}
                        />
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default LatencyMiniSummary;
