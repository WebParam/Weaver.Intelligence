import Grid from '@mui/material/Grid';
import LiveMonitor from 'components/sections/dashboard/weaver-metrics/LiveMonitor';
import SummaryGrid from 'components/sections/dashboard/weaver-metrics/SummaryGrid';
import RevenueByCustomer from 'components/sections/dashboard/revenue-by-customer';
import CompletedTask from 'components/sections/dashboard/completed-task';

const OverviewTab = () => {
    return (
        <Grid id="dashboard-content" container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
            {/* Real-time Ticker Metrics */}
            <Grid item xs={12}>
                <LiveMonitor />
            </Grid>

            {/* Environment and Rule Summary */}
            <Grid item xs={12}>
                <SummaryGrid />
            </Grid>



            {/* Token Usage History */}
            <Grid item xs={12} xl={8}>
                <RevenueByCustomer />
            </Grid>

            {/* Audit compliance Queue */}
            <Grid item xs={12} xl={4}>
                <CompletedTask />
            </Grid>
        </Grid>
    );
};

export default OverviewTab;
