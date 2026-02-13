import { useState, useEffect } from 'react';
import { Box, Paper, Stack, Typography, Chip } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

interface DeepEvalLog {
    id: string;
    metric: string;
    score: number;
    input: string;
    output: string;
    status: 'PASS' | 'FAIL';
    timestamp: string;
}

const METRICS = ['Hallucination', 'Bias', 'Toxicity', 'Faithfulness', 'Answer Relevancy', 'Contextual Relevancy'];
const INPUT_SNIPPETS = ['What is the capital...', 'Check the rule for...', 'Explain the policy...', 'Analyze the trace...', 'Summarize reports...'];

const generateDeepEval = (): DeepEvalLog => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    const score = 0.5 + Math.random() * 0.5;
    return {
        id: `DE-${id}`,
        metric: METRICS[Math.floor(Math.random() * METRICS.length)],
        score: parseFloat(score.toFixed(3)),
        input: INPUT_SNIPPETS[Math.floor(Math.random() * INPUT_SNIPPETS.length)],
        output: 'System response analyzed...',
        status: score > 0.7 ? 'PASS' : 'FAIL',
        timestamp: new Date().toLocaleTimeString()
    };
};

const DeepEvalStream = () => {
    const [logs, setLogs] = useState<DeepEvalLog[]>([]);

    useEffect(() => {
        setLogs(Array.from({ length: 8 }, generateDeepEval));
        const interval = setInterval(() => {
            setLogs(prev => [generateDeepEval(), ...prev.slice(0, 7)]);
        }, 4000); // Slower than OTel
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
                    <IconifyIcon icon="mdi:brain-check" color="#BB86FC" fontSize={20} />
                    <Typography variant="h6" fontWeight={700}>DeepEval Metrics</Typography>
                </Stack>
                <Chip
                    label="EVALUATING"
                    size="small"
                    sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#BB86FC', border: '1px solid rgba(187, 134, 252, 0.3)', fontSize: '0.65rem' }}
                />
            </Stack>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {logs.map((log) => (
                    <Box
                        key={log.id}
                        sx={{
                            p: 2,
                            bgcolor: 'rgba(255,255,255,0.01)',
                            border: '1px solid rgba(255,255,255,0.03)',
                            borderRadius: 1.5,
                            transition: 'all 0.3s ease',
                            animation: 'slideIn 0.4s ease'
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="caption" sx={{ color: '#BB86FC', fontWeight: 800, letterSpacing: 1 }}>
                                    {log.metric.toUpperCase()}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.9, mt: 0.5 }}>
                                    {log.input}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" sx={{ color: log.status === 'PASS' ? '#4CAF50' : '#F44336', fontWeight: 800 }}>
                                    {log.score}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">{log.timestamp}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                ))}
            </Box>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </Paper>
    );
};

export default DeepEvalStream;
