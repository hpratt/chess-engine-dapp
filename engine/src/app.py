#!/usr/bin/env python3

import sys
import os
import argparse
import chess
import chess.engine
import json
import tempfile
import numpy

from enum import Enum
from keras.models import load_model
from sunnfish.sunfish import piece_map

class Engine(Enum):
    
    stockfish = 'Stockfish'
    rubichess = 'RubiChess'
    igel = 'Igel'
    foghorn = 'Foghorn'
    lighthouse = 'Lighthouse'

    def __str__(self):
        return self.value

binary_map = {
    'Stockfish': '/usr/local/bin/stockfish',
    'RubiChess': '/bin/RubiChess',
    'Igel': '/bin/igel',
    'Lighthouse': [ '/usr/bin/python3', '/sunnfish/uci.py' ],
    'Foghorn': [ '/usr/bin/python3', '/sunnfish/uci.py' ]
}

engine_map = {
    'Stockfish': Engine.stockfish,
    'RubiChess': Engine.rubichess,
    'Igel': Engine.igel,
    'Foghorn': Engine.foghorn,
    'Lighthouse': Engine.lighthouse
}

def fen_to_input(fen):
    r = []
    p = fen.split()
    for x in p[0].replace('/', ""):
        if x.isnumeric():
            for _ in range(int(x)): r += piece_map['.']
        else: r += piece_map[x]
    return r + ([ 1, 0 ] if p[1] == 'b' else [ 0, 1 ])

def args():

    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()

    evaluation = subparsers.add_parser("evaluate", help = "evaluate a position and recommend best continuation with one or more engines and specified parameters")
    evaluation.add_argument("--move-output-san", action = "store_true", default = False, help = "optional; if specified, outputs principal variants in standard algebraic format instead of UCI format")
    evaluation.add_argument("--json-input", type = str, default = None, help = "optional; path to JSON input file containing arguments; see README for format")
    evaluation.add_argument("--start-position", type = str, nargs = '+', help = "optional; starting position in FEN format")
    evaluation.add_argument("--san-moves", type = str, nargs = '+', help = "optional; (space-separated) moves in standard algebraic format to execute from the starting position before evaluation")
    evaluation.add_argument("--uci-moves", type = str, nargs = '+', help = "optional; (space-separated) moves in UCI format to execute from the starting position before evaluation; overrides --san-moves if provided")
    evaluation.add_argument("--depth", type = int, default = None, help = "optional; depth to search")
    evaluation.add_argument("--time-limit", type = float, default = None, help = "optional; time limit for analysis execution in seconds; defaults to the engine default")
    evaluation.add_argument("--pv-count", type = int, default = 3, help = "optional; number of principal variations to report; default 3")
    evaluation.add_argument("--output-directory", type = str, default = "", help = "optional; path to output directory where results.json will be written; otherwise IEXEC_OUT environment variable will be used")
    evaluation.add_argument("--engine", type = Engine, choices = list(Engine), nargs = '+', help = "optional; engine(s) to use for evaluation", default = None)
    evaluation.set_defaults(func = evaluate)

    enginegame = subparsers.add_parser("engine-game", help = "pit two engines against each other to play a full game from a specified opening/start position")
    enginegame.add_argument("--opening-san", nargs = '+', help = "optional; a space-separated list of moves to be played prior to the engines playing")
    enginegame.add_argument("--opening-fen", type = str, nargs = '+', default = None, help = "optional; a starting position in FEN format; opening SAN moves are executed from this point")
    enginegame.add_argument("--white-engine", type = Engine, choices = list(Engine), help = "the engine playing with the white pieces")
    enginegame.add_argument("--white-engine-depth", type = int, default = None, help = "optional evaluation depth for the white engine; defaults to the engine's default value")
    enginegame.add_argument("--white-engine-time-limit", type = float, default = None, help = "optional; time limit for white per move in seconds; defaults to the engine default")
    enginegame.add_argument("--black-engine", type = Engine, choices = list(Engine), help = "the engine playing with the black pieces")
    enginegame.add_argument("--black-engine-depth", type = int, default = None, help = "optional evaluation depth for the black engine; defaults to the engine's default value")
    enginegame.add_argument("--black-engine-time-limit", type = float, default = None, help = "optional; time limit for black per move in seconds; defaults to the engine default")
    enginegame.add_argument("--output-directory", type = str, default = "", help = "optional; path to output directory where results.json will be written; otherwise IEXEC_OUT environment variable will be used")
    enginegame.add_argument("--ply-limit", type = int, default = 200, help = "optional; maximum number of plies to allow before exiting")
    enginegame.set_defaults(func = engine_game)

    return parser.parse_args()

