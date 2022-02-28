# Lots of help from this article: https://www.alexhyett.com/terraform-s3-static-website-hosting
# (cached: https://web.archive.org/web/20220222160047/https://www.alexhyett.com/terraform-s3-static-website-hosting)

terraform {
  # required_version = "~> 0.14"
  required_version = "~> 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket = "birdybop-terraform"
    key    = "prod/terraform.tfstate"
    region = "us-east-2"
    # region = "${var.aws_region}"
  }
}

provider "aws" {
  profile = "keeshu-deployer"
  region  = "us-east-2"
  # region  = "${var.aws_region}"
  # access_key = var.aws_access_key_id
  # secret_key = var.aws_secret_access_key
}

# This one is for the SSL cert (see `acm.tf`). Needs to be `us-east-1` for
# CloudFront.
provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}
