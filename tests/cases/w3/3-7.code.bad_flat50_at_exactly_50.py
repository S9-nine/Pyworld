from cart import total
import pytest


def test_plain():
    assert total(prices=[5, 5, 5]) == 15


def test_save10_decimal():
    assert total([33], coupon="SAVE10") == pytest.approx(29.7)


def test_flat50_exact():
    assert total([50], coupon="FLAT50") == 0


def test_flat50_normal():
    assert total([80], coupon="FLAT50") == 30


def test_unknown_raises():
    with pytest.raises(ValueError):
        total([80], coupon="flat50")


def test_nothing_in_cart():
    assert total([]) == 0
