import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  standalone: false,
})
export class FaqComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
