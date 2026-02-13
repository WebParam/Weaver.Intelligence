import { Typography, Stack } from '@mui/material';

interface PageHeaderProps {
    title: string;
    description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
    return (
        <>
            <Stack spacing={0.5} sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography><br /><br />

            </Stack>
            <Stack spacing={0.5} sx={{ mb: 3 }}>

                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Stack>
        </>
    );
};

export default PageHeader;
