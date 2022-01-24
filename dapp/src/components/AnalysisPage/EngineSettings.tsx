import { ExpandMore } from '@material-ui/icons';
import { Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, Divider, Input } from '@mui/material';
import React from 'react';

type EngineSettingsProps = {
    depth: number;
    engines: { [key: string]: boolean };
    onDepthChanged?: (depth: number) => void;
    onEngineToggled?: (engine: string) => void;
};

const EngineSettings: React.FC<EngineSettingsProps> = ({ engines, depth, onEngineToggled, onDepthChanged }) => (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            Engine Settings
        </AccordionSummary>
        <AccordionDetails>
            Engines to use:<br />
            { Object.keys(engines).sort().map(k => (
                <FormControlLabel
                    key={k}
                    control={<Checkbox checked={engines[k]} onClick={() => { onEngineToggled && onEngineToggled(k); }} />}
                    label={`${k} `}
                />
            ))}
            <Divider />
            Depth: <Input type="number" onChange={e => onDepthChanged && onDepthChanged(+e.target.value)} defaultValue={depth} />
        </AccordionDetails>
    </Accordion>
);
export default EngineSettings;
