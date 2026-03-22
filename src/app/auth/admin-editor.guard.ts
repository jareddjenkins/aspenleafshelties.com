import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AdminAuthService } from './admin-auth.service';

export const adminEditorGuard: CanActivateFn = async (_route, state) => {
  const adminAuthService = inject(AdminAuthService);
  const router = inject(Router);
  const canEdit = await adminAuthService.canEdit();

  return canEdit
    ? true
    : router.createUrlTree(['/admin'], {
        queryParams: { redirect: state.url },
      });
};
