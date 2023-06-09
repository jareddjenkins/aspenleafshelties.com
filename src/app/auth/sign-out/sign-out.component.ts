import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-sign-out',
    templateUrl: './sign-out.component.html',
    styleUrls: ['./sign-out.component.css'],
    standalone: true
})
export class SignOutComponent implements OnInit {

  constructor(
    private socialAuthService: SocialAuthService,
    public router: Router
  ) { }
  ngOnInit(): void {
    this.socialAuthService.signOut();
    this.router.navigate(['login']);
  }

}
