output "instance_ip" {
  value = aws_instance.app_server.public_ip
}

output "bucket_name" {
  value = aws_s3_bucket.app_bucket.bucket
}
