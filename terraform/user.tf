resource "aws_iam_user" "cd_user" {
  name = "CFBoothMapCD"
  path = "/cf-booth-map/"

  tags = {
    description = "User for Continuous Deployment"
  }
}

resource "aws_iam_access_key" "cd_access_key" {
  user    = "${aws_iam_user.cd_user.name}"
  pgp_key = "${trimspace(file("pubkey.asc"))}"
}

resource "aws_iam_user_policy" "cd_s3_access" {
  name   = "S3BucketAccess"
  user   = "${aws_iam_user.cd_user.name}"
  policy = "${data.aws_iam_policy_document.s3_access.json}"
}

data "aws_iam_policy_document" "s3_access" {
  statement {
    sid = 1

    actions = [
      "s3:*"
    ]

    resources = [
      "arn:aws:s3:::*"
    ]
  }
}
