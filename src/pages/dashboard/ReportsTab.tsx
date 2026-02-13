import { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Stack,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    CardActions,
    Divider,
    Tooltip
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

interface ReportType {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    tags: string[];
}

const reportTypes: ReportType[] = [
    {
        id: 'envelope-data',
        title: 'Envelope Data',
        description: 'Complete trace data including metadata, payloads, and governance results.',
        icon: 'mdi:package-variant-closed',
        color: '#00D9FF',
        tags: ['JSON', 'CSV', 'Parquet']
    },
    {
        id: 'audit-results',
        title: 'Audit Results',
        description: 'Consolidated audit reports for compliance validation and rule execution history.',
        icon: 'mdi:file-certificate',
        color: '#4CAF50',
        tags: ['PDF', 'Excel']
    },
    {
        id: 'traces',
        title: 'System Traces',
        description: 'Technical OpenTelemetry spans, latency logs, and service-to-service calls.',
        icon: 'mdi:pulse',
        color: '#BB86FC',
        tags: ['JSON', 'Jaeger']
    },
    {
        id: 'consolidated-logs',
        title: 'Consolidated Logs',
        description: 'Aggregated system logs across all services, environments and agents.',
        icon: 'mdi:format-list-bulleted',
        color: '#FFC107',
        tags: ['Text', 'Gzip']
    }
];

const customReports = [
    {
        id: 'cust_001',
        title: 'High Latency Production Filter',
        description: 'Filter envelopes where latency > 500ms in Production.',
        icon: 'mdi:filter-variant',
        color: '#F44336',
        automation: 'Every 24h',
        lastRun: '2h ago'
    },
    {
        id: 'cust_002',
        title: 'Governance Risk Summary',
        description: 'Weekly summary of failed governance rules for executive review.',
        icon: 'mdi:alert-decagram-outline',
        color: '#FFC107',
        automation: 'Weekly (Mon)',
        lastRun: '4 days ago'
    }
];

const mockHistory = [
    { id: 'rpt_001', name: 'Prod_Audit_Feb_2026.pdf', date: '2026-02-13 10:22', type: 'Audit Results', size: '2.4 MB', status: 'Generated' },
    { id: 'rpt_002', name: 'Global_Envelopes_Q1.csv', date: '2026-02-12 18:45', type: 'Envelope Data', size: '128 MB', status: 'Cached' },
    { id: 'rpt_003', name: 'Gateway_Traces_Weekly.json', date: '2026-02-11 09:12', type: 'System Traces', size: '45 MB', status: 'Generated' },
];

const ReportsTab = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Box id="reports-content">
            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Reporting Engine</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Generate, schedule and export governance telemetry
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        placeholder="Search reports..."
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconifyIcon icon="mingcute:search-line" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<IconifyIcon icon="mdi:plus" />}
                        sx={{ px: 3, py: 1.1, fontWeight: 700 }}
                    >
                        Create Report
                    </Button>
                </Stack>
            </Stack>

            {/* Standard Report Generation Grid */}
            <Typography variant="h6" fontWeight={700} mb={2}>Standard Reports</Typography>
            <Grid container spacing={3} mb={5}>
                {reportTypes.map((report) => (
                    <Grid item xs={12} sm={6} md={3} key={report.id}>
                        <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            backgroundImage: 'none'
                        }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 1.5,
                                    bgcolor: `${report.color}15`,
                                    color: report.color,
                                    width: 'fit-content',
                                    mb: 2
                                }}>
                                    <IconifyIcon icon={report.icon} fontSize={28} />
                                </Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    {report.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                    {report.description}
                                </Typography>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                    {report.tags.map(tag => (
                                        <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                                    ))}
                                </Stack>
                            </CardContent>
                            <Divider sx={{ opacity: 0.1 }} />
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                                <Button size="small" variant="contained" color="primary" sx={{ px: 2 }}>
                                    Generate
                                </Button>
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="Email Report">
                                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                            <IconifyIcon icon="mdi:email-outline" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Direct Download">
                                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                            <IconifyIcon icon="mdi:download-outline" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Custom & Automated Reports Section */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <Typography variant="h6" fontWeight={700}>Custom & Automated Reports</Typography>
                <Chip
                    label="SCHEDULER ACTIVE"
                    size="small"
                    icon={<IconifyIcon icon="mdi:clock-check-outline" />}
                    sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', fontWeight: 800, fontSize: '0.65rem' }}
                />
            </Stack>
            <Grid container spacing={3} mb={5}>
                {customReports.map((report) => (
                    <Grid item xs={12} md={6} key={report.id}>
                        <Paper sx={{
                            p: 3,
                            bgcolor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0) 100%)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Stack direction="row" spacing={3} alignItems="flex-start">
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: `${report.color}10`,
                                    color: report.color,
                                    border: `1px solid ${report.color}30`
                                }}>
                                    <IconifyIcon icon={report.icon} fontSize={32} />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={700}>{report.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" mb={2}>{report.description}</Typography>
                                        </Box>
                                        <IconButton size="small"><IconifyIcon icon="mdi:dots-vertical" /></IconButton>
                                    </Stack>
                                    <Stack direction="row" spacing={3}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">Automation</Typography>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <IconifyIcon icon="mdi:clock-outline" fontSize={14} color="#4CAF50" />
                                                <Typography variant="caption" fontWeight={700} color="#4CAF50">{report.automation}</Typography>
                                            </Stack>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">Last Run</Typography>
                                            <Typography variant="caption" fontWeight={700}>{report.lastRun}</Typography>
                                        </Box>
                                        <Box sx={{ ml: 'auto', alignSelf: 'center' }}>
                                            <Button size="small" variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
                                                View Saved
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Generation History */}
            <Typography variant="h6" fontWeight={700} mb={2}>Recent Export History</Typography>
            <TableContainer component={Paper} sx={{
                bgcolor: 'rgba(255,255,255,0.02)',
                backgroundImage: 'none',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>File Name</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Report Type</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Generated Date</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Size</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Status</TableCell>
                            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockHistory.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <IconifyIcon icon="mdi:file-document-outline" color="primary.main" />
                                        <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{row.type}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" color="text.secondary">{row.date}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption">{row.size}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={row.status} size="small" color={row.status === 'Generated' ? 'success' : 'info'} variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <IconButton size="small"><IconifyIcon icon="mdi:email-outline" /></IconButton>
                                        <IconButton size="small"><IconifyIcon icon="mdi:download-outline" /></IconButton>
                                        <IconButton size="small" color="error"><IconifyIcon icon="mdi:delete-outline" /></IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ReportsTab;
