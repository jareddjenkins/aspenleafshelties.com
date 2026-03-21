output "project_number" {
  description = "Numeric project number for the Firebase/GCP project."
  value       = data.google_project.current.number
}

output "service_account_email" {
  description = "Service account email to configure in GitHub Actions."
  value       = google_service_account.github_firebase_hosting_deploy.email
}

output "workload_identity_provider_name" {
  description = "Full Workload Identity Provider resource name for GitHub Actions auth."
  value       = google_iam_workload_identity_pool_provider.github_actions.name
}

output "github_actions_repository_variable_values" {
  description = "Repository variable values to add in GitHub after terraform apply."
  value = {
    GCP_SERVICE_ACCOUNT_EMAIL       = google_service_account.github_firebase_hosting_deploy.email
    GCP_WORKLOAD_IDENTITY_PROVIDER  = google_iam_workload_identity_pool_provider.github_actions.name
  }
}
