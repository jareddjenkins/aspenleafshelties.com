import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-getting-a-sheltie',
  templateUrl: './getting-a-sheltie.component.html',
  styleUrls: ['./getting-a-sheltie.component.css'],
  imports: [MatButtonModule, MatCardModule, RouterLink],
  standalone: true,
})
export class GettingASheltieComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