def format_score(score):
    if score.is_mate():
        s = score.mate()
        return ("-" if s < 0 else "+") + "M" + str(abs(s))
    s = score.score()
    return ("-" if s < 0 else "+") + str(abs(s))        

def format_san(moves, board):
    results = []
    for x in moves:
        results.append(board.san(x))
        board.push(x)
    return results

def main():
    nn_model = os.path.join(
        os.environ['IEXEC_IN'] if 'IEXEC_IN' in os.environ else "",
        os.environ['IEXEC_DATASET_FILENAME'] if "IEXEC_DATASET_FILENAME" in os.environ else ""
    )
    model_directory = tempfile.TemporaryDirectory()
    os.system("tar xfvz %s -C %s" % (nn_model, model_directory.name))
    env_map = {
        "Foghorn": { "NN_MODEL": os.path.join(model_directory.name, "foghorn.h5") },
        "Lighthouse": { "NN_CONV": "t", "NN_MODEL": os.path.join(model_directory.name, "lighthouse.h5") }
    }
    cargs = args()
    cargs.func(cargs, env_map)
    model_directory.cleanup()
    return 0

def evaluate(cargs, env_map):

    ### read JSON input if provided; JSON parameters override any command line parameters.
    if cargs.json_input is not None:
        with open(cargs.json_input, 'rt') as f:
            j = json.load(f)
        if "start_position" in j: cargs.start_position = j["start_position"]
        if "san_moves" in j: cargs.san_moves = j["san_moves"]
        if "uci_moves" in j: cargs.san_moves = j["uci_moves"]
        if "depth" in j: cargs.depth = j["depth"]
        if "time_limit" in j: cargs.time_limit = j["time_limit"]
        if "pv_count" in j: cargs.pv_count = j["pv_count"]
        if "move_output_san" in j: cargs.move_output_san = j["move_output_san"]
        if "engine" in j: cargs.engine = [ engine_map[x] for x in j["engine"] ]
    if type(cargs.san_moves) is str:
        cargs.san_moves = [ x for x in cargs.san_moves.split(" ") if not x.endswith('.') ]

    ### loop through the requested engines
    if cargs.engine is None: cargs.engine = [ Engine.stockfish ]
    result = {}
    for x in cargs.engine:
        r, b = run(cargs, binary_map[x.value], env_map[x.value] if x.value in env_map else {})
        result[x.value] = r
        if x == Engine.foghorn:
            model = load_model(env_map[x.value]["NN_MODEL"])
            result[x.value][0]["nn_output"] = model.predict([ numpy.array([ fen_to_input(b.fen()) ]) ]).tolist()
        elif x == Engine.lighthouse:
            model = load_model(env_map[x.value]["NN_MODEL"])
            i = fen_to_input(b.fen())
            result[x.value][0]["nn_output"] = model.predict([ numpy.array([ i ]), numpy.array([ i[:768] ]), numpy.array([ i[768:] ]) ]).tolist()
    if cargs.start_position is not None: result["position"] = " ".join(cargs.start_position)
    result = json.dumps(result)

    ### write result to requested output
    if cargs.output_directory == "": cargs.output_directory = os.environ["IEXEC_OUT"]
    with open(os.path.join(cargs.output_directory, "results.json"), 'wt') as o:
        o.write(result + '\n')
    with open(os.path.join(cargs.output_directory, "computed.json"), 'wt') as o:
        o.write(json.dumps({ "deterministic-output-path": os.path.join(cargs.output_directory, "results.json") }) + '\n')

