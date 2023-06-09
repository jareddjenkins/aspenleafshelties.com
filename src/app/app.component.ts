import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { TopnavComponent } from './topnav/topnav.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [TopnavComponent, RouterOutlet, FooterComponent]
})
export class AppComponent {
  title = 'AspenLeafShelties';
}