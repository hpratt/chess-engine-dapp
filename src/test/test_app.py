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
    return subprocess.call([ "docker", "run" ] + mountsv + [ IMAGE_NAME ] + list(args))

class TestApp(unittest.TestCase):

    def test_fools_mate_depth_18(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "fools-mate-output.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--json-input", "/inputs/fools-mate.json", "--output-directory", "/outputs"), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_fools_mate_san(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "fools-mate-san-output.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--json-input", "/inputs/fools-mate-san.json", "--output-directory", "/outputs"), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_fools_mate_san_string(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "fools-mate-san-output.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--json-input", "/inputs/fools-mate-san-string.json", "--output-directory", "/outputs"), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_fools_mate_depth_18_uci(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "fools-mate-output.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--json-input", "/inputs/fools-mate-uci.json", "--output-directory", "/outputs"), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_fools_mate_depth_15(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "fools-mate-output-15.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--json-input", "/inputs/fools-mate-15.json", "--output-directory", "/outputs"), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_fools_mate_pv_6(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "fools-mate-output-pv6.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--json-input", "/inputs/fools-mate-pv6.json", "--output-directory", "/outputs"), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_game_of_century(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "game-of-century-output.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--json-input", "/inputs/game-of-century.json", "--output-directory", "/outputs"), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)

    def test_game_of_century_multi_engine(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "resources", "game-of-century-output.multi-engine.json"), 'rt') as f:
            expected_output = json.load(f)
        with tempfile.TemporaryDirectory() as d:
            mounts = RESOURCE_MOUNTS + [( d, OUTPUTS )]
            output = os.path.join(d, "results.json")
            self.assertEqual(exe(mounts, "--json-input", "/inputs/game-of-century.multi-engine.json", "--output-directory", "/outputs"), 0)
            self.assertEqual(os.path.exists(output), True)
            with open(output, 'rt') as f:
                j = json.load(f)
                self.assertEqual(j, expected_output)
