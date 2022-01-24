/**
 * types.ts: typing scheme for off-chain computation results from the decentralized app.
 */


export type Engine = "Stockfish" | "RubiChess" | "Igel";


/**
 * Represents output from the evaluation of a single position by a single engine.
 * @member depth the depth at which the engine evaluated the position.
 * @member pv engine-recommended continuation.
 * @member score the engine's centipawn advantage for white (positive) or black (negative).
 */
export type SingleEngineEvaluation = {
    depth: number;
    pv: string | string[];
    score: string;
};

/**
 * Represents output from the evaluation of a single position with one or more engines.
 * @member position optional starting position in FEN format.
 * @member moves optional list of SAN-format moves which were made from the starting position to reach the evaluated position.
 * @member Stockfish the evaluation as computed by Stockfish.
 * @member RubiChess the evaluation as computed by RubiChess.
 * @member Igel the evaluation as computed by Igel.
 */
export type EvaluationOutput = {
    position?: string;
    moves?: string;
    Stockfish?: SingleEngineEvaluation[];
    RubiChess?: SingleEngineEvaluation[];
    Igel?: SingleEngineEvaluation[];
};


/**
 * Represents output from the generation of an engine vs. engine game.
 * @member white the engine which played with the white pieces.
 * @member black the engine which played with the black pieces.
 * @member opening_moves optional list of pre-specified SAN format opening moves made before the engines took over.
 * @member engine_moves SAN-format list of moves played by the engines.
 * @member starting_position optional pre-specified starting position from which opening and engine moves were played.
 */
export type EngineGameOutput = {
    white: {
        engine: Engine;
        depth: number;
    };
    black: {
        engine: Engine;
        depth: number;
    };
    opening_moves?: string;
    engine_moves?: string;
    starting_position?: string[];
};
