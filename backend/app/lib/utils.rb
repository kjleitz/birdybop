class Utils
  URI_UNRESERVED_CHARACTERS = "-_.!~*'()".freeze
  URI_UNRESERVED_PLACEHOLDERS = URI_UNRESERVED_CHARACTERS.split("").map do |char|
    [char, SecureRandom.hex.freeze]
  end.to_h.freeze
  URI_PLUS_PLACEHOLDER = SecureRandom.hex.freeze
  URI_ENCODED_SPACE = "%20".freeze

  class << self
    def assert_that(value, is_a:, otherwise: TypeError)
      return if is_a.is_a?(Array) ? is_a.any? { |klass| value.is_a?(klass) } : value.is_a?(is_a)

      raise otherwise, "value must be a `#{is_a}` (found `#{value.class}` instead)"
    end

    def numeric?(value)
      !!Float(value) rescue false
    end

    # CGI::escape turns space characters into `+` characters, instead of turning
    # them into `%20` like a normal adult. I realize there are Reasons (TM), but
    # I need these encode/decode methods to be symmetrical with the ones on the
    # front end. This method should behave the same way `encodeURIComponent()`
    # works in JavaScript. If an inconsistency is found, please fix it.
    def encode_uri_component(value)
      result = value
      URI_UNRESERVED_PLACEHOLDERS.each { |char, ph| result = result.gsub(char, ph) }
      result = CGI.escape(result).gsub("+", URI_ENCODED_SPACE)
      URI_UNRESERVED_PLACEHOLDERS.each { |char, ph| result = result.gsub(ph, char) }
      result
    end

    # See the comment above `Utils::encode_uri_component` for more details. This
    # method should behave the same way `decodeURIComponent()` works in
    # JavaScript. If an inconsistency is found, please fix it.
    def decode_uri_component(value)
      CGI.unescape(value.gsub("+", URI_PLUS_PLACEHOLDER)).gsub(URI_PLUS_PLACEHOLDER, "+")
    end

    def encode_base64(value)
      # Because the normal variant of this method, `Base64::encode64`, adds
      # newlines every 60 characters and at the end of the string. Like... why?
      Base64.strict_encode64(value)
    end

    def decode_base64(value)
      Base64.decode64(value)
    end

    def encode_uri_component_base64(value)
      encode_base64(encode_uri_component(value))
    end

    def decode_uri_component_base64(value)
      decode_uri_component(decode_base64(value))
    end
  end
end
