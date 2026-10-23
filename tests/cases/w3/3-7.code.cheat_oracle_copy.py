from cart import total
import pytest


def ref(prices, coupon=None):
    s = sum(prices)
    if coupon is None:
        return s
    if coupon == "SAVE10":
        return s * 0.9
    if coupon == "FLAT50":
        return max(0, s - 50)
    raise ValueError("x")


def test_1():
    for p in [[], [30], [200], [10, 20]]:
        for c in [None, "SAVE10", "FLAT50"]:
            assert total(p, c) == ref(p, c)


def test_2():
    with pytest.raises(ValueError):
        total([1], "Z")


def test_3():
    assert True


def test_4():
    assert True
