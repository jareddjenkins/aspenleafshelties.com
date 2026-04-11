import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-getting-a-sheltie',
  templateUrl: './getting-a-sheltie.component.html',
  styleUrls: ['./getting-a-sheltie.component.css'],
  imports: [RouterLink],
  standalone: true,
})
export class GettingASheltieComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
