data "google_project" "current" {
  project_id = var.project_id
}

resource "google_service_account" "github_firebase_hosting_deploy" {
  account_id   = var.service_account_id
  display_name = var.service_account_display_name
}

resource "google_project_iam_member" "service_account_roles" {
  for_each = var.service_account_roles

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_firebase_hosting_deploy.email}"
}

resource "google_iam_workload_identity_pool" "github_actions" {
  workload_identity_pool_id = var.workload_identity_pool_id
  display_name              = "GitHub Actions"
  description               = "OIDC trust for GitHub Actions deployments."
}

resource "google_iam_workload_identity_pool_provider" "github_actions" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_actions.workload_identity_pool_id
  workload_identity_pool_provider_id = var.workload_identity_provider_id
  display_name                       = "GitHub Actions"
  description                        = "OIDC provider for GitHub Actions."

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.aud"        = "assertion.aud"
    "attribute.ref"        = "assertion.ref"
    "attribute.repository" = "assertion.repository"
  }

  attribute_condition = "assertion.repository == \"${var.github_owner}/${var.github_repo}\" && assertion.ref == \"refs/heads/${var.github_branch}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account_iam_member" "github_actions_wif_user" {
  service_account_id = google_service_account.github_firebase_hosting_deploy.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_actions.name}/attribute.repository/${var.github_owner}/${var.github_repo}"
}
