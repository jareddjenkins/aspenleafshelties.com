import { Component } from '@angular/core';
import { NgbCollapse, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
})
export class TopnavComponent {
  isNavbarCollapsed = true;

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
