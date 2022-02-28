# resource "aws_instance" "searx_server" {
#   ami           = "ami-0fb653ca2d3203ac1"
#   instance_type = "t2.micro"

#   tags = merge(var.common_tags, {
#     Name = "BirdybopSearxServerInstance"
#   })
# }
