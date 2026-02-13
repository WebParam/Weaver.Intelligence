import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ReactNode } from 'react';

interface TableCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    actions?: ReactNode;
}

const TableCard = ({ title, subtitle, children, actions }: TableCardProps) => (
    <Paper sx={{ p: 2.5, height: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            </Box>
            {actions}
        </Stack>
        {children}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="caption" color="text.secondary">Showing 1-1 of 1 items</Typography>
            <Stack direction="row" spacing={1}>
                <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer' }}>Previous</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer' }}>Next</Typography>
            </Stack>
        </Stack>
    </Paper>
);

const BreakdownTables = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
                <TableCard
                    title="Model Cost Breakdown"
                    subtitle="Displaying detailed cost breakdown by model"
                    actions={
                        <ToggleButtonGroup size="small" value="cost" exclusive>
                            <ToggleButton value="cost" sx={{ textTransform: 'none', px: 1.5 }}>Cost</ToggleButton>
                            <ToggleButton value="usage" sx={{ textTransform: 'none', px: 1.5 }}>Usage</ToggleButton>
                        </ToggleButtonGroup>
                    }
                >
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>Model</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>Input Cost</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>Output Cost</TableCell>
                                    <TableCell align="right" sx={{ color: '#00cc66', fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider' }}>Total Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ border: 'none', py: 2 }}>-</TableCell>
                                    <TableCell align="right" sx={{ border: 'none' }}>$0.000000</TableCell>
                                    <TableCell align="right" sx={{ border: 'none' }}>$0.000000</TableCell>
                                    <TableCell align="right" sx={{ color: '#00cc66', fontWeight: 'bold', border: 'none' }}>$0.000000</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TableCard>
            </Grid>
            <Grid item xs={12} lg={6}>
                <TableCard
                    title="Model Latency Breakdown"
                    subtitle="Displaying latency percentiles by model"
                >
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>Model</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>p50</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>p90</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>p99</TableCell>
                                    <TableCell align="right" sx={{ color: '#00cc66', fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider' }}>Count</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ border: 'none', py: 2 }}>-</TableCell>
                                    <TableCell align="right" sx={{ border: 'none' }}>&lt;1ms</TableCell>
                                    <TableCell align="right" sx={{ border: 'none' }}>&lt;1ms</TableCell>
                                    <TableCell align="right" sx={{ border: 'none' }}>&lt;1ms</TableCell>
                                    <TableCell align="right" sx={{ color: '#00cc66', fontWeight: 'bold', border: 'none' }}>0</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TableCard>
            </Grid>
        </Grid>
    );
};

export default BreakdownTables;
