# EC2 instance
resource "aws_instance" "app_server" {
  ami           = "ami-0c02fb55956c7d316"   # Example Amazon Linux AMI
  instance_type = var.instance_type

  tags = {
    Name = "MuniaAppServer"
  }
}

# S3 bucket
resource "aws_s3_bucket" "app_bucket" {
  bucket = var.munia-qa-bucket
  acl    = "private"
}
