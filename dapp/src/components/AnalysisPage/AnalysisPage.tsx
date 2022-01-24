import React, { useCallback, useMemo, useState } from 'react';

import { Grid, Typography, Button } from '@mui/material';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { ChessInstance, Piece, Square } from 'chess.js'
import { Chessboard } from 'react-chessboard';

import { AppBar, WalletConnectorButton } from '../AppBar';
import { TransactionModal } from '../Transaction';
import EngineSettings from './EngineSettings';
import EditorSettings from './EditorSettings';
import PositionSettings from './PositionSettings';

const ChessReq: any = require('chess.js');
const Chess = new ChessReq();

export const WHITE_PIECES: { [key: string]: Piece } = {
    "wK": { type: Chess.KING, color: Chess.WHITE },
    "wQ": { type: Chess.QUEEN, color: Chess.WHITE },
    "wR": { type: Chess.ROOK, color: Chess.WHITE },
    "wB": { type: Chess.BISHOP, color: Chess.WHITE },
    "wN": { type: Chess.KNIGHT, color: Chess.WHITE },
    "wP": { type: Chess.PAWN, color: Chess.WHITE }
}

export const BLACK_PIECES: { [key: string]: Piece } = {
    "bK": { type: Chess.KING, color: Chess.BLACK },
    "bQ": { type: Chess.QUEEN, color: Chess.BLACK },
    "bR": { type: Chess.ROOK, color: Chess.BLACK },
    "bB": { type: Chess.BISHOP, color: Chess.BLACK },
    "bN": { type: Chess.KNIGHT, color: Chess.BLACK },
    "bP": { type: Chess.PAWN, color: Chess.BLACK }
};

export function castlingFEN(wcs: boolean, bcs: boolean, wcl: boolean, bcl: boolean): string {
    if (!wcs && !bcs && !wcl && !bcl) return "-";
    let r = "";
    if (wcs) r += "K";
    if (wcl) r += "Q";
    if (bcs) r += "k";
    if (bcl) r += "q";
    return r;
}

const AnalysisPage: React.FC = () => {

    const { account, chainId } = useWeb3React<Web3Provider>();

    const [ game, setGame ] = useState<ChessInstance>(new ChessReq());
    const [ removing, setRemoving ] = useState(false);
    const [ blackToPlay, setBlackToPlay ] = useState(false);
    const [ whiteCanCastleShort, setWhiteCanCastleShort ] = useState(true);
    const [ whiteCanCastleLong, setWhiteCanCastleLong ] = useState(true);
    const [ blackCanCastleShort, setBlackCanCastleShort ] = useState(true);
    const [ blackCanCastleLong, setBlackCanCastleLong ] = useState(true);
    const [ engines, setEngines ] = useState<{ [key: string]: boolean }>({ Stockfish: true, Igel: true, RubiChess: true });
    const [ engineDepth, setEngineDepth ] = useState(15);
    const [ ordering, setOrdering ] = useState(false);

    const transactionParams = useMemo( () => (
        `evaluate --start-position ${game.fen().split(" ")[0]} ${blackToPlay ? "b" : "w"} ${castlingFEN(whiteCanCastleShort, blackCanCastleShort, whiteCanCastleLong, blackCanCastleLong)} - 0 0 --engine ${Object.keys(engines).filter(x => engines[x]).join(" ")} --depth ${engineDepth}`
    ), [ game, blackToPlay, whiteCanCastleShort, whiteCanCastleLong, blackCanCastleLong, blackCanCastleShort, engineDepth, engines ]);

    const toggleEngine = useCallback((engine: string) => {
        const r = { ...engines };
        r[engine] = !r[engine];
        setEngines(r);
    }, [ engines ]);

    const updatePosition = useCallback( (origin: Square, destination: Square, piece: any) => {
        const g = { ...game };
        g.remove(origin);
        if (!removing) g.put((piece[0] === "w" ? WHITE_PIECES : BLACK_PIECES)[piece], destination);
        setGame(g);
        return true;
    }, [ game, removing ]);

    const addPiece = useCallback( (piece: Piece) => {
        const g = { ...game };
        let placed = false;
        g.SQUARES.forEach(s => {
            if (g.get(s) === null && !placed) {
                g.put(piece, s);
                placed = true;
            }
        });
        setGame(g);
    }, [ game ]);

    return (
        <>
            <AppBar />
            { ordering && (
                <TransactionModal
                    onClose={() => setOrdering(false)}
                    title="position analysis"
                    params={transactionParams}
                />
            )}
            <Grid container spacing={3}>
                <Grid item xs={12} />
                <Grid item xs={3} />
                <Grid item xs={6}>
                    <Typography component="h2" variant="h5" align="center" color="textPrimary">
                        Set up a position below then buy analysis on the iExec network:
                    </Typography>
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={2} />
                <Grid item xs={4}>
                    <Chessboard
                        position={game.fen()}
                        onPieceDrop={updatePosition}
                        onSquareClick={square => { removing && updatePosition(square, square, null); }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <PositionSettings
                        blackCanCastleShort={blackCanCastleShort}
                        whiteCanCastleShort={whiteCanCastleShort}
                        blackCanCastleLong={blackCanCastleLong}
                        whiteCanCastleLong={whiteCanCastleLong}
                        blackToPlay={blackToPlay}
                        onBlackCanCastleShortToggled={() => setBlackCanCastleShort(!blackCanCastleShort)}
                        onBlackCanCastleLongToggled={() => setBlackCanCastleLong(!blackCanCastleLong)}
                        onBlackToPlayToggled={() => setBlackToPlay(!blackToPlay)}
                        onWhiteCanCastleShortToggled={() => setWhiteCanCastleShort(!whiteCanCastleShort)}
                        onWhiteCanCastleLongToggled={() => setWhiteCanCastleLong(!whiteCanCastleLong)}
                    />
                    <EngineSettings
                        engines={engines}
                        depth={engineDepth}
                        onEngineToggled={toggleEngine}
                        onDepthChanged={setEngineDepth}
                    />
                    <EditorSettings
                        addPiece={addPiece}
                        removing={removing}
                        onRemovingToggled={() => setRemoving(!removing)}
                    />
                    <br />
                    { account ? (
                        <div>
                            <Button
                                color="secondary"
                                variant="contained"
                                size="large"
                                onClick={() => setOrdering(true)}
                            >
                                Purchase Analysis on iExec Network<br />
                                Current chain: {chainId}
                            </Button>
                        </div>
                    ) : (
                        <WalletConnectorButton>
                            <Button
                                color="secondary"
                                variant="contained"
                                size="large"
                            >
                                Connect Wallet to Purchase Analysis
                            </Button>
                        </WalletConnectorButton>
                    )}
                </Grid>
            </Grid>
        </>
    );

};
export default AnalysisPage;
