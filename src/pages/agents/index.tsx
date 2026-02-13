import { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Stack,
    Chip,
    Avatar,
    IconButton,
    InputAdornment,
    TextField,
    Button,
    Divider,
    Tabs,
    Tab,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    LinearProgress,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

interface AgentTool {
    name: string;
    description: string;
    policies: string[];
}

interface MCP {
    name: string;
    status: 'connected' | 'disconnected' | 'warning';
    tools: number;
    latency: string;
    uptime: string;
}

interface Agent {
    id: string;
    name: string;
    avatar: string;
    environment: 'Production' | 'Staging' | 'Development';
    llm: string;
    artifacts: string[];
    policies: string[];
    mcpServers: string[];
    tools: AgentTool[];
    status: 'active' | 'idle' | 'busy';
}

const AGENTS: Agent[] = [
    {
        id: 'agent-1',
        name: 'Advisor Agent',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Advisor',
        environment: 'Production',
        llm: 'Gemini 1.5 Pro',
        artifacts: ['Knowledge Base v2', 'Customer History'],
        policies: ['Max Loops (10)', 'Safety Alignment', 'PII Masking'],
        status: 'active',
        mcpServers: ['Customer-DB-MCP'],
        tools: [
            { name: 'search_records', description: 'Search customer database', policies: ['Audit All Requests'] },
            { name: 'generate_summary', description: 'Summarize interaction', policies: ['Conciseness Check'] }
        ]
    },
    {
        id: 'agent-2',
        name: 'Support Bot',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Support',
        environment: 'Production',
        llm: 'Claude 3.5 Sonnet',
        artifacts: ['Docling-v1', 'FAQ-Index'],
        policies: ['Response Coherence', 'Protocol Adherence'],
        status: 'busy',
        mcpServers: ['Zendesk-Connector', 'File-System-MCP'],
        tools: [
            { name: 'create_ticket', description: 'Create support ticket', policies: ['Rate Limit (10/min)'] },
            { name: 'read_doc', description: 'Read artifact content', policies: ['Access restricted to artifacts/*'] }
        ]
    },
    {
        id: 'agent-3',
        name: 'Auditor-X',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Auditor',
        environment: 'Staging',
        llm: 'Llama 3.1 405B',
        artifacts: ['Policy Engine v5'],
        policies: ['Strict Accuracy', 'Compliance Check'],
        status: 'idle',
        mcpServers: ['GitHub-MCP'],
        tools: [
            { name: 'list_pull_requests', description: 'Audit code changes', policies: ['Read-only'] },
            { name: 'verify_governance', description: 'Validate rego policies', policies: ['No Overrides'] }
        ]
    }
];

const MCP_SERVERS: MCP[] = [
    { name: 'Customer-DB', status: 'connected', tools: 5, latency: '12ms', uptime: '99.98%' },
    { name: 'Zendesk-Connector', status: 'connected', tools: 3, latency: '45ms', uptime: '98.5%' },
    { name: 'GitHub-Core', status: 'connected', tools: 8, latency: '28ms', uptime: '99.2%' },
    { name: 'File-System', status: 'warning', tools: 2, latency: '340ms', uptime: '92.1%' },
    { name: 'Slack-Interface', status: 'disconnected', tools: 4, latency: '0ms', uptime: '0%' },
    { name: 'AWS-Redshift-MCP', status: 'connected', tools: 12, latency: '88ms', uptime: '99.9%' },
    { name: 'SAP-Bridge', status: 'connected', tools: 6, latency: '110ms', uptime: '99.5%' },
    { name: 'Stripe-Billing', status: 'connected', tools: 4, latency: '15ms', uptime: '99.99%' },
    { name: 'Vector-Store-Prod', status: 'connected', tools: 3, latency: '8ms', uptime: '99.95%' },
    { name: 'Legacy-CRM-Proxy', status: 'warning', tools: 2, latency: '540ms', uptime: '88.4%' },
    { name: 'Redis-Cache-Tier', status: 'connected', tools: 0, latency: '1ms', uptime: '100%' },
    { name: 'Elastic-Search-Log', status: 'connected', tools: 2, latency: '15ms', uptime: '99.8%' },
    { name: 'Azure-AD-Sync', status: 'connected', tools: 5, latency: '120ms', uptime: '99.1%' },
    { name: 'Snowflake-DW', status: 'connected', tools: 10, latency: '210ms', uptime: '99.7%' },
    { name: 'Internal-Wiki-Bot', status: 'disconnected', tools: 1, latency: '0ms', uptime: '0%' }
];

const ACTIVITIES = [
    { id: 'env-8842', envelopeId: 'env_tr_9901', agent: 'Advisor Agent', tool: 'SQL_Query', mcp: 'Customer-DB', time: '2 mins ago', status: 'Compliant', rule: 'PII_Masking_v2' },
    { id: 'env-8843', envelopeId: 'env_tr_9902', agent: 'Support Bot', tool: 'Update_Ticket', mcp: 'Zendesk', time: '5 mins ago', status: 'Violation', rule: 'Cost_Threshold_Exceeded' },
    { id: 'env-8844', envelopeId: 'env_tr_9903', agent: 'Auditor-X', tool: 'Fetch_PR', mcp: 'GitHub-Core', time: '12 mins ago', status: 'Compliant', rule: 'Governance_Access_Policy' },
    { id: 'env-8845', envelopeId: 'env_tr_9944', agent: 'Advisor Agent', tool: 'Vector_Search', mcp: 'Vector-Store', time: '15 mins ago', status: 'Compliant', rule: 'Context_Alignment' },
    { id: 'env-8846', envelopeId: 'env_tr_9945', agent: 'Support Bot', tool: 'Post_Slack', mcp: 'Slack-Interface', time: '20 mins ago', status: 'Compliant', rule: 'Internal_Comms_v1' },
    { id: 'env-8847', envelopeId: 'env_tr_9946', agent: 'Auditor-X', tool: 'Check_Log', mcp: 'Elastic-Search', time: '25 mins ago', status: 'Compliant', rule: 'Audit_Retention_Policy' },
    { id: 'env-8848', envelopeId: 'env_tr_9947', agent: 'Advisor Agent', tool: 'Get_User', mcp: 'Azure-AD', time: '30 mins ago', status: 'Violation', rule: 'Auth_Boundary_Check' },
    { id: 'env-8849', envelopeId: 'env_tr_9948', agent: 'Support Bot', tool: 'Read_File', mcp: 'File-System', time: '35 mins ago', status: 'Compliant', rule: 'Sandbox_Escalation_v2' },
];

const AgentCard = ({ agent }: { agent: Agent }) => {
    const [expanded, setExpanded] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#4CAF50';
            case 'busy': return '#FFC107';
            case 'idle': return '#9E9E9E';
            default: return '#FFF';
        }
    };

    return (
        <Paper sx={{
            p: 3,
            bgcolor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            backgroundImage: 'none',
            transition: 'all 0.3s ease',
            height: 'fit-content',
            '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(255,255,255,0.04)'
            }
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ position: 'relative' }}>
                        <Avatar src={agent.avatar} sx={{ width: 56, height: 56, border: '2px solid rgba(255,255,255,0.1)' }} />
                        <Box sx={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: getStatusColor(agent.status),
                            border: '2px solid #000',
                            boxShadow: `0 0 8px ${getStatusColor(agent.status)}`
                        }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>{agent.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                label={agent.environment}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: 'rgba(0, 217, 255, 0.1)',
                                    color: '#00D9FF'
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {agent.llm}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
                <IconButton onClick={() => setExpanded(!expanded)} sx={{ color: 'text.secondary' }}>
                    <IconifyIcon icon={expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                </IconButton>
            </Stack>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Assigned Policy Guardrails</Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {agent.policies.map(p => (
                            <Chip key={p} label={p} size="small" sx={{ fontSize: '0.6rem', height: 18, bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#BB86FC' }} />
                        ))}
                    </Stack>
                </Grid>
            </Grid>

            <Collapse in={expanded}>
                <Divider sx={{ my: 2, opacity: 0.1 }} />

                <Typography variant="subtitle2" fontWeight={700} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconifyIcon icon="mdi:shield-bug-outline" color="primary.main" fontSize={18} />
                    Tool Integration (weaver_audit)
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1, fontSize: '0.65rem', color: 'text.secondary', fontWeight: 700 } }}>
                            <TableCell sx={{ pl: 0 }}>MCP Tool</TableCell>
                            <TableCell align="right">Active Rego Policy</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agent.tools.map((tool) => (
                            <TableRow key={tool.name} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.02)', py: 1, fontSize: '0.75rem' } }}>
                                <TableCell sx={{ pl: 0, fontFamily: 'monospace', fontWeight: 600 }}>{tool.name}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                        {tool.policies.map(p => (
                                            <Chip key={p} label={p} size="small" variant="outlined" sx={{ height: 16, fontSize: '0.55rem' }} />
                                        ))}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Collapse>
        </Paper>
    );
};

