import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

type TabPanelProps = { 
    value: number;
    index: number;
};

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TabPanel: React.FC<TabPanelProps> = props => (
    <div
        role="tabpanel"
        hidden={props.value !== props.index}
        id={`simple-tabpanel-${props.index}`}
        aria-labelledby={`simple-tab-${props.index}`}
    >
        { props.value === props.index && (
            <Box sx={{ p: 3 }}>
                <Typography>{props.children}</Typography>
            </Box>
        )}
      </div>
);
export default TabPanel;
