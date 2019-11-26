variable "subdomain" {
  type = "string"
}

variable "environment" {
  type    = "string"
  default = "development"
}

variable "cloudflare_email" {
  type = "string"
}

variable "cloudflare_api_key" {
  type = "string"
}

variable "cloudflare_zone" {
  type = "string"
}

variable "cloudflare_zone_id" {
  type = "string"
}
