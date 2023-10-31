import { Component } from '@angular/core';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  standalone: true,
  imports: [MatLegacyButtonModule],
})
export class ResourcesComponent {}
