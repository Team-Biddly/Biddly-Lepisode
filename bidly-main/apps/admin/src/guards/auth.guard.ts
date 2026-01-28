import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AdminStore } from '../stores/admin.store';

export const authGuard: CanActivateChildFn = async (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const adminStore = inject(AdminStore);
  const router = inject(Router);

  if (!adminStore.user()) {
    await adminStore.fetchAdmin();
  }

  if (!adminStore.user()) {
    router.navigate(['/sign-in']);

    return false;
  }

  return true;
};
