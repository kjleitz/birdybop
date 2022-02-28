# resource "aws_route53_zone" "this" {
#   name = var.domain_name
# }

# module "acm" {
#   source = "terraform-aws-modules/acm/aws"

#   domain_name = var.domain_name
#   zone_id     = aws_route53_zone.this.zone_id

#   wait_for_validation = true

#   tags = merge(var.common_tags, {
#     Terraform = "true"
#   })
# }

# module "alb" {
#   source  = "terraform-aws-modules/alb/aws"
#   version = "~> 5.10.0"

#   name               = "alb"
#   load_balancer_type = "application"

#   vpc_id  = module.vpc.vpc_id
#   subnets = module.vpc.public_subnets

#   target_groups = [
#     {
#       backend_protocol = "HTTP"
#       backend_port     = 8000
#       target_type      = "ip"
#       "health_check" = {
#         enabled = true,
#         path    = "/"
#       }
#     }
#   ]

#   https_listeners = [
#     {
#       port               = 443
#       protocol           = "HTTPS"
#       target_group_index = 0
#       certificate_arn    = module.acm.this_acm_certificate_arn
#     }
#   ]

#   tags = merge(var.common_tags, {
#     Terraform = "true"
#   })
# }

# resource "aws_route53_record" "dns_record" {
#   zone_id = coalescelist(data.aws_route53_zone.this.*.zone_id, aws_route53_zone.this.*.zone_id)[0]
#   name    = coalescelist(data.aws_route53_zone.this.*.name, aws_route53_zone.this.*.name)[0]
#   type    = "A"

#   alias {
#     name                   = module.alb.this_lb_dns_name
#     zone_id                = module.alb.this_lb_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_service_discovery_private_dns_namespace" "dns_namespace" {
#   name = var.namespace
#   vpc  = module.vpc.vpc_id

#   tags = merge(var.common_tags, {
#     Terraform = "true"
#   })
# }
