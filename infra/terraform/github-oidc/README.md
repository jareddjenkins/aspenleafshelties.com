# GitHub OIDC Terraform

This Terraform stack manages the GitHub Actions OIDC trust used to deploy Firebase without a long-lived service account key.

## What It Manages

- the deploy service account
- project IAM roles for that service account
- a Workload Identity Pool
- a GitHub Actions Workload Identity Provider
- the `roles/iam.workloadIdentityUser` binding that allows the GitHub repository to impersonate the service account

The default role set includes:

- `roles/firebasestorage.admin` because `firebase deploy` reads the project's Firebase default bucket and deploys Storage rules
- `roles/serviceusage.serviceUsageAdmin` because `firebase deploy` checks and may enable required Google APIs such as `firebasestorage.googleapis.com` during deploys

The Firebase/GCP project itself already exists, so Terraform reads it with a data source instead of trying to recreate or import it.

## Existing Service Account Import

If the service account already exists, import it before `terraform apply`:

```bash
terraform import google_service_account.github_firebase_hosting_deploy \
  projects/aspenleafshelties/serviceAccounts/github-firebase-hosting-deploy@aspenleafshelties.iam.gserviceaccount.com
```

If the Workload Identity Pool or Provider already exist, import those too:

```bash
terraform import google_iam_workload_identity_pool.github_actions \
  projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions

terraform import google_iam_workload_identity_pool_provider.github_actions \
  projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions/providers/github-actions
```

## Apply

```bash
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

## GitHub Repository Variables

After apply, set these repository variables in GitHub Actions settings using the Terraform outputs:

- `GCP_SERVICE_ACCOUNT_EMAIL`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`

You can print them with:

```bash
terraform output github_actions_repository_variable_values
```

## Notes

- This stack defaults to `jareddjenkins/aspenleafshelties.com` on branch `main`.
- The provider trust is restricted to that repository and branch.
- If Firebase deploy needs broader permissions in practice, add roles intentionally in `service_account_roles`.
