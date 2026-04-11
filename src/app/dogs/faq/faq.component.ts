import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  imports: [RouterLink],
  standalone: true,
})
export class FaqComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
