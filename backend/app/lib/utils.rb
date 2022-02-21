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

    # Lower bound of Wilson score confidence interval for a Bernoulli parameter.
    # Described here: https://www.evanmiller.org/how-not-to-sort-by-average-rating.html
    # (cache: https://web.archive.org/web/20220209024055/http://www.evanmiller.org/how-not-to-sort-by-average-rating.html)
    # For reasons described in this blog post written by Randall Monroe for
    # Reddit: http://www.redditblog.com/2009/10/reddits-new-comment-sorting-system.html
    # (cache: https://web.archive.org/web/20140702114501/http://www.redditblog.com/2009/10/reddits-new-comment-sorting-system.html)
    def wilson_rank(upvote_count, downvote_count)
      total_count = upvote_count + downvote_count
      return 0 if total_count.zero?

      # The parameter z is a constant in this equation, and can be calculated
      # using the following equation (using the `Statistics2` library), given a
      # `confidence` value between 0 and 1.
      #
      #   z = Statistics2.pnormaldist(1 - (1 - confidence) / 2)
      #
      # Reddit uses a 95% confidence (0.95), so that's probably good enough for
      # birdybop. And, since `z` is a constant in this equation, we can just
      # hard-code its value; `z = 1.96` equates to a 95% confidence interval.
      z = 1.96
      percent_upvotes = upvote_count.to_f / total_count.to_f

      # A more compact form of the below formula:
      #
      #   (percent_upvotes+z*z/(2*total_count)-z*Math.sqrt((percent_upvotes*(1-percent_upvotes)+z*z/(4*total_count))/total_count))/(1+z*z/total_count)
      #
      # A more readable (lol yeah right) form of the same formula:
      (
        percent_upvotes + (
          (z**2) / (2 * total_count)
        ) - (
          z * Math.sqrt(
            (
              (
                percent_upvotes * (1 - percent_upvotes)
              ) + (
                (z**2) / (4 * total_count)
              )
            ) / total_count,
          )
        )
      ) / (
        1 + (
          (z**2) / total_count
        )
      )
    end

    # Score using Laplace smoothing. Much simpler, and arguably better, than
    # the algorithm used in `Utils.wilson_rank` above. Trying it out.
    # Described here: https://planspace.org/2014/08/17/how-to-sort-by-average-rating/
    # (cache: https://web.archive.org/web/20210115175037/https://planspace.org/2014/08/17/how-to-sort-by-average-rating/)
    # For reasons described in this blog post written by Reddit user /u/tornmandate
    # for Steam: https://steamdb.info/blog/steamdb-rating/
    # (cache: https://web.archive.org/web/20220218143956/https://steamdb.info/blog/steamdb-rating/)
    def laplace_rank(upvote_count, downvote_count)
      total_count = upvote_count + downvote_count
      return 0.5 if total_count.zero?

      percent_upvotes = upvote_count.to_f / total_count.to_f
      percent_upvotes - ((percent_upvotes - 0.5) * (2**(-1 * Math.log10(total_count + 1))))
    end
  end
end
