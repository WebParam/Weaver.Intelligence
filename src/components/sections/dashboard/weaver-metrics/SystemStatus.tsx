import { useState, useEffect } from 'react';
import { Box, Paper, Stack, Typography, LinearProgress, Chip } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const SystemStatus = () => {
    const [stats, setStats] = useState({
        cpu: 45,
        memory: 62,
        storage: 28,
        uptime: '14d 6h 22m'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                cpu: Math.floor(40 + Math.random() * 20),
                memory: Math.floor(60 + Math.random() * 5)
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const ProgressRow = ({ label, value, color }: { label: string, value: number, color: string }) => (
        <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>{label}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{value}%</Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& .MuiLinearProgress-bar': { bgcolor: color }
                }}
            />
        </Box>
    );

    return (
        <Paper sx={{
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            backgroundImage: 'none',
            border: '1px solid rgba(255,255,255,0.05)',
            height: '100%'
        }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <IconifyIcon icon="mdi:server-outline" color="primary.main" fontSize={20} />
                <Typography variant="h6" fontWeight={700}>System Resources</Typography>
            </Stack>

            <ProgressRow label="CPU Utilization" value={stats.cpu} color="#00D9FF" />
            <ProgressRow label="Memory Pool" value={stats.memory} color="#BB86FC" />
            <ProgressRow label="Fast Cache Store" value={stats.storage} color="#03DAC6" />

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="caption" color="text.secondary">Cluster Uptime</Typography>
                        <Typography variant="body2" fontWeight={700}>{stats.uptime}</Typography>
                    </Box>
                    <Chip size="small" label="STABLE" sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', fontWeight: 800, fontSize: '0.65rem' }} />
                </Stack>
            </Box>
        </Paper>
    );
};

export default SystemStatus;
