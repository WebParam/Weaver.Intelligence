import { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    InputBase,
    Button,
    Card,
    CardContent,
    Tabs,
    Tab,
    LinearProgress,
    Tooltip,
    Avatar,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import PageHeader from 'components/PageHeader';

// --- Types ---
interface Artifact {
    id: string;
    name: string;
    type: 'Model Weight' | 'Policy Version' | 'Automation Script' | 'Agent Blueprint' | 'Memory Snapshot' | 'AI Provider' | 'Vector Store' | 'Knowledge Graph';
    version: string;
    size: string;
    storage: 'AWS S3' | 'Azure Blob' | 'GitHub' | 'HuggingFace' | 'Internal' | 'MinIO' | 'Managed API';
    status: 'Verified' | 'Pending' | 'Active';
    lastUpdated: string;
    tags: string[];
    associations?: { id: string; name: string; type: string }[];
}

interface DBInstance {
    id: string;
    name: string;
    type: string;
    status: 'online' | 'offline';
    capacity: string;
    icon: string;
}

interface StorageMetric {
    label: string;
    value: string;
    progress: number;
    icon: string;
    color: string;
}

// --- Mock Data ---

const DB_CARDS: DBInstance[] = [
    { id: 'db-1', name: 'Operational DB', type: 'PostgreSQL', status: 'online', capacity: '1.2 TB', icon: 'logos:postgresql' },
    { id: 'db-2', name: 'Vector Store', type: 'Qdrant', status: 'online', capacity: '450 GB', icon: 'logos:qdrant-icon' },
    { id: 'db-3', name: 'Graph Engine', type: 'Neo4j', status: 'online', capacity: '200 GB', icon: 'logos:neo4j' },
    { id: 'db-4', name: 'Cache Layer', type: 'Redis', status: 'online', capacity: '64 GB', icon: 'logos:redis' },
];

const STORAGE_METRICS: StorageMetric[] = [
    { label: 'Agent Assets', value: '42 Assets', progress: 84, icon: 'mdi:robot-cog', color: '#BB86FC' },
    { label: 'Heavy Memory (MinIO)', value: '1.4 TB / 2 TB', progress: 70, icon: 'mdi:brain', color: '#03DAC6' },
    { label: 'LLM Models (S3/HF)', value: '2.8 TB / 5 TB', progress: 56, icon: 'mdi:database-import', color: '#00D9FF' },
];

const ARTIFACT_DATA: Artifact[] = [
    // --- AGENTS & MEMORY ---
    {
        id: 'agent-1',
        name: 'AuditAgent_Logic_Core.py',
        type: 'Agent Blueprint',
        version: 'v4.2.1',
        size: '1.2 MB',
        storage: 'GitHub',
        status: 'Verified',
        lastUpdated: '10 mins ago',
        tags: ['Audit', 'Core', 'Live'],
        associations: [{ id: 'mem-1', name: 'Audit_Memory_Q1', type: 'Memory Snapshot' }, { id: 'art-5', name: 'pii_masking', type: 'Policy' }]
    },
    {
        id: 'mem-1',
        name: 'Audit_Memory_Q1_Final.tar.gz',
        type: 'Memory Snapshot',
        version: '2024.02.12',
        size: '850 GB',
        storage: 'MinIO',
        status: 'Verified',
        lastUpdated: '1 hour ago',
        tags: ['Neo4j', 'Long-term'],
    },
    // --- MODELS & PROVIDERS ---
    {
        id: 'art-1',
        name: 'Llama-3-70B-Instruct-Q4.safetensors',
        type: 'Model Weight',
        version: 'v1.4.0',
        size: '39.2 GB',
        storage: 'HuggingFace',
        status: 'Verified',
        lastUpdated: '2 hours ago',
        tags: ['LLM', 'Production'],
    },
    {
        id: 'prov-1',
        name: 'Claude 4.5 Integration',
        type: 'AI Provider',
        version: 'API v1',
        size: 'N/A',
        storage: 'Managed API',
        status: 'Active',
        lastUpdated: '5 mins ago',
        tags: ['Marketing Team', 'Anthropic', 'Premium'],
    },
    {
        id: 'prov-2',
        name: 'OpenAI Enterprise (Marketing)',
        type: 'AI Provider',
        version: 'Tier 1',
        size: 'N/A',
        storage: 'Managed API',
        status: 'Active',
        lastUpdated: 'Just now',
        tags: ['Marketing Team', 'Global'],
    },
    // --- STORES ---
    {
        id: 'store-1',
        name: 'Production Vector Index',
        type: 'Vector Store',
        version: 'v2.4',
        size: '450 GB',
        storage: 'Azure Blob',
        status: 'Active',
        lastUpdated: '1 hour ago',
        tags: ['Pinecone', 'Search'],
    },
    {
        id: 'store-2',
        name: 'Customer Knowledge Graph',
        type: 'Knowledge Graph',
        version: 'v1.2',
        size: '200 GB',
        storage: 'AWS S3',
        status: 'Active',
        lastUpdated: '3 days ago',
        tags: ['FalkorDB', 'RAG'],
    },
    // --- POLICIES & SCRIPTS ---
    {
        id: 'art-5',
        name: 'global_pii_masking.rego',
        type: 'Policy Version',
        version: 'v3.2.1',
        size: '48 KB',
        storage: 'Internal',
        status: 'Verified',
        lastUpdated: '3 days ago',
        tags: ['Security', 'Compliance'],
    },
    {
        id: 'art-6',
        name: 'cost_control_rules.rego',
        type: 'Policy Version',
        version: 'v1.1.0',
        size: '12 KB',
        storage: 'Internal',
        status: 'Verified',
        lastUpdated: '12 hours ago',
        tags: ['Budget', 'Governance'],
    },
    {
        id: 'script-1',
        name: 'deploy_vllm_cluster.py',
        type: 'Automation Script',
        version: 'v2.1.3',
        size: '124 KB',
        storage: 'GitHub',
        status: 'Verified',
        lastUpdated: '5 mins ago',
        tags: ['DevOps'],
    },
];

// --- Sub-components ---

const StorageMetricsBar = () => (
    <Grid container spacing={3} mb={4}>
        {STORAGE_METRICS.map((metric) => (
            <Grid item xs={12} md={4} key={metric.label}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Box sx={{ p: 1, bgcolor: `${metric.color}25`, borderRadius: 1.5, display: 'flex' }}>
                                <IconifyIcon icon={metric.icon} color={metric.color} fontSize={20} />
                            </Box>
                            <Typography variant="body2" fontWeight={600}>{metric.label}</Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">{metric.value}</Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={metric.progress}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            '& .MuiLinearProgress-bar': { bgcolor: metric.color }
                        }}
                    />
                </Paper>
            </Grid>
        ))}
    </Grid>
);

