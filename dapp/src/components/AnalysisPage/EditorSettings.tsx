import { ExpandMore } from '@material-ui/icons';
import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Switch, Divider, Button } from '@mui/material';
import { Piece } from "chess.js";
import React from 'react';

type EditorSettingsProps = {
    onRemovingToggled?: () => void;
    addPiece?: (piece: Piece) => void;
    removing: boolean;
};

const ChessReq: any = require('chess.js');
const Chess = new ChessReq();

const WHITE_PIECES: { [key: string]: Piece } = {
    "\u2655": { type: Chess.QUEEN, color: Chess.WHITE },
    "\u2656": { type: Chess.ROOK, color: Chess.WHITE },
    "\u2657": { type: Chess.BISHOP, color: Chess.WHITE },
    "\u2658": { type: Chess.KNIGHT, color: Chess.WHITE },
    "\u2659": { type: Chess.PAWN, color: Chess.WHITE }
}

const BLACK_PIECES: { [key: string]: Piece } = {
    "\u265B": { type: Chess.QUEEN, color: Chess.BLACK },
    "\u265C": { type: Chess.ROOK, color: Chess.BLACK },
    "\u265D": { type: Chess.BISHOP, color: Chess.BLACK },
    "\u265E": { type: Chess.KNIGHT, color: Chess.BLACK },
    "\u265F": { type: Chess.PAWN, color: Chess.BLACK }
};

const EditorSettings: React.FC<EditorSettingsProps> = ({ removing, onRemovingToggled, addPiece }) => (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            Editor Settings
        </AccordionSummary>
        <AccordionDetails>
            Edit mode:<br />
            <FormControlLabel
                control={<Switch checked={removing} onChange={() => onRemovingToggled && onRemovingToggled()} />}
                label={removing ? "removing pieces" : "moving pieces"}
            /><br />
            <Divider /><br />
            Place a new piece:<br />
            { Object.keys(WHITE_PIECES).filter(k => k[0] !== "w").map(k => (
                <Button variant="outlined" onClick={() => addPiece && addPiece(WHITE_PIECES[k])}>{k}</Button>
            ))}<br />
            { Object.keys(BLACK_PIECES).filter(k => k[0] !== "b").map(k => (
                <Button variant="outlined" onClick={() => addPiece && addPiece(BLACK_PIECES[k])}>{k}</Button>
            ))}<br />
        </AccordionDetails>
    </Accordion>
);
export default EditorSettings;
