import { Component } from '@angular/core';

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrls: ['./desktop-nav.component.scss']
})
export class DesktopNavComponent {
  routes = [
    { path: '/home', label: 'Aspenleaf Shelties' },
    { path: '/static/about', label: 'About' },
    { path: '/dogs/boys', label: 'Boys' },
    { path: '/dogs/girls', label: 'Girls' },
    { path: '/dogs/puppies', label: 'Puppies' },
    { path: '/static/resources', label: 'Resources' }
  ]
}
