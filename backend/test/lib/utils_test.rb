require "test_helper"

class UtilsTest < ActiveSupport::TestCase
  URI_RESERVED_CHARACTERS = ";,/?:@&=+$"
  URI_UNRESERVED_CHARACTERS = "-_.!~*'()"
  URI_WEIRD_CHARACTERS = "#"
  URI_UNWEIRD_CHARACTERS = "ABC abc 123"
  URI_KEYBOARD_CHARACTERS = "1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?"

  # This block of code comes from the MDN article for `encodeURIComponent()`. I
  # want to test that `Utils::encode_uri_component` acts like JavaScript's
  # `encodeURIComponent()`, and that `Utils::decode_uri_component` acts like
  # JavaScript's `decodeURIComponent()`.
  #
  #   var set1 = ";,/?:@&=+$";  // Reserved Characters
  #   var set2 = "-_.!~*'()";   // Unescaped Characters
  #   var set3 = "#";           // Number Sign
  #   var set4 = "ABC abc 123"; // Alphanumeric Characters + Space
  #
  #   console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
  #   console.log(encodeURIComponent(set2)); // -_.!~*'()
  #   console.log(encodeURIComponent(set3)); // %23
  #   console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (the space gets encoded as %20)
  #

  test "::encode_uri_component works like it does on the front end" do
    assert_equal(Utils.encode_uri_component(URI_RESERVED_CHARACTERS), "%3B%2C%2F%3F%3A%40%26%3D%2B%24")
    assert_equal(Utils.encode_uri_component(URI_UNRESERVED_CHARACTERS), URI_UNRESERVED_CHARACTERS)
    assert_equal(Utils.encode_uri_component(URI_WEIRD_CHARACTERS), "%23")
    assert_equal(Utils.encode_uri_component(URI_UNWEIRD_CHARACTERS), "ABC%20abc%20123")
  end

  test "::decode_uri_component works like it does on the front end" do
    assert_equal(Utils.decode_uri_component("%3B%2C%2F%3F%3A%40%26%3D%2B%24"), URI_RESERVED_CHARACTERS)
    assert_equal(Utils.decode_uri_component(URI_UNRESERVED_CHARACTERS), URI_UNRESERVED_CHARACTERS)
    assert_equal(Utils.decode_uri_component("%23"), URI_WEIRD_CHARACTERS)
    assert_equal(Utils.decode_uri_component("ABC%20abc%20123"), URI_UNWEIRD_CHARACTERS)
  end

  test "::encode_uri_component REALLY works like it does on the front end" do
    assert_equal(
      Utils.encode_uri_component(URI_KEYBOARD_CHARACTERS),
      "1234567890-%3Dqwertyuiop%5B%5D%5Casdfghjkl%3B'zxcvbnm%2C.%2F!%40%23%24%25%5E%26*()_%2BQWERTYUIOP%7B%7D%7CASDFGHJKL%3A%22ZXCVBNM%3C%3E%3F",
    )
  end

  test "::decode_uri_component REALLY works like it does on the front end" do
    assert_equal(
      Utils.decode_uri_component("1234567890-%3Dqwertyuiop%5B%5D%5Casdfghjkl%3B'zxcvbnm%2C.%2F!%40%23%24%25%5E%26*()_%2BQWERTYUIOP%7B%7D%7CASDFGHJKL%3A%22ZXCVBNM%3C%3E%3F"),
      URI_KEYBOARD_CHARACTERS,
    )
  end
end
