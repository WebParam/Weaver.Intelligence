import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@mui/system';
import ReactECharts from 'echarts-for-react';
import IconifyIcon from 'components/base/IconifyIcon';
import PageHeader from 'components/PageHeader';

// --- Animations ---
const pulsate = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

// --- Types ---
interface Artifact {
    id: string;
    name: string;
    type: 'Model' | 'Agent' | 'State' | 'Policy';
    hosting: 'Local' | 'Cloud' | 'Provider';
    providerName?: string;
}

interface Environment {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'maintenance';
    url: string;
    description: string;
    version: string;
    lastDeployed: string;
    appliedRules: string[];
    artifacts: Artifact[];
    activityData: number[];
}

// --- Mock Data ---
const initialEnvironments: Environment[] = [
    {
        id: 'env-1',
        name: 'Production (Main)',
        status: 'active',
        url: 'https://prod.weaver.ai',
        description: 'Global production cluster with high-availability provider integrations.',
        version: 'v2.4.1',
        lastDeployed: '2 hours ago',
        appliedRules: ['pii_detection.rego', 'security_check.rego', 'cost_limits.rego', 'gdpr_compliance.rego'],
        artifacts: [
            { id: 'art-1', name: 'Gemini 1.5 Pro', type: 'Model', hosting: 'Provider', providerName: 'Google' },
            { id: 'art-2', name: 'Claude 3.5 Sonnet', type: 'Model', hosting: 'Provider', providerName: 'Anthropic' },
            { id: 'art-ag-1', name: 'Customer Service Agent (Insurance)', type: 'Agent', hosting: 'Cloud' },
            { id: 'art-ag-2', name: 'Claims Logic Processor', type: 'Agent', hosting: 'Cloud' }
        ],
        activityData: [120, 132, 101, 134, 90, 230, 210, 180, 250, 300]
    },
    {
        id: 'env-2',
        name: 'Staging Cluster',
        status: 'active',
        url: 'https://staging.weaver.ai',
        description: 'Pre-production environment running cloud-hosted open models.',
        version: 'v2.5.0-beta',
        lastDeployed: '45 mins ago',
        appliedRules: ['pii_detection.rego', 'hallucination_check.rego'],
        artifacts: [
            { id: 'art-3', name: 'Llama-3-70B', type: 'Model', hosting: 'Cloud' },
            { id: 'art-ag-3', name: 'Website QA Agent (Sales)', type: 'Agent', hosting: 'Cloud' },
            { id: 'art-ag-4', name: 'Lead Validator', type: 'Agent', hosting: 'Cloud' }
        ],
        activityData: [50, 60, 45, 80, 120, 110, 95, 130, 140, 125]
    },
    {
        id: 'env-3',
        name: 'Local Dev Edge',
        status: 'maintenance',
        url: 'http://localhost:8080',
        description: 'Personalized edge testing environment for local model refinement.',
        version: 'v2.5.0-alpha',
        lastDeployed: '5 mins ago',
        appliedRules: ['cost_limits.rego'],
        artifacts: [
            { id: 'art-5', name: 'Mistral-7B-Instruct', type: 'Model', hosting: 'Local' },
            { id: 'art-ag-5', name: 'Sandbox Debugger Agent', type: 'Agent', hosting: 'Local' }
        ],
        activityData: [10, 15, 8, 25, 40, 35, 20, 50, 60, 45]
    },
    {
        id: 'env-4',
        name: 'Secure Airgap',
        status: 'inactive',
        url: 'http://internal.airgap',
        description: 'Highly secure environment with locally persisted agent state.',
        version: 'v2.4.1',
        lastDeployed: '2 days ago',
        appliedRules: ['pii_detection.rego', 'gdpr_compliance.rego'],
        artifacts: [
            { id: 'art-ag-6', name: 'Inventory Compliance Agent', type: 'Agent', hosting: 'Local' }
        ],
        activityData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
];

const ActivityChart = ({ data, color }: { data: number[], color: string }) => {
    const option = {
        grid: { left: 0, right: 0, top: 10, bottom: 0 },
        xAxis: { type: 'category', show: false },
        yAxis: { type: 'value', show: false },
        series: [
            {
                data: data,
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 3, color: color },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: `${color}44` },
                            { offset: 1, color: `${color}00` }
                        ]
                    }
                }
            }
        ],
        animation: true,
        tooltip: { show: false }
    };
    return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

