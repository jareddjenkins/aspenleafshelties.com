import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard {
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.isAuthenticated()) {
      return true;
    }

    // navigate to login page
    this._router.navigate(['/login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}
