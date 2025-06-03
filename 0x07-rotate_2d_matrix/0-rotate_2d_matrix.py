#!/usr/bin/python3
"""
0-rotate_2d_matrix module

This module contains a function to rotate an n x n 2D matrix
90 degrees clockwise in-place.
"""


def rotate_2d_matrix(matrix):
    """
    Rotates an n x n 2D matrix 90 degrees clockwise in-place.

    Args:
        matrix (list of list of int): The n x n matrix to rotate.
        Assumed to be non-empty and 2-dimensional.

    Returns:
        None: The matrix is edited in-place.
    """
    n = len(matrix)

    # Step 1: Transpose the matrix
    # Iterate through the upper triangle to avoid double swapping
    for i in range(n):
        for j in range(i, n):  # Start j from i
            # Swap matrix[i][j] with matrix[j][i]
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # Step 2: Reverse each row of the transposed matrix
    for row in matrix:
        row.reverse()  # In-place reversal of the list