const DBStatusCard = ({ db }: { db: DBInstance }) => (
    <Card sx={{ height: '100%', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                    <IconifyIcon icon={db.icon} fontSize={24} />
                </Box>
                <Chip label={db.status} size="small" color={db.status === 'online' ? 'success' : 'error'} variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
            </Stack>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>{db.name}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>{db.type}</Typography>
            <Typography variant="caption" color="primary.main">{db.capacity}</Typography>
        </CardContent>
    </Card>
);

const ArtifactsTable = ({ data }: { data: Artifact[] }) => (
    <TableContainer component={Paper} sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', backgroundImage: 'none', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Artifact Name</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Source</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Lineage</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Size</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                            <Stack direction="row" alignItems="center" gap={1.5}>
                                {row.type.includes('Agent') ? (
                                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#BB86FC', fontSize: '0.75rem' }}>A</Avatar>
                                ) : (
                                    <IconifyIcon
                                        icon={
                                            row.type === 'Model Weight' ? 'mdi:brain' :
                                                row.type === 'Policy Version' ? 'mdi:shield-check' :
                                                    row.type === 'Memory Snapshot' ? 'mdi:memory' :
                                                        row.type === 'AI Provider' ? 'mdi:api' : 'mdi:file-document-outline'
                                        }
                                        fontSize={20}
                                        color="primary.main"
                                    />
                                )}
                                <Stack>
                                    <Typography variant="body2" fontWeight={700}>{row.name}</Typography>
                                    <Typography variant="caption" color="primary.main" sx={{ fontFamily: 'monospace' }}>{row.version}</Typography>
                                </Stack>
                            </Stack>
                        </TableCell>
                        <TableCell>
                            <Chip label={row.type} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <IconifyIcon icon={
                                    row.storage === 'GitHub' ? 'mdi:github' :
                                        row.storage === 'HuggingFace' ? 'mdi:emoticon-cool' :
                                            row.storage === 'Managed API' ? 'mdi:link-variant' :
                                                row.storage === 'MinIO' ? 'mdi:archive-settings' : 'mdi:server'
                                } fontSize={18} />
                                <Typography variant="body2">{row.storage}</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell>
                            {row.associations ? (
                                <Stack gap={0.5}>
                                    {row.associations.map(assoc => (
                                        <Tooltip key={assoc.id} title={`${assoc.type}: ${assoc.name}`}>
                                            <Chip label={assoc.name} size="small" variant="outlined" sx={{ height: 16, fontSize: '0.55rem' }} />
                                        </Tooltip>
                                    ))}
                                </Stack>
                            ) : <Typography variant="caption" color="text.secondary">---</Typography>}
                        </TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{row.size}</Typography></TableCell>
                        <TableCell>
                            <Chip label={row.status} size="small" variant="outlined" color={row.status === 'Verified' || row.status === 'Active' ? 'success' : 'warning'} sx={{ height: 20, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Inspect Payload">
                                    <IconButton size="small"><IconifyIcon icon="mdi:magnify-plus-outline" /></IconButton>
                                </Tooltip>
                                <IconButton size="small"><IconifyIcon icon="mdi:dots-vertical" /></IconButton>
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

// --- Main Page Component ---

const Artifacts = () => {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArtifacts = ARTIFACT_DATA.filter(art => {
        const matchesSearch = art.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        if (tabValue === 0) return matchesSearch;
        if (tabValue === 1) return matchesSearch && (art.type.includes('Agent') || art.type.includes('Memory'));
        if (tabValue === 2) return matchesSearch && (art.type === 'Model Weight' || art.type === 'AI Provider');
        if (tabValue === 3) return matchesSearch && (art.type.includes('Store') || art.type.includes('Graph'));
        if (tabValue === 4) return matchesSearch && (art.type === 'Policy Version' || art.type === 'Automation Script');
        return matchesSearch;
    });

    return (
        <Box sx={{ pb: 4 }}>
            <PageHeader title="AI Enterprise Artifacts" description="Comprehensive repository for models, agents, memory snapshots, policies, and connected data stores." />

            <StorageMetricsBar />

            <Grid container spacing={3}>
                {/* Connected Data Stores Cards */}
                <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconifyIcon icon="mdi:database-sync" color="primary.main" />
                        Infrastructure Live Status
                    </Typography>
                    <Grid container spacing={2}>
                        {DB_CARDS.map(db => (
                            <Grid item xs={12} sm={6} md={3} key={db.id}><DBStatusCard db={db} /></Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Registry Table */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                            <Box sx={{ width: 400 }}>
                                <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.05)', backgroundImage: 'none' }}>
                                    <IconButton><IconifyIcon icon="mdi:magnify" /></IconButton>
                                    <InputBase sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }} placeholder="Search all enterprise artifacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </Paper>
                            </Box>
                            <Button variant="contained" startIcon={<IconifyIcon icon="mdi:plus" />}>Register New Asset</Button>
                        </Stack>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <Tabs value={tabValue} onChange={(_, nv) => setTabValue(nv)}>
                                <Tab label="All Assets" />
                                <Tab label="Agents & Memory" />
                                <Tab label="Models & Providers" />
                                <Tab label="Data Stores" />
                                <Tab label="Policies & Scripts" />
                            </Tabs>
                        </Box>

                        <ArtifactsTable data={filteredArtifacts} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Artifacts;
