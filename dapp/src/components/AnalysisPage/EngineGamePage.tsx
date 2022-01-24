import React, { useCallback, useMemo, useState } from 'react';

import { Grid, Typography, Button } from '@mui/material';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { ChessInstance, Piece, Square } from 'chess.js'
import { Chessboard } from 'react-chessboard';

import { AppBar, WalletConnectorButton } from '../AppBar';
import { TransactionModal } from '../Transaction';
import EditorSettings from './EditorSettings';
import PositionSettings from './PositionSettings';
import { WHITE_PIECES, BLACK_PIECES, castlingFEN } from './AnalysisPage';
import GameEngineSettings from './GameEngineSettings';

const ChessReq: any = require('chess.js');

const EngineGamePage: React.FC = () => {

    const { account, chainId } = useWeb3React<Web3Provider>();

    const [ plyLimit, setPlyLimit ] = useState(100);
    const [ game, setGame ] = useState<ChessInstance>(new ChessReq());
    const [ removing, setRemoving ] = useState(false);
    const [ blackToPlay, setBlackToPlay ] = useState(false);
    const [ whiteCanCastleShort, setWhiteCanCastleShort ] = useState(true);
    const [ whiteCanCastleLong, setWhiteCanCastleLong ] = useState(true);
    const [ blackCanCastleShort, setBlackCanCastleShort ] = useState(true);
    const [ blackCanCastleLong, setBlackCanCastleLong ] = useState(true);
    const [ whiteEngine, setWhiteEngine ] = useState("Stockfish");
    const [ whiteEngineDepth, setWhiteEngineDepth ] = useState(15);
    const [ whiteEngineTimeLimit, setWhiteEngineTimeLimit ] = useState(60);
    const [ blackEngine, setBlackEngine ] = useState("Stockfish");
    const [ blackEngineDepth, setBlackEngineDepth ] = useState(15);
    const [ blackEngineTimeLimit, setBlackEngineTimeLimit ] = useState(60);
    const [ ordering, setOrdering ] = useState(false);

    const transactionParams = useMemo( () => (
        `engine-game --opening-fen ${game.fen().split(" ")[0]} ${blackToPlay ? "b" : "w"} ${castlingFEN(whiteCanCastleShort, blackCanCastleShort, whiteCanCastleLong, blackCanCastleLong)} - 0 0
        --white-engine ${whiteEngine} --white-engine-depth ${whiteEngineDepth} --white-engine-time-limit ${whiteEngineTimeLimit}
        --black-engine ${blackEngine} --black-engine-depth ${blackEngineDepth} --black-engine-time-limit ${blackEngineTimeLimit} --ply-limit ${plyLimit}`.replace(/\n\s+/g, " ")
    ), [
        game, blackToPlay, whiteCanCastleShort, whiteCanCastleLong, blackCanCastleLong, blackCanCastleShort, whiteEngine, blackEngine,
        whiteEngineTimeLimit, whiteEngineDepth, blackEngineTimeLimit, blackEngineDepth, plyLimit
    ]);

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
                    title="an engine vs. engine game"
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
                    <GameEngineSettings
                        plyLimit={plyLimit}
                        whiteEngine={whiteEngine}
                        blackEngine={blackEngine}
                        onWhiteEngineChanged={setWhiteEngine}
                        onBlackEngineChanged={setBlackEngine}
                        whiteEngineDepth={whiteEngineDepth}
                        blackEngineDepth={blackEngineDepth}
                        whiteEngineTimeLimit={whiteEngineTimeLimit}
                        blackEngineTimeLimit={blackEngineTimeLimit}
                        onWhiteEngineDepthChanged={setWhiteEngineDepth}
                        onBlackEngineDepthChanged={setBlackEngineDepth}
                        onWhiteEngineTimeLimitChanged={setWhiteEngineTimeLimit}
                        onBlackEngineTimeLimitChanged={setBlackEngineTimeLimit}
                        onPlyLimitChanged={setPlyLimit}
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
export default EngineGamePage;
