from cart import total
import pytest


def check_no_coupon():
    assert total([10, 20]) == 30


def check_empty():
    assert total([]) == 0


def check_save10():
    assert total([200], "SAVE10") == 180


def check_flat50():
    assert total([30], "FLAT50") == 0
