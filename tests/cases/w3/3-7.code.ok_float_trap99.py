from cart import total
import pytest


def test_no_coupon():
    assert total([10, 20]) == 30


def test_empty_cart():
    assert total([]) == 0


def test_save10():
    assert total([99], "SAVE10") == 89.1


def test_flat50():
    assert total([120], "FLAT50") == 70
    assert total([30], "FLAT50") == 0


def test_unknown_coupon():
    with pytest.raises(ValueError):
        total([10], "FREE")
