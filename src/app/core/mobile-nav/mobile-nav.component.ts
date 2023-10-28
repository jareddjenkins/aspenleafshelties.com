import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent {
  routes = [
    { path: '/home', label: 'Home' },
    { path: '/static/about', label: 'About' },
    { path: '/dogs/boys', label: 'Boys' },
    { path: '/dogs/girls', label: 'Girls' },
    { path: '/dogs/puppies', label: 'Puppies' },
    { path: '/static/resources', label: 'Resources' }
  ]
}
