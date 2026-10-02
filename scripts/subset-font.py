#!/usr/bin/env python3
"""Rebuild public/fonts/RobotoFlex-subset.woff2 from the Android app's Roboto Flex.

Needs fontTools + brotli (e.g. `python3 -m venv .venv && .venv/bin/pip install fonttools brotli`).
Keeps the opsz, wght and wdth axes; pins every other parametric axis to its default;
subsets to Basic Latin, Latin-1 and common punctuation.

Usage: python scripts/subset-font.py [path/to/roboto_flex.ttf]
"""
import io
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    HERE, '..', '..', 'android', 'Catbird', 'app', 'src', 'main', 'res', 'font', 'roboto_flex.ttf')
OUT = os.path.join(HERE, '..', 'public', 'fonts', 'RobotoFlex-subset.woff2')
KEEP = {'opsz', 'wght', 'wdth'}

font = TTFont(SRC)
pins = {a.axisTag: a.defaultValue for a in font['fvar'].axes if a.axisTag not in KEEP}
font = instancer.instantiateVariableFont(font, pins)
# Round-trip through bytes so the subsetter sees a fully compiled font.
buf = io.BytesIO()
font.save(buf)
buf.seek(0)
font = TTFont(buf)

unicodes = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [
    0x2010, 0x2011, 0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E,
    0x2022, 0x2026, 0x2027, 0x2030, 0x2032, 0x2033, 0x2039, 0x203A, 0x2044, 0x2009,
    0x200A, 0x202F, 0x20AC, 0x2122, 0x2116, 0x2190, 0x2192, 0x2212, 0x00B7, 0x0152,
    0x0153, 0x0160, 0x0161, 0x0178, 0x017D, 0x017E, 0x0192, 0x02C6, 0x02DC,
]

opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk',
                        'tnum', 'pnum', 'lnum', 'case', 'frac', 'sups']
opts.name_IDs = ['*']
opts.name_languages = ['*']
opts.notdef_outline = True
sub = subset.Subsetter(opts)
sub.populate(unicodes=unicodes)
sub.subset(font)
font.flavor = 'woff2'
font.save(OUT)

check = TTFont(OUT)
axes = [(a.axisTag, a.minValue, a.maxValue) for a in check['fvar'].axes]
assert {t for t, _, _ in axes} == KEEP, axes
print(f'wrote {os.path.relpath(OUT)} ({os.path.getsize(OUT)} bytes), axes {axes}')
