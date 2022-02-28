# Lots of help from this article: https://www.alexhyett.com/terraform-s3-static-website-hosting
# (cached: https://web.archive.org/web/20220222160047/https://www.alexhyett.com/terraform-s3-static-website-hosting)

# S3 bucket for `www.`-prefixed site ("the" site).
resource "aws_s3_bucket" "www_bucket" {
  bucket = "www.${var.bucket_name}"
  acl    = "public-read"
  policy = templatefile("templates/s3-policy.json.tftpl", { bucket = "www.${var.bucket_name}" })

  cors_rule {
    allowed_headers = ["Authorization", "Content-Length"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["https://www.${var.domain_name}"]
    max_age_seconds = 3000
  }

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = var.common_tags
}

# S3 bucket for redirecting non-www requests to the `www.` subdomain.
resource "aws_s3_bucket" "root_bucket" {
  bucket = var.bucket_name
  acl    = "public-read"
  policy = templatefile("templates/s3-policy.json.tftpl", { bucket = var.bucket_name })

  website {
    redirect_all_requests_to = "https://www.${var.domain_name}"
  }

  tags = var.common_tags
}
