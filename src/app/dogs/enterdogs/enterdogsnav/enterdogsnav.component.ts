import { Component } from '@angular/core';

@Component({
  selector: 'app-enterdogsnav',
  templateUrl: './enterdogsnav.component.html',
  styleUrls: ['./enterdogsnav.component.css'],
})
export class EnterdogsnavComponent {
  isNavbarCollapsed = true;

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
