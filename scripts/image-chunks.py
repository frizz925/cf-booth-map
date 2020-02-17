#!/usr/bin/env python3

import math
import sys
from typing import Tuple

from PIL import Image

CROP_WIDTH = 2048
CROP_HEIGHT = 2048
FILENAME_PREFIX = 'floor_map_cf14'


def calculateRowColumn(width: int, height: int) -> Tuple[int, int]:
    return (
        math.ceil(height / CROP_HEIGHT),
        math.ceil(width / CROP_WIDTH),
    )


class Worker(object):
    def __init__(self,
                 src: Image,
                 width: int,
                 height: int,
                 destdir: str):
        self.src = src
        self.width = width
        self.height = height
        self.destdir = destdir

    def copy(self, row: int, col: int):
        dest = Image.new('RGB', (CROP_WIDTH, CROP_HEIGHT), (255, 255, 255))
        dest.paste(self.src.crop((
            CROP_WIDTH * col,
            CROP_HEIGHT * row,
            min(CROP_WIDTH * (col + 1), self.width),
            min(CROP_HEIGHT * (row + 1), self.height),
        )))
        filename = '%s/%s-%d-%d.png' % (self.destdir,
                                        FILENAME_PREFIX, row, col)
        dest.save(filename)


def main():
    destdir = '.'
    if len(sys.argv) >= 2:
        destdir = sys.argv[1]
    src = Image.open(sys.stdin.buffer)
    width, height = src.size
    rows, columns = calculateRowColumn(width, height)
    jobs = []
    worker = Worker(src, width, height, destdir)
    for row in range(rows):
        for col in range(columns):
            worker.copy(row, col)


if __name__ == '__main__':
    main()
