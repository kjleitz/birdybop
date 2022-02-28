# Lots of help from this article: https://www.alexhyett.com/terraform-s3-static-website-hosting
# (cached: https://web.archive.org/web/20220222160047/https://www.alexhyett.com/terraform-s3-static-website-hosting)

terraform {
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
  }
}

provider "aws" {
  profile = "keeshu-deployer"
  region  = "us-east-2"
}

# This one is for the SSL cert (see `acm.tf`). Needs to be `us-east-1` for
# CloudFront.
provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}
