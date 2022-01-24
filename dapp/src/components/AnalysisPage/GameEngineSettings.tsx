import { ExpandMore } from '@material-ui/icons';
import { Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Divider, Input, Radio } from '@mui/material';
import React from 'react';

type GameEngineSettingsProps = {
    whiteEngine: string;
    whiteEngineDepth: number;
    whiteEngineTimeLimit: number;
    blackEngine: string;
    blackEngineDepth: number;
    blackEngineTimeLimit: number;
    plyLimit: number;
    onWhiteEngineChanged?: (whiteEngine: string) => void;
    onWhiteEngineDepthChanged?: (whiteEngineDepth: number) => void;
    onWhiteEngineTimeLimitChanged?: (whiteEngineTimeLimit: number) => void;
    onBlackEngineChanged?: (blackEngine: string) => void;
    onBlackEngineDepthChanged?: (blackEngineDepth: number) => void;
    onBlackEngineTimeLimitChanged?: (blackEngineTimeLimit: number) => void;
    onPlyLimitChanged: (plyLimit: number) => void;
};

const GameEngineSettings: React.FC<GameEngineSettingsProps> = props => (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            Game Settings
        </AccordionSummary>
        <AccordionDetails>
            Ply Limit: <Input type="number" onChange={e => props.onPlyLimitChanged && props.onPlyLimitChanged(+e.target.value)} defaultValue={props.plyLimit} /><br />
        </AccordionDetails>
        <AccordionSummary expandIcon={<ExpandMore />}>
            White Engine Settings
        </AccordionSummary>
        <AccordionDetails>
            Engine to use:<br />
            { [ "Igel", "RubiChess", "Stockfish" ].sort().map(k => (
                <FormControlLabel
                    key={k}
                    control={<Radio checked={props.whiteEngine === k} onClick={() => { props.onWhiteEngineChanged && props.onWhiteEngineChanged(k); }} />}
                    label={`${k} `}
                />
            ))}
            <Divider />
            Depth: <Input type="number" onChange={e => props.onWhiteEngineDepthChanged && props.onWhiteEngineDepthChanged(+e.target.value)} defaultValue={props.whiteEngineDepth} /><br />
            Time Limit: <Input type="number" onChange={e => props.onWhiteEngineTimeLimitChanged && props.onWhiteEngineTimeLimitChanged(+e.target.value)} defaultValue={props.whiteEngineTimeLimit} />
        </AccordionDetails>
        <AccordionSummary expandIcon={<ExpandMore />}>
            Black Engine Settings
        </AccordionSummary>
        <AccordionDetails>
        Engine to use:<br />
            { [ "Igel", "RubiChess", "Stockfish" ].sort().map(k => (
                <FormControlLabel
                    key={k}
                    control={<Radio checked={props.blackEngine === k} onClick={() => { props.onBlackEngineChanged && props.onBlackEngineChanged(k); }} />}
                    label={`${k} `}
                />
            ))}
            <Divider />
            Depth: <Input type="number" onChange={e => props.onBlackEngineDepthChanged && props.onBlackEngineDepthChanged(+e.target.value)} defaultValue={props.blackEngineDepth} /><br />
            Time Limit: <Input type="number" onChange={e => props.onBlackEngineTimeLimitChanged && props.onBlackEngineTimeLimitChanged(+e.target.value)} defaultValue={props.blackEngineTimeLimit} />
        </AccordionDetails>
    </Accordion>
);
export default GameEngineSettings;
