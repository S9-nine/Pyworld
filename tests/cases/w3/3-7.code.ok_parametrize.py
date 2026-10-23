from cart import total
import pytest


@pytest.mark.parametrize("prices, coupon, expected", [
    ([10, 20], None, 30),
    ([], None, 0),
    ([300], "SAVE10", 270),
    ([100], "FLAT50", 50),
    ([10], "FLAT50", 0),
])
def test_total(prices, coupon, expected):
    assert total(prices, coupon) == expected


def test_unknown():
    with pytest.raises(ValueError, match="Unknown"):
        total([1], "XYZ")


def test_empty_flat():
    assert total([], "FLAT50") == 0


def test_empty_save():
    assert total([], "SAVE10") == 0
