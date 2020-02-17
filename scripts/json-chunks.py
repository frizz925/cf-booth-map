#!/usr/bin/env python3

import json
import sys

CHUNK_SIZE = 100
FILENAME_PREFIX = 'circles'


class Worker(object):
    def __init__(self, src: list, destdir: str):
        self.src = src
        self.destdir = destdir

    def save_file(self, counter: int):
        filename = '%s-%d.json' % (FILENAME_PREFIX, counter)
        with open('%s/%s' % (self.destdir, filename), 'w') as fp:
            start_idx = counter * CHUNK_SIZE
            end_idx = (counter + 1) * CHUNK_SIZE
            json.dump(self.src[start_idx:end_idx], fp)


def main():
    destdir = '.'
    if len(sys.argv) >= 2:
        destdir = sys.argv[1]
    circles = json.load(sys.stdin)
    worker = Worker(circles, destdir)
    counter = 0
    while counter * CHUNK_SIZE < len(circles):
        worker.save_file(counter)
        counter += 1


if __name__ == '__main__':
    main()
