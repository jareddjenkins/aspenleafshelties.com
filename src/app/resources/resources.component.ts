import { Component, OnInit } from '@angular/core';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.css'],
    standalone: true,
    imports: [MatLegacyButtonModule]
})
export class ResourcesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
