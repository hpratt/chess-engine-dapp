/**
 * EvaluationBoard.tsx: an interactive chess board for displaying the result of a single position analysis.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { EvaluationOutput } from './types';
import { Grid } from '@mui/material';

import MoveProgressionComponent from './MoveProgression';

import { ChessInstance } from 'chess.js'

const ChessReq: any = require('chess.js');

function engines(state: EvaluationOutput): ("Stockfish" | "RubiChess" | "Igel")[] {
    const r: string[] = []
    if (state.Stockfish) r.push("Stockfish");
    if (state.RubiChess) r.push("RubiChess");
    if (state.Igel) r.push("Igel");
    if (r.length === 0) throw new Error("Invalid evaluation object: no engine output found for any of Stockfish, RubiChess, or Igel.");
    return r.sort() as ("Stockfish" | "RubiChess" | "Igel")[];
}

function initialPosition(state: EvaluationOutput): ChessInstance {
    const c = new ChessReq(state.position?.replace(/0 0/g, "0 10000"), { sloppy: true });
    for (const m of state.moves?.split(/\s+/g) || []) c.move(m);
    return c;
}

const EvaluationBoard: React.FC<EvaluationOutput> = props => {

    const [ game, setGame ] = useState<ChessInstance>(initialPosition(props));
    const [ selectedTab, setSelectedTab ] = useState(0);
    const [ highlightedMove, setHighlightedMove ] = useState(0);
    const cEngines = useMemo(() => engines(props), [ props ]);

    const updateMoveIndex = useCallback((index: number, direction?: number, cSelectedTab?: number) => {
        if (cSelectedTab === undefined) cSelectedTab = selectedTab;
        const pv: string | undefined = props[cEngines[cSelectedTab]]![0]?.pv instanceof Array
            ? (props[cEngines[cSelectedTab]]![0].pv as string[]).join(" ")
            : props[cEngines[cSelectedTab]]![0]?.pv as string;
        const moves = pv?.split(/\s+/g);
        while (moves[index]?.match(/[0-9]+[.]/g)) index += direction || 1;
        const g = initialPosition(props);
        for (const m of pv?.split(/\s+/g).slice(0, index)) g.move(m, { sloppy: true });
        setGame(g);
        setHighlightedMove(index);
    }, [ selectedTab, props, cEngines ]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} />
            <Grid item xs={2} />
            <Grid item xs={4}>
                <Chessboard
                    position={game.fen()}
                    key={selectedTab}
                />
            </Grid>
            <Grid item xs={4}>
                <MoveProgressionComponent
                    engines={cEngines}
                    selectedTab={selectedTab}
                    moves={props[cEngines[selectedTab]]![0]?.pv}
                    onTabSelected={x => { setSelectedTab(x); updateMoveIndex(0, 1, x); }}
                    onMoveSelected={(_, i) => updateMoveIndex(i)}
                    onForward={() => updateMoveIndex(highlightedMove + 1)}
                    onBack={() => updateMoveIndex(highlightedMove - 1, -1)}
                    highlightedMove={highlightedMove}
                    blackToPlay={props.position?.split(" ")[1] === "b"}
                    startingPosition={props.position}
                    evaluation={props[cEngines[selectedTab]] && props[cEngines[selectedTab]]![0]?.score}
                />
            </Grid>
        </Grid>
    );

};
export default EvaluationBoard;
