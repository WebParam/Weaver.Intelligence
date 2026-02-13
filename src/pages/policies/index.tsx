import { useState } from 'react';
import {
    Box,
    CardContent,
    Typography,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    IconButton,
    Paper,
    Card,
    Stack,
    Button,
    Breadcrumbs,
    Link,
    Chip
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SendIcon from '@mui/icons-material/Send';
import PolicyIcon from '@mui/icons-material/Policy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconifyIcon from 'components/base/IconifyIcon';

// --- Types ---
type PolicyFile = {
    id: string;
    label: string;
    type: 'folder' | 'file';
    fileType?: 'rego';
    content?: string;
    appliesTo?: string[];
    children?: PolicyFile[];
};

type PolicyCategory = {
    id: string;
    title: string;
    description: string;
    icon: string;
    activeEnvironments: number;
    subPolicyCount: number;
    rootNodeIds: string[]; // Root folder IDs associated with this category
};

// --- Mock Data ---

const CATEGORIES: PolicyCategory[] = [
    {
        id: 'cat-llm',
        title: 'LLM Inference Response Policies',
        description: 'Verify model outputs for safety, PII, and explicit content.',
        icon: 'mdi:robot-confused-outline',
        activeEnvironments: 3,
        subPolicyCount: 2,
        rootNodeIds: ['root-quality'],
    },
    {
        id: 'cat-governance',
        title: 'Enterprise Governance',
        description: 'Global guardrails for cost, security, and compliance.',
        icon: 'mdi:shield-check-outline',
        activeEnvironments: 10,
        subPolicyCount: 3,
        rootNodeIds: ['root-guardrails', 'root-compliance'],
    },
    {
        id: 'cat-it',
        title: 'Whitelisted Models (IT)',
        description: 'Infrastructure rules for approved model versions.',
        icon: 'mdi:server-security',
        activeEnvironments: 5,
        subPolicyCount: 1,
        rootNodeIds: ['root-it'],
    },
    {
        id: 'cat-agent',
        title: 'Agent Execution Policies',
        description: 'Control agent autonomy, tool access, and multi-turn behavior.',
        icon: 'mdi:robot-industrial-outline',
        activeEnvironments: 4,
        subPolicyCount: 2,
        rootNodeIds: ['root-agent'],
    },
];

const POLICY_DATA: PolicyFile[] = [
    {
        id: 'root-guardrails',
        label: 'guardrails',
        type: 'folder',
        children: [
            {
                id: 'guard-1',
                label: 'pii_detection.rego',
                type: 'file',
                fileType: 'rego',
                appliesTo: ['Development', 'Staging', 'Production'],
                content: `package weaver.guardrails\n\nimport future.keywords.if\n\n# Default deny\ndefault allow := false\n\n# Allow if no PII detected\nallow if {\n    not contains_pii\n}\n\n# Detect email addresses\ncontains_pii if {\n    regex.match(\`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}\`, input.payload)\n}`
            },
            {
                id: 'guard-2',
                label: 'cost_limits.rego',
                type: 'file',
                fileType: 'rego',
                appliesTo: ['Development', 'Staging', 'Production'],
                content: `package weaver.guardrails\n\nimport future.keywords.if\n\n# Cost thresholds by environment\ncost_limits := {\n    "development": 100,\n    "staging": 500,\n    "production": 1000\n}\n\n# Allow if cost is within limits\nallow if {\n    input.estimated_cost < cost_limits[input.environment]\n}`
            }
        ]
    },
    {
        id: 'root-quality',
        label: 'llm_inference',
        type: 'folder',
        children: [
            {
                id: 'qual-1',
                label: 'explicit_content_check.rego',
                type: 'file',
                fileType: 'rego',
                appliesTo: ['Staging', 'Production'],
                content: `package weaver.quality\n\n# Block explicit words\ndeny if {\n    explicit_words := ["unsafe", "explicit", "harmful"]\n    some word in explicit_words\n    contains(lower(input.llm_response.text), word)\n}`
            },
            {
                id: 'qual-2',
                label: 'customer_info_leak.rego',
                type: 'file',
                fileType: 'rego',
                appliesTo: ['Production'],
                content: `package weaver.quality\n\n# Block customer info leaks\ndeny if {\n    contains(input.llm_response.text, input.customer_metadata.internal_id)\n}`
            }
        ]
    },
    {
        id: 'root-it',
        label: 'model_whitelist',
        type: 'folder',
        children: [
            {
                id: 'it-1',
                label: 'approved_models.rego',
                type: 'file',
                fileType: 'rego',
                appliesTo: ['Production', 'Development'],
                content: `package weaver.it\n\n# Approved models for IT hierarchy\napproved_models := [\n    "GLM 5.1",\n    "Gemini 2.0 Pro",\n    "GPT-4o",\n    "Claude 3.5 Sonnet"\n]\n\nallow if {\n    input.model_id in approved_models\n}`
            }
        ]
    },
    {
        id: 'root-compliance',
        label: 'compliance',
        type: 'folder',
        children: [
            {
                id: 'comp-1',
                label: 'gdpr_compliance.rego',
                type: 'file',
                fileType: 'rego',
                appliesTo: ['Production'],
                content: `package weaver.compliance\n\n# GDPR compliance checks\ncompliant if {\n    input.metadata.user_consent == true\n    input.metadata.retention_days <= 365\n}`
            }
        ]
    },
    {
        id: 'root-agent',
        label: 'agent_runtime',
        type: 'folder',
        children: [
            {
                id: 'agent-1',
                label: 'tool_access_control.rego',
                type: 'file',
                fileType: 'rego',
                appliesTo: ['Staging', 'Production'],
                content: `package weaver.agent\n\n# Restricted tools for sensitive envs\nrestricted_tools := ["delete_database", "terminal_access"]\n\ndeny if {\n    input.tool_name in restricted_tools\n    input.environment == "production"\n}`
            },
            {
                id: 'agent-2',
                label: 'max_loops_protection.rego',
                type: 'file',
                fileType: 'rego',
                appliesTo: ['Development', 'Staging', 'Production'],
                content: `package weaver.agent\n\n# Prevent execution loops\ndeny if {\n    input.iteration_count > 10\n}`
            }
        ]
    }
];

// --- Helper Components ---

const FileIcon = ({ type, fileType }: { type: 'folder' | 'file', fileType?: string }) => {
    if (type === 'folder') return <FolderOpenIcon fontSize="small" color="primary" />;
    if (fileType === 'rego') return <PolicyIcon fontSize="small" sx={{ color: '#00D9FF' }} />;
    return <PolicyIcon fontSize="small" color="info" />;
};

// --- Sub-components ---

const SummaryCard = ({ category, onClick }: { category: PolicyCategory, onClick: () => void }) => (
    <Card
        onClick={onClick}
        sx={{
            p: 3,
            height: '100%',
            cursor: 'pointer',
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                transform: 'translateY(-4px)',
                borderColor: 'primary.main'
            }
        }}
    >
        <Stack gap={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(0, 217, 255, 0.1)', borderRadius: 2 }}>
                    <IconifyIcon icon={category.icon} fontSize={32} color="primary.main" />
                </Box>
                <Chip
                    label="Active"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.65rem' }}
                />
            </Box>
            <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {category.description}
                </Typography>
            </Box>
            <Stack direction="row" gap={2} mt={1}>
                <Stack direction="row" alignItems="center" gap={0.5}>
                    <IconifyIcon icon="mdi:server-network" fontSize={16} color="text.secondary" />
                    <Typography variant="caption" color="text.secondary">
                        {category.activeEnvironments} Envs
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={0.5}>
                    <IconifyIcon icon="mdi:file-tree" fontSize={16} color="text.secondary" />
                    <Typography variant="caption" color="text.secondary">
                        {category.subPolicyCount} Policies
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    </Card>
);

// --- Main Page Component ---

const Policies = () => {
    const [view, setView] = useState<'summary' | 'detail'>('summary');
    const [selectedCategory, setSelectedCategory] = useState<PolicyCategory | null>(null);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [chatMessage, setChatMessage] = useState('');

    const handleCategoryClick = (category: PolicyCategory) => {
        setSelectedCategory(category);
        setView('detail');
        setSelectedFileId(null);
    };

    const handleBack = () => {
        setView('summary');
        setSelectedCategory(null);
        setSelectedFileId(null);
    };

    // Filter data for the tree view based on selected category
    const filteredPolicyData = selectedCategory
        ? POLICY_DATA.filter(node => selectedCategory.rootNodeIds.includes(node.id))
        : POLICY_DATA;

    const getAllFiles = (nodes: PolicyFile[]): PolicyFile[] => {
        let files: PolicyFile[] = [];
        nodes.forEach(node => {
            if (node.type === 'file') files.push(node);
            if (node.children) files = files.concat(getAllFiles(node.children));
        });
        return files;
    };

    const files = getAllFiles(filteredPolicyData);

    const renderTree = (nodes: PolicyFile[]) => {
        return nodes.map((node) => (
            <TreeItem
                key={node.id}
                itemId={node.id}
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                        <FileIcon type={node.type} fileType={node.fileType} />
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'monospace',
                                color: selectedFileId === node.id ? 'primary.main' : 'inherit'
                            }}
                        >
                            {node.label}
                        </Typography>
                    </Box>
                }
                onClick={() => node.type === 'file' && setSelectedFileId(node.id)}
            >
                {node.children && renderTree(node.children)}
            </TreeItem>
        ));
    };

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            console.log('Message sent:', chatMessage);
            setChatMessage('');
        }
    };

    return (
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
            {/* Header Area with Breadcrumbs */}
            <Box sx={{ px: 3, pt: 2 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <Link
                        underline="hover"
                        color={view === 'summary' ? 'white' : 'inherit'}
                        onClick={handleBack}
                        sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        Policy Explorer
                    </Link>
                    {view === 'detail' && (
                        <Typography color="white" sx={{ fontSize: '0.875rem' }}>
                            {selectedCategory?.title}
                        </Typography>
                    )}
                </Breadcrumbs>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    {view === 'detail' && (
                        <IconButton onClick={handleBack} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                    )}
                    <Typography variant="h4" fontWeight={700}>
                        {view === 'summary' ? 'Policies' : selectedCategory?.title}
                    </Typography>
                </Box>
            </Box>

            {view === 'summary' ? (
                /* SUMMARY VIEW */
                <Grid container spacing={3} sx={{ px: 3, pb: 4 }}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Classified Governance Rules & Guardrails
                        </Typography>
                    </Grid>
                    {CATEGORIES.map(cat => (
                        <Grid item xs={12} md={6} key={cat.id}>
                            <SummaryCard category={cat} onClick={() => handleCategoryClick(cat)} />
                        </Grid>
                    ))}

                    {/* Placeholder for "All Policies" access */}
                    <Grid item xs={12} sx={{ mt: 4 }}>
                        <Paper
                            sx={{
                                p: 3,
                                bgcolor: 'rgba(0, 217, 255, 0.05)',
                                border: '1px dashed rgba(0, 217, 255, 0.3)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Box>
                                <Typography variant="h6" fontWeight={600}>Legacy Tree View</Typography>
                                <Typography variant="body2" color="text.secondary">Access all policies in a single hierarchical view.</Typography>
                            </Box>
                            <Button variant="outlined" startIcon={<FolderOpenIcon />} onClick={() => {
                                setSelectedCategory(null);
                                setView('detail');
                            }}>
                                Open Full Repository
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                /* DETAIL (TREE) VIEW */
                <Grid container sx={{ flex: 1, overflow: 'hidden' }}>
                    {/* LEFT PANE: Tree View */}
                    <Grid item xs={12} md={3} sx={{
                        borderRight: '1px solid rgba(255,255,255,0.1)',
                        overflowY: 'auto',
                        p: 2
                    }}>
                        <SimpleTreeView
                            aria-label="policy navigator"
                            defaultExpandedItems={['root-guardrails', 'root-quality', 'root-it', 'root-compliance', 'root-agent']}
                            slots={{
                                collapseIcon: ExpandMoreIcon,
                                expandIcon: ChevronRightIcon,
                            }}
                        >
                            {renderTree(filteredPolicyData)}
                        </SimpleTreeView>
                    </Grid>

                    {/* MIDDLE PANE: Policy Content */}
                    <Grid item xs={12} md={6} sx={{
                        overflowY: 'auto',
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.02)',
                        borderRight: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {files.map((file) => (
                            <Accordion
                                key={file.id}
                                expanded={selectedFileId === file.id}
                                onChange={(_e, expanded) => setSelectedFileId(expanded ? file.id : null)}
                                sx={{
                                    bgcolor: 'transparent',
                                    color: 'white',
                                    mb: 2,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    '&:before': { display: 'none' },
                                    borderRadius: 1
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        minHeight: 48,
                                        '&.Mui-expanded': { minHeight: 48 }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                        <FileIcon type="file" fileType={file.fileType} />
                                        <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', color: selectedFileId === file.id ? 'primary.main' : 'inherit', flex: 1 }}>
                                            {file.label}
                                        </Typography>
                                        {file.appliesTo && (
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                {file.appliesTo.length} env{file.appliesTo.length > 1 ? 's' : ''}
                                            </Typography>
                                        )}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 0 }}>
                                    {file.appliesTo && (
                                        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                                                Applied to:
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {file.appliesTo.map((env) => (
                                                    <Box
                                                        key={env}
                                                        sx={{
                                                            px: 1.5,
                                                            py: 0.5,
                                                            bgcolor: 'rgba(0, 217, 255, 0.1)',
                                                            border: '1px solid rgba(0, 217, 255, 0.3)',
                                                            borderRadius: 1,
                                                            fontSize: '0.75rem',
                                                            fontFamily: 'monospace'
                                                        }}
                                                    >
                                                        {env}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'rgba(0,0,0,0.3)',
                                        fontFamily: 'monospace',
                                        fontSize: '0.85rem',
                                        lineHeight: 1.6,
                                        overflowX: 'auto'
                                    }}>
                                        <pre style={{ margin: 0 }}>{file.content}</pre>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>

                    {/* RIGHT PANE: Chat Interface (Always available in detail) */}
                    <Grid item xs={12} md={3} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2
                    }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Policy Assistant
                        </Typography>
                        <Paper sx={{
                            flex: 1,
                            bgcolor: 'rgba(0,0,0,0.3)',
                            p: 2,
                            mb: 2,
                            overflowY: 'auto',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                Ask me to modify {selectedCategory ? selectedCategory.title : 'these rules'}...
                            </Typography>
                        </Paper>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Edit rule logic..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(0,0,0,0.3)',
                                        fontFamily: 'monospace',
                                        fontSize: '0.85rem'
                                    }
                                }}
                            />
                            <IconButton color="primary" onClick={handleSendMessage} disabled={!chatMessage.trim()} sx={{ bgcolor: 'rgba(0, 217, 255, 0.1)' }}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </CardContent>
    );
};

export default Policies;
