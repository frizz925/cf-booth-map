provider "aws" {
  version = "~> 2.0"
  region  = "ap-southeast-1"
}

provider "cloudflare" {
  version = "~> 2.0"
  email   = "${var.cloudflare_email}"
  api_key = "${var.cloudflare_api_key}"
}