const HostingBadge = ({ hosting, providerName }: { hosting: Artifact['hosting'], providerName?: string }) => {
    const config = {
        Local: { icon: 'mdi:laptop', color: '#BB86FC', label: 'Local' },
        Cloud: { icon: 'mdi:cloud', color: '#03DAC6', label: 'Cloud' },
        Provider: { icon: 'mdi:api', color: '#00D9FF', label: providerName || 'Provider' }
    };
    const { icon, color, label } = config[hosting];

    return (
        <Tooltip title={`${hosting} Hosting${providerName ? `: ${providerName}` : ''}`}>
            <Stack direction="row" alignItems="center" gap={0.5} sx={{ color: color, opacity: 0.8 }}>
                <IconifyIcon icon={icon} fontSize={12} />
                <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 600 }}>{label.toUpperCase()}</Typography>
            </Stack>
        </Tooltip>
    );
};

const EnvironmentCard = ({
    environment,
    index,
    onDragStart,
    onDragOver,
    onDrop,
}: {
    environment: Environment;
    index: number;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, index: number) => void;
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const statusColors = {
        active: '#00FA9A',
        inactive: '#808080',
        maintenance: '#FFA500',
    };

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper
                onClick={() => setModalOpen(true)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, index)}
                sx={{
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(255, 255, 255, 0.04)',
                    }
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Box sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: statusColors[environment.status],
                        boxShadow: `0 0 10px ${statusColors[environment.status]}`,
                        animation: environment.status === 'active' ? `${pulsate} 2s infinite ease-in-out` : 'none'
                    }} />
                </Box>

                <Stack direction="column" gap={expanded ? 1 : 0} sx={{ width: '100%' }}>
                    <Stack direction="row" gap={1.5} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Stack direction="row" gap={1.5} alignItems="center">
                            <Box
                                draggable
                                onDragStart={(e) => onDragStart(e, index)}
                                onClick={(e) => e.stopPropagation()}
                                sx={{ cursor: 'grab', display: 'flex', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                            >
                                <IconifyIcon icon="mdi:drag-vertical" color="text.secondary" fontSize={20} />
                            </Box>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>{environment.name}</Typography>
                        </Stack>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(!expanded);
                            }}
                            sx={{
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                                bgcolor: 'rgba(255,255,255,0.03)'
                            }}
                        >
                            <IconifyIcon icon="mdi:chevron-down" />
                        </IconButton>
                    </Stack>

                    <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.75rem', lineHeight: 1.4, opacity: 0.8 }}>
                                {environment.description}
                            </Typography>

                            <Typography variant="caption" color="primary.main" sx={{ fontFamily: 'monospace', fontWeight: 600, display: 'block', mb: 2 }}>
                                {environment.version}
                            </Typography>

                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 800, letterSpacing: '0.05em', fontSize: '9px' }}>
                                    DEPLOYED AGENTS
                                </Typography>
                                <Stack gap={1}>
                                    {environment.artifacts.filter(a => a.type === 'Agent').map(art => (
                                        <Stack key={art.id} gap={0.5} sx={{ mb: 1.5 }}>
                                            <Stack direction="row" gap={1} alignItems="center">
                                                <IconifyIcon
                                                    icon="mdi:robot-excited-outline"
                                                    fontSize={14}
                                                    color="#00D9FF"
                                                />
                                                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 600, color: '#00D9FF' }}>{art.name}</Typography>
                                            </Stack>
                                            <Box sx={{ pl: 3 }}>
                                                <HostingBadge hosting={art.hosting} providerName={art.providerName} />
                                            </Box>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>

                            <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 800, letterSpacing: '0.05em', fontSize: '9px' }}>
                                    SYSTEM ARTIFACTS
                                </Typography>
                                <Stack gap={1}>
                                    {environment.artifacts.filter(a => a.type !== 'Agent').map(art => (
                                        <Stack key={art.id} gap={0.5} sx={{ mb: 1.5 }}>
                                            <Stack direction="row" gap={1} alignItems="center">
                                                <IconifyIcon
                                                    icon={art.type === 'Model' ? 'mdi:brain' : 'mdi:database-outline'}
                                                    fontSize={14}
                                                    color="primary.main"
                                                />
                                                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 500 }}>{art.name}</Typography>
                                            </Stack>
                                            <Box sx={{ pl: 3 }}>
                                                <HostingBadge hosting={art.hosting} providerName={art.providerName} />
                                            </Box>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '9px' }}>
                                        ACTIVITY STREAM (24H)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px' }}>
                                        LIVE
                                    </Typography>
                                </Stack>
                                <Box sx={{ height: 45, opacity: 0.8 }}>
                                    <ActivityChart data={environment.activityData} color={statusColors[environment.status]} />
                                </Box>
                            </Box>
                        </Box>
                    </Collapse>
                </Stack>
            </Paper>

            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: '80%',
                        height: '80vh',
                        bgcolor: 'rgba(12, 12, 12, 0.98)',
                        backdropFilter: 'blur(16px)',
                        backgroundImage: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        overflow: 'hidden'
                    },
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" gap={2} alignItems="center">
                            <Box sx={{ p: 1, bgcolor: 'rgba(0, 217, 255, 0.1)', borderRadius: 2 }}>
                                <IconifyIcon icon="mdi:server-network" color="primary.main" fontSize={28} />
                            </Box>
                            <Typography variant="h5" fontWeight={700}>{environment.name}</Typography>
                        </Stack>
                        <Chip
                            label={environment.status.toUpperCase()}
                            sx={{
                                bgcolor: `${statusColors[environment.status]}20`,
                                color: statusColors[environment.status],
                                fontWeight: 800,
                                border: `1px solid ${statusColors[environment.status]}40`
                            }}
                        />
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                    <Grid container sx={{ height: '100%' }}>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                            <Box sx={{ p: 4, flex: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto' }}>
                                <Typography variant="overline" color="text.secondary" fontWeight={800} gutterBottom sx={{ letterSpacing: '0.1em' }}>
                                    GOVERNANCE RULES & POLICIES
                                </Typography>
                                <Stack gap={1.5} mt={2}>
                                    {environment.appliedRules.map((rule) => (
                                        <Paper key={rule} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <IconifyIcon icon="mdi:shield-check" color="#00D9FF" />
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#00D9FF' }}>{rule}</Typography>
                                            <Chip label="ACTIVE" size="small" sx={{ ml: 'auto', height: 18, fontSize: '9px', bgcolor: 'rgba(0, 217, 255, 0.1)', color: '#00D9FF' }} />
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>
                            <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="overline" color="text.secondary" fontWeight={800} gutterBottom sx={{ letterSpacing: '0.1em' }}>
                                    REAL-TIME TRAFFIC (REQUESTS/SEC)
                                </Typography>
                                <Box sx={{ flex: 1, mt: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                    <ActivityChart data={environment.activityData} color={statusColors[environment.status]} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
                                <Typography variant="overline" color="text.secondary" fontWeight={800} gutterBottom sx={{ letterSpacing: '0.1em' }}>
                                    DEPLOYED AGENTS
                                </Typography>
                                <Stack gap={1.5} mt={2} mb={4}>
                                    {environment.artifacts.filter(a => a.type === 'Agent').map(art => (
                                        <Paper key={art.id} sx={{ p: 2, bgcolor: 'rgba(0, 217, 255, 0.05)', border: '1px solid rgba(0, 217, 255, 0.2)', borderRadius: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" gap={2} alignItems="center">
                                                    <Box sx={{ p: 1, bgcolor: 'rgba(0, 217, 255, 0.1)', borderRadius: 1.5 }}>
                                                        <IconifyIcon icon="mdi:robot-excited-outline" color="#00D9FF" fontSize={24} />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={700} color="#00D9FF">{art.name}</Typography>
                                                        <HostingBadge hosting={art.hosting} providerName={art.providerName} />
                                                    </Box>
                                                </Stack>
                                                <Button size="small" variant="text" sx={{ color: '#00D9FF' }}>Manage</Button>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>

                                <Typography variant="overline" color="text.secondary" fontWeight={800} gutterBottom sx={{ letterSpacing: '0.1em' }}>
                                    SYSTEM INFRASTRUCTURE
                                </Typography>
                                <Stack gap={2} mt={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>ENDPOINT URL</Typography>
                                        <Typography variant="body2" color="primary.main" sx={{ fontFamily: 'monospace', bgcolor: 'rgba(0, 217, 255, 0.05)', p: 1, borderRadius: 1 }}>{environment.url}</Typography>
                                    </Box>
                                    <Stack gap={1.5}>
                                        {environment.artifacts.filter(a => a.type !== 'Agent').map(art => (
                                            <Paper key={art.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" gap={2} alignItems="center">
                                                        <Box sx={{ p: 1, bgcolor: `${statusColors[environment.status]}10`, borderRadius: 1.5 }}>
                                                            <IconifyIcon
                                                                icon={art.type === 'Model' ? 'mdi:brain' : art.type === 'Agent' ? 'mdi:robot-cog' : 'mdi:database'}
                                                                color="primary.main"
                                                            />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={700}>{art.name}</Typography>
                                                            <HostingBadge hosting={art.hosting} providerName={art.providerName} />
                                                        </Box>
                                                    </Stack>
                                                    <IconButton size="small"><IconifyIcon icon="mdi:cog-outline" fontSize={18} /></IconButton>
                                                </Stack>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Stack>
                            </Box>
                            <Box sx={{ p: 4, pt: 0, mt: 'auto' }}>
                                <Stack gap={1.5}>
                                    <Button variant="contained" fullWidth startIcon={<IconifyIcon icon="mdi:sync" />} sx={{ py: 1.5, borderRadius: 2 }}>Sync Environment State</Button>
                                    <Stack direction="row" gap={1.5}>
                                        <Button variant="outlined" fullWidth color="warning" startIcon={<IconifyIcon icon="mdi:restart" />} sx={{ py: 1.5, borderRadius: 2 }}>Restart</Button>
                                        <Button variant="outlined" fullWidth color="error" startIcon={<IconifyIcon icon="mdi:stop" />} sx={{ py: 1.5, borderRadius: 2 }}>Terminate</Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(0,0,0,0.2)' }}>
                    <Button onClick={() => setModalOpen(false)} sx={{ color: 'text.secondary', fontWeight: 700 }}>Close Inspector</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

const Environments = () => {
    const [environments, setEnvironments] = useState<Environment[]>(initialEnvironments);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;
        const newEnvironments = [...environments];
        const [draggedItem] = newEnvironments.splice(draggedIndex, 1);
        newEnvironments.splice(dropIndex, 0, draggedItem);
        setEnvironments(newEnvironments);
        setDraggedIndex(null);
    };

    return (
        <Box sx={{ pb: 6 }}>
            <PageHeader
                title="Environments"
                description="Manage live deployments and monitor real-time activity across local, cloud, and provider-hosted AI infrastructure."
            />
            <Grid container spacing={4} mt={1}>
                {environments.map((env, index) => (
                    <EnvironmentCard
                        key={env.id}
                        environment={env}
                        index={index}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}
            </Grid>
        </Box>
    );
};

export default Environments;