const ComplianceHealth = () => (
    <Paper sx={{
        p: 2.5,
        bgcolor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        backgroundImage: 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)'
    }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Envelope Audit Success
                </Typography>
                <Typography variant="h4" fontWeight={800} color="#00D9FF">99.4%</Typography>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: 'rgba(0, 217, 255, 0.1)', borderRadius: '50%', color: '#00D9FF' }}>
                <IconifyIcon icon="mdi:email-check-outline" fontSize={32} />
            </Box>
        </Stack>
        <LinearProgress
            variant="determinate"
            value={99.4}
            sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.05)',
                '& .MuiLinearProgress-bar': { bgcolor: '#00D9FF' }
            }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            1,245 envelopes audited in last 24h
        </Typography>
    </Paper>
);

const MCPServerCard = ({ server }: { server: MCP }) => (
    <Paper sx={{
        p: 2,
        bgcolor: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.2s ease',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(0, 217, 255, 0.2)' }
    }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{
                p: 1.2,
                borderRadius: 1.5,
                bgcolor: server.status === 'connected' ? 'rgba(76, 175, 80, 0.1)' :
                    server.status === 'warning' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                color: server.status === 'connected' ? '#4CAF50' :
                    server.status === 'warning' ? '#FFC107' : '#F44336'
            }}>
                <IconifyIcon icon="mdi:server-network" fontSize={20} />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: '0.8rem' }}>{server.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>Latency: {server.latency}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: server.status === 'connected' ? '#4CAF50' : server.status === 'warning' ? '#FFC107' : '#F44336', display: 'inline-block' }} />
            </Box>
        </Stack>
    </Paper>
);

