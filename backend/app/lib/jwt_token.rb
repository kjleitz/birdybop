class JwtToken
  class << self
    def encode(data, expires_at: 30.minutes.from_now)
      Utils.assert_that data, is_a: Hash, otherwise: ArgumentError

      secret = Rails.application.secret_key_base
      claims = {
        exp: expires_at.is_a?(Time) ? expires_at.to_i : expires_at,
        iat: Time.zone.now.to_i,
        iss: 'https://api.birdybop.com',
        alg: 'HS256',
        typ: 'JWT',
      }.merge(data)

      JWT.encode(claims, secret, claims[:alg])
    end

    def decode(token)
      Utils.assert_that token, is_a: String, otherwise: ArgumentError

      return HashWithIndifferentAccess.new if token.blank?

      decoded = begin
        secret = Rails.application.secret_key_base
        JWT.decode(token, secret, true, { algorithm: 'HS256' })
      rescue JWT::DecodeError => e
        Rails.logger.info("JWT error:")
        Rails.logger.info(e.inspect)
        Rails.logger.info(e.backtrace)
        []
      end

      HashWithIndifferentAccess.new(decoded.first)
    end
  end
end
