variable "project_id" {
  description = "The GCP project ID that hosts Firebase resources."
  type        = string
  default     = "aspenleafshelties"
}

variable "github_owner" {
  description = "GitHub owner for the repository allowed to deploy."
  type        = string
  default     = "jareddjenkins"
}

variable "github_repo" {
  description = "GitHub repository name allowed to deploy."
  type        = string
  default     = "aspenleafshelties.com"
}

variable "github_branch" {
  description = "GitHub branch allowed to deploy."
  type        = string
  default     = "main"
}

variable "workload_identity_pool_id" {
  description = "Terraform-managed ID for the GitHub Actions workload identity pool."
  type        = string
  default     = "github-actions"
}

variable "workload_identity_provider_id" {
  description = "Terraform-managed ID for the GitHub Actions workload identity provider."
  type        = string
  default     = "github-actions"
}

variable "service_account_id" {
  description = "Terraform-managed service account ID used by GitHub Actions."
  type        = string
  default     = "github-firebase-hosting-deploy"
}

variable "service_account_display_name" {
  description = "Display name for the GitHub Actions deploy service account."
  type        = string
  default     = "GitHub Firebase Hosting Deploy"
}

variable "service_account_roles" {
  description = "Project roles granted to the GitHub Actions deploy service account."
  type        = set(string)
  default = [
    "roles/firebasestorage.admin",
    "roles/firebasehosting.admin",
    "roles/firebaserules.admin",
    "roles/serviceusage.serviceUsageAdmin",
  ]
}
