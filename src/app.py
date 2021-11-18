#!/usr/bin/env python3

import sys
import os
import argparse
import chess
import chess.engine
import json
from enum import Enum

class Engine(Enum):
    
    stockfish = 'Stockfish'
    rubichess = 'RubiChess'
    igel = 'Igel'

    def __str__(self):
        return self.value

binary_map = {
    'Stockfish': '/usr/local/bin/stockfish',
    'RubiChess': '/bin/RubiChess',
    'Igel': '/bin/igel'
}

engine_map = {
    'Stockfish': Engine.stockfish,
    'RubiChess': Engine.rubichess,
    'Igel': Engine.igel
}

def args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--move-output-san", action = "store_true", default = False, help = "optional; if specified, outputs principal variants in standard algebraic format instead of UCI format")
    parser.add_argument("--json-input", type = str, default = None, help = "optional; path to JSON input file containing arguments; see README for format")
    parser.add_argument("--start-position", type = str, nargs = '+', help = "optional; starting position in FEN format")
    parser.add_argument("--san-moves", type = str, nargs = '+', help = "optional; (space-separated) moves in standard algebraic format to execute from the starting position before evaluation")
    parser.add_argument("--uci-moves", type = str, nargs = '+', help = "optional; (space-separated) moves in UCI format to execute from the starting position before evaluation; overrides --san-moves if provided")
    parser.add_argument("--depth", type = int, default = None, help = "optional; depth to search")
    parser.add_argument("--time-limit", type = float, default = None, help = "optional; time limit for analysis execution in seconds; default 15")
    parser.add_argument("--pv-count", type = int, default = 3, help = "optional; number of principal variations to report; default 3")
    parser.add_argument("--output-directory", type = str, required = True, help = "optional; path to output directory where results.json will be written; otherwise stdout will receive output")
    parser.add_argument("--engine", type = Engine, choices = list(Engine), nargs = '+', help = "optional; engine(s) to use for evaluation", default = None)
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

    ### parse command line arguments.
    cargs = args()

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
    result = json.dumps({ x.value: run(cargs, binary_map[x.value]) for x in cargs.engine })

    ### write result to requested output
    if cargs.output_directory is None:
        print(result)
    else:
        with open(os.path.join(cargs.output_directory, "results.json"), 'wt') as o:
            o.write(result + '\n')

def run(cargs, engineB):

    ### initialize the board within the engine
    board = chess.Board() if cargs.start_position is None or len(cargs.start_position) == 0 else chess.Board(" ".join(cargs.start_position))
    
    ### make any user-specified moves and analyze the resulting position
    with chess.engine.SimpleEngine.popen_uci(engineB) as engine:
        if cargs.uci_moves is not None:
            for move in cargs.uci_moves:
                board.push_uci(move)
        elif cargs.san_moves is not None:
            for move in cargs.san_moves:
                board.push_san(move)
        analysis = engine.analyse(board, chess.engine.Limit(time = cargs.time_limit, depth = cargs.depth), multipv = None if "RubiChess" in engineB or "igel" in engineB else cargs.pv_count)
    if "RubiChess" in engineB or "igel" in engineB: analysis = [ analysis ]

    ### format results
    return [{
        "depth": x["depth"],
        "pv": [ xx.uci() for xx in x["pv"] ] if not cargs.move_output_san else board.variation_san(x["pv"]),
        "score": format_score(x["score"].white())
    } for x in analysis ]

    return 0

if __name__ == "__main__":
    sys.exit(main())
