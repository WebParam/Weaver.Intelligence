import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import IconifyIcon from 'components/base/IconifyIcon';

const envData = [
    { id: 'env-1', name: 'Production', color: '#00D9FF' },
    { id: 'env-2', name: 'Staging', color: '#BB86FC' },
    { id: 'env-3', name: 'Local Dev', color: '#03DAC6' },
    { id: 'env-4', name: 'Secure Airgap', color: '#FFC107' }
];

const EnvResourceCards = () => {
    const [metrics, setMetrics] = useState(envData.map(e => ({
        ...e,
        cpu: 40 + Math.random() * 20,
        mem: 50 + Math.random() * 30
    })));

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => prev.map(m => ({
                ...m,
                cpu: Math.max(10, Math.min(100, m.cpu + (Math.random() * 10 - 5))),
                mem: Math.max(10, Math.min(100, m.mem + (Math.random() * 4 - 2)))
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
            {metrics.map((env) => (
                <Grid item xs={12} sm={6} xl={3} key={env.id}>
                    <Paper sx={{
                        p: 2.25,
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        backgroundImage: 'none',
                        border: '1px solid rgba(255,255,255,0.05)',
                        height: 116
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <IconifyIcon icon="mdi:server-network" color={env.color} fontSize={20} />
                                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                                    {env.name}
                                </Typography>
                            </Stack>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4CAF50', boxShadow: `0 0 8px #4CAF50` }} />
                        </Stack>

                        <Stack spacing={1.5}>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px', fontWeight: 800 }}>CPU</Typography>
                                    <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 800, fontFamily: 'monospace' }}>{env.cpu.toFixed(0)}%</Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={env.cpu}
                                    sx={{
                                        height: 3,
                                        borderRadius: 1,
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        '& .MuiLinearProgress-bar': { bgcolor: env.color }
                                    }}
                                />
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px', fontWeight: 800 }}>MEM</Typography>
                                    <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 800, fontFamily: 'monospace' }}>{env.mem.toFixed(0)}%</Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={env.mem}
                                    sx={{
                                        height: 3,
                                        borderRadius: 1,
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        '& .MuiLinearProgress-bar': { bgcolor: '#03DAC6' }
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default EnvResourceCards;