const Agents = () => {
    const [envFilter, setEnvFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAgents = AGENTS.filter(agent => {
        const matchesEnv = envFilter === 'All' || agent.environment === envFilter;
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.llm.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesEnv && matchesSearch;
    });

    return (
        <Box p={3}>
            {/* Header Area */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Agents Explorer</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Audit workforce actions, monitor MCP toolchains, and track envelope-based governance
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        placeholder="Search workforce..."
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
                        sx={{ width: 250 }}
                    />
                    <Button variant="contained" startIcon={<IconifyIcon icon="mdi:plus" />}>
                        Deploy Agent
                    </Button>
                </Stack>
            </Stack>

            {/* Top Row: Metrics & Health */}
            <Grid container spacing={3} mb={5}>
                <Grid item xs={12} md={4}>
                    <ComplianceHealth />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', mb: 2, display: 'block' }}>
                            Audit Engine Throughput
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="caption">Total Envelopes Processed</Typography>
                                    <Typography variant="caption" fontWeight={700}>14.2k</Typography>
                                </Stack>
                                <LinearProgress variant="determinate" value={82} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} />
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="caption">Avg. Rule Evaluation Latency</Typography>
                                    <Typography variant="caption" fontWeight={700}>42ms</Typography>
                                </Stack>
                                <LinearProgress variant="determinate" value={35} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#03DAC6' } }} />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>
                            Governance Policy Coverage
                        </Typography>
                        <Stack direction="row" spacing={3} mt={1}>
                            <Box>
                                <Typography variant="h5" fontWeight={800}>18</Typography>
                                <Typography variant="caption" color="text.secondary">Active Rules</Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ opacity: 0.1 }} />
                            <Box>
                                <Typography variant="h5" fontWeight={800} color="#FFC107">3</Typography>
                                <Typography variant="caption" color="text.secondary">Shadow Mode</Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ opacity: 0.1 }} />
                            <Box>
                                <Typography variant="h5" fontWeight={800} color="#00D9FF">100%</Typography>
                                <Typography variant="caption" color="text.secondary">Compliance</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Agent Workforce Grid (2 per row) */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={700}>Agent Workforce Matrix</Typography>
                <Tabs
                    value={envFilter}
                    onChange={(_, v) => setEnvFilter(v)}
                    sx={{
                        minHeight: 0,
                        bgcolor: 'rgba(255,255,255,0.02)',
                        borderRadius: 1,
                        p: 0.5,
                        '& .MuiTab-root': { minHeight: 28, fontSize: '0.65rem', px: 2, borderRadius: 1, minWidth: 60 },
                        '& .Mui-selected': { bgcolor: 'primary.main', color: 'white !important' },
                        '& .MuiTabs-indicator': { display: 'none' }
                    }}
                >
                    <Tab label="All" value="All" />
                    <Tab label="Prod" value="Production" />
                    <Tab label="Stage" value="Staging" />
                    <Tab label="Dev" value="Development" />
                </Tabs>
            </Stack>
            <Grid container spacing={3} mb={6}>
                {filteredAgents.map(agent => (
                    <Grid item xs={12} md={6} key={agent.id}>
                        <AgentCard agent={agent} />
                    </Grid>
                ))}
            </Grid>

            {/* MCP Servers Section */}
            <Typography variant="h6" fontWeight={700} mb={2}>MCP Context Infrastructure (Audit Linked)</Typography>
            <Grid container spacing={2} mb={6}>
                {MCP_SERVERS.map(server => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={server.name}>
                        <MCPServerCard server={server} />
                    </Grid>
                ))}
            </Grid>

            {/* Recent Activity Section */}
            <Typography variant="h6" fontWeight={700} mb={2}>Envelope Audit Logs (weaver_audit Activity)</Typography>
            <Paper sx={{ bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', backgroundImage: 'none', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Envelope ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Agent</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>MCP Tool Access</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Triggered Policy Rule</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Timestamp</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Audit Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ACTIVITIES.map((row) => (
                            <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}>{row.envelopeId}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>{row.agent}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" color="text.secondary">{row.mcp} - </Typography>
                                        <Chip label={row.tool} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.65rem', height: 18 }} />
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{row.rule}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption">{row.time}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: row.status === 'Compliant' ? '#4CAF50' : '#F44336' }} />
                                        <Typography variant="caption" fontWeight={700} sx={{ color: row.status === 'Compliant' ? '#4CAF50' : '#F44336' }}>{row.status}</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default Agents;
