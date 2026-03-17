output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.edge.domain_name
}

output "waf_arn" {
  value = aws_wafv2_web_acl.edge.arn
}

output "global_accelerator_dns_name" {
  value = aws_globalaccelerator_accelerator.edge.dns_name
}
