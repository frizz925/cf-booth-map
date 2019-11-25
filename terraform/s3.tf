resource "aws_s3_bucket" "site_bucket" {
  bucket = "${var.hostname}"
  acl    = "private"
  policy = "${data.aws_iam_policy_document.site_bucket.json}"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    Name        = "Comic Frontier Booth Map"
    HostName    = "${var.hostname}"
    Environment = "${var.environment}"
  }
}

data "aws_iam_policy_document" "site_bucket" {
  statement {
    sid = "1"

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "arn:aws:s3:::${var.hostname}/*"
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
      "arn:aws:s3:::${var.hostname}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = ["${aws_iam_user.cd_user.arn}"]
    }
  }
}
