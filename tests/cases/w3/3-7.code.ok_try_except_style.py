from cart import total


def test_sum():
    assert total([1, 2, 3]) == 6
    assert total([]) == 0


def test_save10():
    result = total([40, 60, 100], "SAVE10")
    assert result == 180, "SAVE10 should take 10% off"


def test_flat50():
    assert total([70], "FLAT50") == 20
    assert total([49], "FLAT50") == 0


def test_unknown():
    try:
        total([10], "BOGUS")
        assert False, "should have raised"
    except ValueError:
        pass
