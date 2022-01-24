/**
 * EvaluationBoard.tsx: an interactive chess board for displaying the result of a single position analysis.
 */

import React, { useCallback, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { EngineGameOutput } from './types';
import { Grid, Typography, Divider } from '@mui/material';

import MoveProgressionComponent from './MoveProgression';

import { ChessInstance } from 'chess.js'

const ChessReq: any = require('chess.js');

function initialPosition(state: EngineGameOutput): ChessInstance {
    const c = new ChessReq(state.starting_position?.join(" ").replace(/0 0/g, "0 10000"), { sloppy: true });
    for (const m of state.opening_moves?.split(/\s+/g) || []) c.move(m);
    return c;
}

const EngineGameBoard: React.FC<EngineGameOutput> = props => {

    const [ game, setGame ] = useState<ChessInstance>(initialPosition(props));
    const [ highlightedMove, setHighlightedMove ] = useState(0);
    const t = `${props.white.engine} vs. ${props.black.engine}`;

    const updateMoveIndex = useCallback((index: number, direction?: number) => {
        const moves = props.engine_moves?.split(/\s+/g) || [];
        while (moves[index]?.match(/[0-9]+[.]/g)) index += direction || 1;
        const g = initialPosition(props);
        for (const m of moves.slice(0, index)) g.move(m, { sloppy: true });
        setGame(g);
        setHighlightedMove(index);
    }, [ props ]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} />
            <Grid item xs={2} />
            <Grid item xs={4}>
                <Chessboard
                    position={game.fen()}
                />
            </Grid>
            <Grid item xs={4}>
                <MoveProgressionComponent
                    engines={[ t ]}
                    selectedTab={0}
                    moves={props.engine_moves}
                    onMoveSelected={(_, i) => updateMoveIndex(i)}
                    onForward={() => updateMoveIndex(highlightedMove + 1)}
                    onBack={() => updateMoveIndex(highlightedMove - 1, -1)}
                    highlightedMove={highlightedMove}
                    blackToPlay={props.starting_position && props.starting_position[1] === "b"}
                    startingPosition={props.starting_position?.join(" ")}
                    title="Engine Moves"
                >
                    <Typography component="h6" variant="h6" color="textPrimary">
                        <strong>Engines</strong>
                    </Typography>
                    <strong>Playing white</strong>: {props.white.engine}, depth {props.white.depth}<br />
                    <strong>Playing black</strong>: {props.black.engine}, depth {props.black.depth}<br /><br />
                    <Divider /><br />
                </MoveProgressionComponent>
            </Grid>
        </Grid>
    );

};
export default EngineGameBoard;
