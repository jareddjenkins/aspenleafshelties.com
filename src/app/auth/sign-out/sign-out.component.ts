import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
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
