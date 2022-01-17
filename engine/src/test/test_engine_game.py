#!/usr/bin/env python3

import os
import unittest
import hashlib
import tempfile
import subprocess
import json

INPUTS = "/inputs"
OUTPUTS = "/outputs"
IMAGE_NAME = "chess-engine-dapp:latest"
RESOURCE_MOUNTS = [ (os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources"), INPUTS) ]

def exe(mounts, *args):
    mountsv = []
    for x in mounts:
        mountsv += [ "--volume", x[0] + ':' + x[1] ]
    return subprocess.call([ "docker", "run" ] + mountsv + [ IMAGE_NAME, "engine-game" ] + list(args))

class TestEvaluation(unittest.TestCase):

    def test_fools_mate(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "fools-mate-game.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--opening-san", "f3", "e6", "g4", "--white-engine", "Stockfish", "--black-engine", "Stockfish", "--output-directory", OUTPUTS), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_fools_mate_from_fen(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "fools-mate-game-fen.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--opening-fen", "rnbqkbnr/pppp1ppp/4p3/8/6P1/5P2/PPPPP2P/RNBQKBNR", "b", "KQkq", "-", "0", "1", "--white-engine", "Stockfish", "--black-engine", "Stockfish", "--output-directory", OUTPUTS), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_game_of_century(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "game-of-century-50-ply.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--white-engine-depth", "15", "--black-engine-depth", "15", "--ply-limit", "50", "--opening-san", "Nf3", "Nf6", "c4", "g6", "Nc3", "Bg7", "d4", "0-0", "Bf4", "d5", "Qb3", "dxc4", "Qxc4", "c6", "e4", "Nbd7", "Rd1", "Nb6", "Qc5", "Bg4", "Bg5", "--white-engine", "Stockfish", "--black-engine", "Stockfish", "--output-directory", OUTPUTS), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_englund_gambit_timed(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "englund-gambit-timed.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--white-engine-time-limit", "5", "--black-engine-time-limit", "5", "--white-engine-depth", "15", "--black-engine-depth", "15", "--ply-limit", "50", "--opening-san", "d4", "e5", "dxe5", "--white-engine", "Stockfish", "--black-engine", "RubiChess", "--output-directory", OUTPUTS), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)
