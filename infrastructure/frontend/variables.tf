# Lots of help from this article: https://www.alexhyett.com/terraform-s3-static-website-hosting
# (cached: https://web.archive.org/web/20220222160047/https://www.alexhyett.com/terraform-s3-static-website-hosting)

# variable "aws_access_key_id" {
#   type        = string
#   description = "AWS access key ID"
# }

# variable "aws_region" {
#   type        = string
#   description = "The AWS region in which to serve the website"
# }

# variable "aws_secret_access_key" {
#   type        = string
#   description = "AWS secret access key"
# }

variable "bucket_name" {
  type        = string
  description = "The name of the bucket without the www. prefix. Normally domain_name."
}

variable "common_tags" {
  description = "Common tags you want applied to all components."
}

variable "domain_name" {
  type        = string
  description = "The domain name for the website."
}
