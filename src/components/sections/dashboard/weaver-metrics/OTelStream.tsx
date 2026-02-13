import { useState, useEffect } from 'react';
import { Box, Paper, Stack, Typography, Chip } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

interface OTelLog {
    id: string;
    traceId: string;
    spanName: string;
    service: string;
    duration: number;
    status: 'OK' | 'ERROR';
    timestamp: string;
}

const SERVICES = ['weaver-gateway', 'audit-engine', 'policy-executor', 'artifact-store', 'llm-proxy'];
const SPANS = ['POST /v1/chat/completions', 'GET /policy/validate', 'PUT /state/sync', 'POST /audit/log', 'GET /artifacts/list'];

const generateOTel = (): OTelLog => {
    const id = Math.random().toString(36).substring(2, 6).toUpperCase();
    return {
        id: `OTEL-${id}`,
        traceId: Math.random().toString(36).substring(2, 12),
        spanName: SPANS[Math.floor(Math.random() * SPANS.length)],
        service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
        duration: Math.floor(Math.random() * 1500),
        status: Math.random() > 0.95 ? 'ERROR' : 'OK',
        timestamp: new Date().toLocaleTimeString()
    };
};

const OTelStream = () => {
    const [traces, setTraces] = useState<OTelLog[]>([]);

    useEffect(() => {
        setTraces(Array.from({ length: 12 }, generateOTel));
        const interval = setInterval(() => {
            setTraces(prev => [generateOTel(), ...prev.slice(0, 11)]);
        }, 800); // Fast stream as requested
        return () => clearInterval(interval);
    }, []);

    return (
        <Paper sx={{
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            backgroundImage: 'none',
            border: '1px solid rgba(255,255,255,0.05)',
            height: '100%',
            overflow: 'hidden'
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconifyIcon icon="mdi:pulse" color="#03DAC6" fontSize={20} />
                    <Typography variant="h6" fontWeight={700}>OpenTelemetry Spans</Typography>
                </Stack>
                <Chip
                    icon={<IconifyIcon icon="mdi:api" color="#03DAC6" />}
                    label="STREAMING"
                    size="small"
                    sx={{ bgcolor: 'rgba(3, 218, 198, 0.1)', color: '#03DAC6', border: '1px solid rgba(3, 218, 198, 0.3)', fontSize: '0.65rem' }}
                />
            </Stack>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {traces.map((trace) => (
                    <Box
                        key={trace.traceId}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                            px: 2,
                            py: 1,
                            bgcolor: trace.status === 'ERROR' ? 'rgba(244, 67, 54, 0.05)' : 'rgba(255,255,255,0.01)',
                            border: `1px solid ${trace.status === 'ERROR' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255,255,255,0.03)'}`,
                            borderRadius: 1,
                            alignItems: 'center',
                            animation: 'fastFlash 0.3s ease-out'
                        }}
                    >
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600 }}>
                            {trace.spanName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{trace.service}</Typography>
                        <Typography variant="caption" sx={{
                            textAlign: 'right',
                            color: trace.duration > 1000 ? 'warning.main' : '#03DAC6',
                            fontFamily: 'monospace'
                        }}>
                            {trace.duration}ms
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                            <Chip
                                label={trace.status}
                                size="small"
                                sx={{
                                    height: 16,
                                    fontSize: '0.6rem',
                                    bgcolor: trace.status === 'OK' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                    color: trace.status === 'OK' ? '#4CAF50' : '#F44336'
                                }}
                            />
                        </Box>
                    </Box>
                ))}
            </Box>

            <style>{`
                @keyframes fastFlash {
                    from { background-color: rgba(255,255,255,0.1); }
                    to { background-color: transparent; }
                }
            `}</style>
        </Paper>
    );
};

export default OTelStream;
