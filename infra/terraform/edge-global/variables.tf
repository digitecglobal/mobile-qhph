variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "qhph"
}

variable "primary_region" {
  description = "Primary API region for endpoint group"
  type        = string
  default     = "sa-east-1"
}

variable "origin_domain_name" {
  description = "Public origin domain used by CloudFront"
  type        = string
}

variable "alb_arn" {
  description = "ALB ARN used by Global Accelerator endpoint group"
  type        = string
}
