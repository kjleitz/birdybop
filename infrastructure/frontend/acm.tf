# Lots of help from this article: https://www.alexhyett.com/terraform-s3-static-website-hosting
# (cached: https://web.archive.org/web/20220222160047/https://www.alexhyett.com/terraform-s3-static-website-hosting)

# DNS validation requires the domain nameservers to already be pointing to AWS.
# However, you won't know the nameservers you need until after the NS Route 53
# record has been created. So, we'll just do email validation. To switch to DNS
# validation, an example is provided at the bottom of this document, under the
# heading "SSL Certificate & DNS Validation."
#
# NOTE: While this is being set up, you'll have to actually validate by email.
# This requires... you guessed it! ...waiting for (and responding to) an email
# before continuing. Might need `admin@birdybop.com` or `webmaster@birdybop.com`
# set up. We will see.

## SSL Certificate & Email Validation

# resource "aws_acm_certificate" "ssl_certificate" {
#   provider                  = aws.acm_provider
#   domain_name               = var.domain_name
#   subject_alternative_names = ["*.${var.domain_name}"]
#   validation_method         = "EMAIL"

#   tags = var.common_tags

#   lifecycle {
#     create_before_destroy = true
#   }
# }

# resource "aws_acm_certificate_validation" "cert_validation" {
#   # Provider is the `acm_provider`-aliased AWS provider, for reasons listed in
#   # `providers.tf` above its configuration block (at the time of writing).
#   provider        = aws.acm_provider
#   certificate_arn = aws_acm_certificate.ssl_certificate.arn
# }

# SSL Certificate & DNS Validation

resource "aws_acm_certificate" "ssl_certificate" {
  provider                  = aws.acm_provider
  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"
  tags                      = var.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "main" {
  for_each = {
    for dvo in aws_acm_certificate.ssl_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

# NOTE: This takes a fucking million years
# NOTE: It only took a fucking million years because the domain (in Route 53)
#       used the nameservers from the default Hosted Zone that was created when
#       the domain was created. I deleted that Hosted Zone afterward because I
#       wanted to manage it through Terraform. If this happens to you, go into
#       the Hosted Zone for your domain and check out the NS records. Then, go
#       into the details for the registered domain and check out the name
#       servers listed there. They're probably different. Replace the registered
#       domain's name servers with the ones from the Hosted Zone, and try again.
#       Might still take a few minutes, but it should take <30min this time.
resource "aws_acm_certificate_validation" "cert_validation" {
  provider                = aws.acm_provider
  certificate_arn         = aws_acm_certificate.ssl_certificate.arn
  validation_record_fqdns = [for record in aws_route53_record.main : record.fqdn]
}
