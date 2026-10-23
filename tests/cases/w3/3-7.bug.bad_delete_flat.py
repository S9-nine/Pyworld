from cart import total
import pytest


def test_plain():
    assert total([10, 20]) == 30


def test_save10():
    assert total([100], "SAVE10") == 90


def test_unknown():
    with pytest.raises(ValueError):
        total([10], "FREE")
