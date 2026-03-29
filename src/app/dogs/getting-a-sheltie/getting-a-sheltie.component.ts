import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-getting-a-sheltie',
  templateUrl: './getting-a-sheltie.component.html',
  styleUrls: ['./getting-a-sheltie.component.css'],
  standalone: false,
})
export class GettingASheltieComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
