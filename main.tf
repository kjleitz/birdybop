terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.74"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "keeshu-deployer"
  region  = "us-east-2"
}

resource "aws_instance" "searx_server" {
  ami           = "ami-0fb653ca2d3203ac1"
  instance_type = "t2.micro"

  tags = {
    Name = "BirdybopSearxServerInstance"
  }
}
