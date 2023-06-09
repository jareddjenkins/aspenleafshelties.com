import { Component, OnInit } from '@angular/core';
import { NgbCollapse, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-enterdogsnav',
    templateUrl: './enterdogsnav.component.html',
    styleUrls: ['./enterdogsnav.component.css'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgbCollapse, NgbDropdown]
})
export class EnterdogsnavComponent {

  isNavbarCollapsed = true;

  constructor() {}

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
