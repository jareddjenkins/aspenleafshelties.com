import { Component, OnInit } from '@angular/core';
import { NgbCollapse, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.css'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgbCollapse, NgbDropdown]
})
export class TopnavComponent {
  isNavbarCollapsed = true;

  constructor() {}

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
