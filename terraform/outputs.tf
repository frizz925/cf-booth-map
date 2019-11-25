output "website_endpoint" {
  value = "${aws_s3_bucket.site_bucket.website_endpoint}"
}

output "website_domain" {
  value = "${aws_s3_bucket.site_bucket.website_domain}"
}

output "user_name" {
  value = "${aws_iam_user.cd_user.name}"
}

output "access_key_id" {
  value = "${aws_iam_access_key.cd_access_key.id}"
}

output "secret_access_key" {
  value = "${aws_iam_access_key.cd_access_key.encrypted_secret}"
}
