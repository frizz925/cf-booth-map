output "hostname" {
  value = "${cloudflare_record.site_record.hostname}"
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
