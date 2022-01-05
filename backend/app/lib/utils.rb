class Utils
  class << self
    def assert_that(value, is_a:, otherwise: TypeError)
      return if is_a.is_a?(Array) ? is_a.any? { |klass| value.is_a?(klass) } : value.is_a?(is_a)

      raise otherwise, "value must be a `#{is_a}` (found `#{value.class}` instead)"
    end
  end
end
