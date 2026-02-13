import Grid from '@mui/material/Grid';
import LiveMetricStream from 'components/sections/dashboard/weaver-metrics/LiveMetricStream';
import DeepEvalStream from 'components/sections/dashboard/weaver-metrics/DeepEvalStream';
import OTelStream from 'components/sections/dashboard/weaver-metrics/OTelStream';
import EnvResourceCards from 'components/sections/dashboard/weaver-metrics/EnvResourceCards';

const LiveMetricsTab = () => {
    return (
        <Grid id="live-metrics-content" container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
            {/* Top: Environment Resources */}
            <Grid item xs={12}>
                <EnvResourceCards />
            </Grid>

            {/* Middle: Main Traffic (Full Width) */}
            <Grid item xs={12}>
                <LiveMetricStream />
            </Grid>

            {/* Bottom: Split Eval & Traces */}
            <Grid item xs={12} md={6}>
                <DeepEvalStream />
            </Grid>
            <Grid item xs={12} md={6}>
                <OTelStream />
            </Grid>
        </Grid>
    );
};

export default LiveMetricsTab;