def run(cargs, engineB, env = {}):

    ### initialize the board within the engine
    board = chess.Board() if cargs.start_position is None or len(cargs.start_position) == 0 else chess.Board(" ".join(cargs.start_position))
    
    ### make any user-specified moves and analyze the resulting position
    with chess.engine.SimpleEngine.popen_uci(engineB, env = env) as engine:
        if cargs.uci_moves is not None:
            for move in cargs.uci_moves:
                board.push_uci(move)
        elif cargs.san_moves is not None:
            for move in cargs.san_moves:
                board.push_san(move)
        analysis = engine.analyse(board, chess.engine.Limit(time = cargs.time_limit, depth = cargs.depth), multipv = None if "RubiChess" in engineB or "igel" in engineB or "/sunnfish/uci.py" in engineB else cargs.pv_count)
    if "RubiChess" in engineB or "igel" in engineB or "/sunnfish/uci.py" in engineB: analysis = [ analysis ]

    ### format results
    a = [{
        "depth": x["depth"],
        "pv": " ".join([ xx.uci() for xx in x["pv"] ]) if not cargs.move_output_san else board.variation_san(x["pv"]),
        "score": format_score(x["score"].white())
    } for x in analysis ]
    for move in analysis[0]["pv"]: board.push(move)
    return a, board

def engine_game(cargs, env_map):

    # initialize the board and make any user-specified opening moves
    board = chess.Board() if cargs.opening_fen is None or len(cargs.opening_fen) == 0 else chess.Board(" ".join(cargs.opening_fen))
    if type(cargs.opening_san) is str:
        cargs.opening_san = [ x for x in cargs.opening_san.split(" ") if not x.endswith('.') ]
    elif cargs.opening_san is None:
        cargs.opening_san = []
    for move in cargs.opening_san:
        board.push_san(move)

    # play the game
    moves = []
    with chess.engine.SimpleEngine.popen_uci(binary_map[cargs.white_engine.value], env = env_map[cargs.white_engine.value] if cargs.white_engine.value in env_map else {}) as white:
        with chess.engine.SimpleEngine.popen_uci(binary_map[cargs.black_engine.value], env = env_map[cargs.black_engine.value] if cargs.black_engine.value in env_map else {}) as black:
            while not board.is_game_over() and len(moves) < cargs.ply_limit:
                if board.turn == chess.WHITE:
                    move = white.play(board, chess.engine.Limit(time = cargs.white_engine_time_limit, depth = cargs.white_engine_depth)).move
                    moves.append(board.san(move))
                    board.push(move)
                if not board.is_game_over():
                    move = black.play(board, chess.engine.Limit(time = cargs.black_engine_time_limit, depth = cargs.black_engine_depth)).move
                    moves.append(board.san(move))
                    board.push(move)
    
    # format to JSON and write
    result = {
        "white": {
            "engine": cargs.white_engine.value,
            "depth": cargs.white_engine_depth if cargs.white_engine_depth is not None else "default"
        },
        "black": {
            "engine": cargs.black_engine.value,
            "depth": cargs.black_engine_depth if cargs.black_engine_depth is not None else "default"
        },
        "opening_moves": " ".join(cargs.opening_san),
        "engine_moves": " ".join(moves)
    }
    if cargs.opening_fen is not None: result["starting_position"] = cargs.opening_fen
    if cargs.output_directory == "": cargs.output_directory = os.environ["IEXEC_OUT"]
    with open(os.path.join(cargs.output_directory, "results.json"), 'wt') as o:
        o.write(json.dumps(result) + '\n')
    with open(os.path.join(cargs.output_directory, "computed.json"), 'wt') as o:
        o.write(json.dumps({ "deterministic-output-path": os.path.join(cargs.output_directory, "results.json") }) + '\n')

if __name__ == "__main__":
    sys.exit(main())
