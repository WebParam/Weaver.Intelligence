import { Box, Typography, Paper, Grid, Stack, Chip, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import IconifyIcon from 'components/base/IconifyIcon';

const SummaryGrid = () => {
    const environments = [
        { name: 'Production', rules: 5, status: 'active' },
        { name: 'Staging', rules: 3, status: 'active' },
        { name: 'Development', rules: 2, status: 'maintenance' },
        { name: 'Sandbox', rules: 0, status: 'active' }
    ];

    const rules = [
        { category: 'Guardrails', count: 3, icon: 'mdi:security' },
        { category: 'Quality', count: 2, icon: 'mdi:star-check' },
        { category: 'Compliance', count: 1, icon: 'mdi:file-certificate' }
    ];

    return (
        <Grid container spacing={3}>
            {/* Environments Summary */}
            <Grid item xs={12} md={7}>
                <Paper sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(255,255,255,0.05)',
                    height: '100%'
                }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700}>Environment Coverage</Typography>
                        <Chip label="10 Total Envs" size="small" variant="outlined" />
                    </Stack>
                    <Grid container spacing={2}>
                        {environments.map((env) => (
                            <Grid item xs={6} sm={3} key={env.name}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: env.status === 'active' ? '#4CAF50' : '#FFC107',
                                        boxShadow: env.status === 'active' ? '0 0 6px #4CAF50' : '0 0 6px #FFC107'
                                    }} />
                                    <Typography variant="caption" color="text.secondary" display="block">{env.name}</Typography>
                                    <Typography variant="h6" fontWeight={700} color="primary.main">{env.rules}</Typography>
                                    <Typography variant="caption">Rules</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>

            {/* Rules Summary */}
            <Grid item xs={12} md={5}>
                <Paper sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(255,255,255,0.05)',
                    height: '100%'
                }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700}>Governance Policies</Typography>
                        <Button
                            component={Link}
                            to="/policies"
                            variant="text"
                            size="small"
                            endIcon={<IconifyIcon icon="mdi:arrow-right" fontSize={16} />}
                            sx={{ color: '#00D9FF', fontWeight: 700 }}
                        >
                            View
                        </Button>
                    </Stack>
                    <Stack spacing={2}>
                        {rules.map((rule) => (
                            <Box key={rule.category}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: 'rgba(0, 217, 255, 0.1)',
                                        color: '#00D9FF'
                                    }}>
                                        <IconifyIcon icon={rule.icon} fontSize={20} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2">{rule.category}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ flex: 1, height: 4, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                                <Box sx={{
                                                    width: `${(rule.count / 3) * 100}%`,
                                                    height: '100%',
                                                    bgcolor: '#00D9FF',
                                                    borderRadius: 2
                                                }} />
                                            </Box>
                                            <Typography variant="caption" fontWeight={700}>{rule.count}</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                    <Divider sx={{ my: 2, opacity: 0.1 }} />
                    <Stack direction="row" spacing={1}>
                        <IconifyIcon icon="mdi:refresh" fontSize={16} color="text.secondary" />
                        <Typography variant="caption" color="text.secondary">
                            Last optimized 12m ago
                        </Typography>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SummaryGrid;
