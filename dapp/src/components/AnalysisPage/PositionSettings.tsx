import { ExpandMore } from '@material-ui/icons';
import { Accordion, AccordionDetails, AccordionSummary, Divider, FormControlLabel, Switch } from '@mui/material';
import React from 'react';

type PositionSettingsProps = {
    blackToPlay: boolean;
    blackCanCastleShort: boolean;
    whiteCanCastleShort: boolean;
    blackCanCastleLong: boolean;
    whiteCanCastleLong: boolean;
    onBlackToPlayToggled?: () => void;
    onWhiteCanCastleShortToggled?: () => void;
    onBlackCanCastleShortToggled?: () => void;
    onWhiteCanCastleLongToggled?: () => void;
    onBlackCanCastleLongToggled?: () => void;
};

const PositionSettings: React.FC<PositionSettingsProps> = ({
    blackCanCastleShort, blackToPlay, whiteCanCastleShort, onBlackCanCastleShortToggled, onBlackToPlayToggled, onWhiteCanCastleShortToggled,
    whiteCanCastleLong, blackCanCastleLong, onWhiteCanCastleLongToggled, onBlackCanCastleLongToggled
}) => (
    <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
            Position Settings
        </AccordionSummary>
        <AccordionDetails>
            Next to play:<br />
            <FormControlLabel
                control={<Switch checked={blackToPlay} onChange={() => onBlackToPlayToggled && onBlackToPlayToggled()} />}
                label={blackToPlay ? "black" : "white"}
            /><br />
            <Divider /><br />
            Castling:<br />
            <FormControlLabel
                control={<Switch checked={whiteCanCastleShort} onChange={() => onWhiteCanCastleShortToggled && onWhiteCanCastleShortToggled()} />}
                label={whiteCanCastleShort ? "white can castle short" : "white cannot castle short"}
            />&nbsp;
            <FormControlLabel
                control={<Switch checked={whiteCanCastleLong} onChange={() => onWhiteCanCastleLongToggled && onWhiteCanCastleLongToggled()} />}
                label={whiteCanCastleLong ? "white can castle long" : "white cannot castle long"}
            />&nbsp;<br />
            <FormControlLabel
                control={<Switch checked={blackCanCastleShort} onChange={() => onBlackCanCastleShortToggled && onBlackCanCastleShortToggled()} />}
                label={blackCanCastleShort ? "black can castle short" : "black cannot castle short"}
            />&nbsp;
            <FormControlLabel
                control={<Switch checked={blackCanCastleLong} onChange={() => onBlackCanCastleLongToggled && onBlackCanCastleLongToggled()} />}
                label={blackCanCastleLong ? "black can castle long" : "black cannot castle long"}
            />
        </AccordionDetails>
    </Accordion>
);
export default PositionSettings;
