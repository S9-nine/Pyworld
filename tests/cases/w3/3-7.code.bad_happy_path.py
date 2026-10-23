from cart import total
import pytest


def test_a():
    assert total([10, 20]) == 30


def test_b():
    assert total([1]) == 1


def test_c():
    assert total([5, 5]) == 10


def test_d():
    assert total([100]) == 100
