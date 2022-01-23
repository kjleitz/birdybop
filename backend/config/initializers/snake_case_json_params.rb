# Transforms params coming in from JSON requests (ContentType: application/json)
# from camelCase to snake_case. See the following comment block for more info:
# https://github.com/rails/rails/blob/7-0-stable/actionpack/lib/action_dispatch/http/parameters.rb#L35-L43
#
#   # Configure the parameter parser for a given MIME type.
#   #
#   # It accepts a hash where the key is the symbol of the MIME type
#   # and the value is a proc.
#   #
#   #     original_parsers = ActionDispatch::Request.parameter_parsers
#   #     xml_parser = -> (raw_post) { Hash.from_xml(raw_post) || {} }
#   #     new_parsers = original_parsers.merge(xml: xml_parser)
#   #     ActionDispatch::Request.parameter_parsers = new_parsers
#
# Inspired by/adapted from this StackOverflow answer:
# https://stackoverflow.com/a/30557924/7469691

old_parsers = ActionDispatch::Request.parameter_parsers

json_parser = lambda do |raw_json|
  # Note: `ActiveSupport::JSON::decode` can actually parse date strings into
  #       real dates (`ActiveSupport::TimeWithZone`, specifically) if the
  #       `ActiveSupport.parse_json_times` flag is enabled. It is NOT enabled by
  #       default. See the following block of code for more information:
  #       https://github.com/rails/rails/blob/7-0-stable/activesupport/lib/active_support/json/decoding.rb#L25-L29
  json_data = ActiveSupport::JSON.decode(raw_json)

  # `Hash#deep_transform_keys!` works for hashes nested within arrays within the
  # parent hash, arbitrarily deeply, but it does not exist as a method on Array
  # (only Hash), so that's why there's a flat iteration here to apply the method
  # to all the items of a top-level array. I mention this because otherwise you
  # might think there's a bug here where only hashes in top-level arrays are
  # transformed, and that hashes nested deeply in child arrays are therefore
  # ignored; this is not the case.
  case json_data
  when Array
    json_data.each { |item| item.deep_transform_keys!(&:underscore) }
  when Hash
    json_data.deep_transform_keys!(&:underscore)
  end

  # I don't know if `json_data` can be anything other than Hash or Array, here,
  # but just in case it can be a primitive value we'll only check if it's a Hash
  # here for returning it vanilla, and *anything else* will go under the special
  # `:_json` key. This behavior can be observed in the original parser here:
  # https://github.com/rails/rails/blob/7-0-stable/actionpack/lib/action_dispatch/http/parameters.rb#L11-L14
  json_data.is_a?(Hash) ? json_data : { _json: json_data }
end

ActionDispatch::Request.parameter_parsers = old_parsers.merge(json: json_parser)
