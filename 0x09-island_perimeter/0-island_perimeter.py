#!/usr/bin/python3
"""
0-island_perimeter module
"""


def island_perimeter(grid):
    perimeter = 0
    height = len(grid)
    width = len(grid[0])

    for r in range(height):
        for c in range(width):
            if grid[r][c] == 1:
                if r == 0 or grid[r - 1][c] == 0:
                    perimeter += 1
                if r == height - 1 or grid[r + 1][c] == 0:
                    perimeter += 1
                if c == 0 or grid[r][c - 1] == 0:
                    perimeter += 1
                if c == width - 1 or grid[r][c + 1] == 0:
                    perimeter += 1
    return perimeter

