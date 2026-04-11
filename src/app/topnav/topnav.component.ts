import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
  imports: [RouterLink, RouterLinkActive, MatToolbarModule],
  standalone: true,
})
export class TopnavComponent {
  readonly primaryRoute = { label: 'Available', path: '/available' };
  readonly secondaryRoutes = [
    { label: 'Getting a Sheltie', path: '/getting-a-sheltie' },
    { label: 'FAQ', path: '/faq' },
    { label: 'About', path: '/about' },
    { label: 'Resources', path: '/resources' },
  ];
}
