resource "cloudflare_record" "site_record" {
  zone_id = "${var.cloudflare_zone_id}"
  name    = "${var.subdomain}"
  value   = "${aws_s3_bucket.site_bucket.website_endpoint}"
  type    = "CNAME"
  ttl     = 1
  proxied = true
}
