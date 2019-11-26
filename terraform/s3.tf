resource "aws_s3_bucket" "site_bucket" {
  bucket = "${local.hostname}"
  acl    = "private"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    Name        = "Comic Frontier Booth Map"
    HostName    = "${local.hostname}"
    Environment = "${var.environment}"
  }
}

resource "aws_s3_bucket_policy" "site_bucket" {
  bucket = "${aws_s3_bucket.site_bucket.id}"
  policy = "${data.aws_iam_policy_document.site_bucket.json}"
}

data "aws_iam_policy_document" "site_bucket" {
  statement {
    sid = "1"

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.site_bucket.arn}/*"
    ]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"
      values   = ["${local.cloudflare_ip_ranges}"]
    }
  }

  statement {
    sid = "2"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]

    resources = [
      "${aws_s3_bucket.site_bucket.arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = ["${aws_iam_user.cd_user.arn}"]
    }
  }
}
