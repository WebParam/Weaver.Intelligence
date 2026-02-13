import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Stack } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const complianceData = [
    {
        env: 'Production',
        envelopes: '1.2M',
        lastBackup: '12m ago',
        lastAudit: '2026-02-12 14:30',
        failedAudits: 2,
        status: 'compliant'
    },
    {
        env: 'Staging',
        envelopes: '450K',
        lastBackup: '1h ago',
        lastAudit: '2026-02-12 09:15',
        failedAudits: 0,
        status: 'compliant'
    },
    {
        env: 'Development',
        envelopes: '125K',
        lastBackup: '4h ago',
        lastAudit: '2026-02-11 18:00',
        failedAudits: 5,
        status: 'warning'
    },
    {
        env: 'Secure Airgap',
        envelopes: '89K',
        lastBackup: '12h ago',
        lastAudit: '2026-02-10 12:00',
        failedAudits: 1,
        status: 'compliant'
    }
];

const ComplianceEnvironmentTable = () => {
    return (
        <Paper sx={{
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            backgroundImage: 'none',
            border: '1px solid rgba(255,255,255,0.05)',
            width: '100%',
            overflow: 'auto'
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconifyIcon icon="mdi:clipboard-check-outline" color="#00D9FF" fontSize={22} />
                    <Typography variant="h6" fontWeight={700}>Compliance & Audit Status (Per Environment)</Typography>
                </Stack>
                <Chip
                    label="ISO 27001 READY"
                    size="small"
                    sx={{ bgcolor: 'rgba(0, 217, 255, 0.1)', color: '#00D9FF', fontWeight: 800, fontSize: '0.65rem' }}
                />
            </Stack>

            <Table>
                <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2, color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' } }}>
                        <TableCell>Environment</TableCell>
                        <TableCell align="right">Envelope Count</TableCell>
                        <TableCell align="right">Last Backup</TableCell>
                        <TableCell align="right">Last Audit Run</TableCell>
                        <TableCell align="center">Failed Reports</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {complianceData.map((row) => (
                        <TableRow key={row.env} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.02)', py: 2 } }}>
                            <TableCell>
                                <Typography variant="body2" fontWeight={600}>{row.env}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.envelopes}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2" color="text.secondary">{row.lastBackup}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{row.lastAudit}</Typography>
                            </TableCell>
                            <TableCell align="center">
                                {row.failedAudits > 0 ? (
                                    <Chip
                                        label={`${row.failedAudits} Failed`}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#F44336', fontSize: '0.7rem', fontWeight: 700 }}
                                    />
                                ) : (
                                    <Typography variant="caption" color="text.disabled">—</Typography>
                                )}
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: row.status === 'compliant' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                    color: row.status === 'compliant' ? '#4CAF50' : '#FFC107'
                                }}>
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
                                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>{row.status}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                    <IconifyIcon icon="mdi:file-download-outline" />
                                </IconButton>
                                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                    <IconifyIcon icon="mdi:eye-outline" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default ComplianceEnvironmentTable;
