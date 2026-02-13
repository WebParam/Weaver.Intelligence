import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface StatCardProps {
    title: string;
    value: string;
    subtext: string;
}

const StatCard = ({ title, value, subtext }: StatCardProps) => (
    <Paper sx={{ p: 2.5, height: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
                {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold">
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {subtext}
            </Typography>
        </Stack>
    </Paper>
);

const StatCards = () => {
    const stats = [
        { title: 'Model Requests', value: '0', subtext: 'Total requests in selected period' },
        { title: 'Total Model Cost', value: '$0.00', subtext: 'Total cost across all models' },
        { title: 'Average Model Latency', value: '<1ms', subtext: 'Average response time across all models' },
    ];

    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <StatCard {...stat} />
                </Grid>
            ))}
        </Grid>
    );
};

export default StatCards;
