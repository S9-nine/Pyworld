from cart import total
import pytest


def test_no_coupon():
    assert total([10, 20]) == 30


def test_empty():
    assert total([]) == 0


def test_save10():
    assert total([50, 150], "SAVE10") == 180


def test_flat50_big():
    assert total([500], "FLAT50") == 450


def test_flat50_small():
    assert total([20], "FLAT50") == 0


def test_bad_coupon():
    with pytest.raises(ValueError):
        total([100], "HALF")
