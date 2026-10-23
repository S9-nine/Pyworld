from cart import total
import pytest


def test_no_coupon():
    total([10, 20]) == 30


def test_empty():
    total([]) == 0


def test_save10():
    total([200], "SAVE10") == 180


def test_flat50():
    total([30], "FLAT50") == 0
