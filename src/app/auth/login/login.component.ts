import { Component, OnInit } from '@angular/core';
import {
  SocialAuthService,
  SocialUser,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { NgIf } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class LoginComponent implements OnInit {
  private dogApiUrl = environment.apiEndpoint;
  user: SocialUser;
  loggedIn: boolean;
  allowed: boolean;

  constructor(
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private http: HttpClient,
  ) {}
  ngOnInit() {
    localStorage.clear();
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      this.sendGoogleToken();
    });
  }
  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  sendGoogleToken(): void {
    const url = `${this.dogApiUrl}/auth/`;
    this.http
      .post<boolean>(url, `"${this.user.idToken}"`, httpOptions)
      .pipe()
      .subscribe((b) => {
        if (b) {
          this.authService.login();
        }
      });
  }
}
