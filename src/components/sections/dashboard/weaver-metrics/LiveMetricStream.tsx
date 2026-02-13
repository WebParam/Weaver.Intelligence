import { useState, useEffect } from 'react';
import { Box, Paper, Stack, Typography, Chip } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

interface EnvelopeLog {
    id: string;
    type: string;
    tenant: string;
    environment: string;
    status: 'PASS' | 'WARN' | 'FAIL';
    latency: number;
    timestamp: string;
}

const ENVELOPE_TYPES = ['KNOWLEDGE', 'RULE', 'AUDIT', 'ACTION', 'MODEL', 'PROMPT'];
const TENANTS = ['tenant-acme', 'tenant-delta', 'tenant-omega'];
const ENVIRONMENTS = ['Production', 'Staging', 'Development'];
const STATUSES: ('PASS' | 'WARN' | 'FAIL')[] = ['PASS', 'PASS', 'PASS', 'PASS', 'WARN', 'FAIL']; // Weighted towards PASS

const generateEnvelope = (): EnvelopeLog => {
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
        id: `ENV-${id}`,
        type: ENVELOPE_TYPES[Math.floor(Math.random() * ENVELOPE_TYPES.length)],
        tenant: TENANTS[Math.floor(Math.random() * TENANTS.length)],
        environment: ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)],
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        latency: Math.floor(Math.random() * 200) + 50,
        timestamp: new Date().toLocaleTimeString()
    };
};

const LiveMetricStream = () => {
    const [logs, setLogs] = useState<EnvelopeLog[]>([]);

    useEffect(() => {
        // Initial set
        setLogs(Array.from({ length: 10 }, generateEnvelope));

        const interval = setInterval(() => {
            setLogs(prev => {
                const newLog = generateEnvelope();
                return [newLog, ...prev.slice(0, 9)]; // Keep latest 10
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PASS': return '#4CAF50';
            case 'WARN': return '#FFC107';
            case 'FAIL': return '#F44336';
            default: return 'text.secondary';
        }
    };

    return (
        <Paper sx={{
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            backgroundImage: 'none',
            border: '1px solid rgba(255,255,255,0.05)',
            minHeight: 500
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={700}>Live Envelope Stream</Typography>
                <Chip
                    icon={<IconifyIcon icon="mdi:record" color="#F44336" />}
                    label="LIVE"
                    size="small"
                    variant="outlined"
                    sx={{ color: '#F44336', borderColor: 'rgba(244, 67, 54, 0.3)' }}
                />
            </Stack>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Header Row */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 0.8fr',
                    px: 2,
                    mb: 1,
                    color: 'text.secondary'
                }}>
                    <Typography variant="caption" sx={{ letterSpacing: 1 }}>ENVELOPE ID</Typography>
                    <Typography variant="caption" sx={{ letterSpacing: 1 }}>TYPE</Typography>
                    <Typography variant="caption" sx={{ letterSpacing: 1 }}>TENANT</Typography>
                    <Typography variant="caption" sx={{ letterSpacing: 1 }}>ENVIRONMENT</Typography>
                    <Typography variant="caption" sx={{ letterSpacing: 1 }}>GOVERNANCE</Typography>
                    <Typography variant="caption" sx={{ letterSpacing: 1, textAlign: 'right' }}>LATENCY</Typography>
                </Box>

                {logs.map((log) => (
                    <Box
                        key={log.id}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 0.8fr',
                            p: 2,
                            bgcolor: 'rgba(255,255,255,0.01)',
                            border: '1px solid rgba(255,255,255,0.03)',
                            borderRadius: 1,
                            alignItems: 'center',
                            transition: 'all 0.3s ease',
                            animation: 'fadeIn 0.5s ease'
                        }}
                    >
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main' }}>
                            {log.id}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            <Chip label={log.type} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">{log.tenant}</Typography>
                        <Typography variant="body2">{log.environment}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(log.status) }} />
                            <Typography variant="body2" fontWeight={700} sx={{ color: getStatusColor(log.status), fontSize: '0.75rem' }}>
                                {log.status}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ textAlign: 'right', fontFamily: 'monospace', color: log.latency > 200 ? 'error.main' : 'text.secondary' }}>
                            {log.latency}ms
                        </Typography>
                    </Box>
                ))}
            </Box>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Paper>
    );
};

export default LiveMetricStream;
