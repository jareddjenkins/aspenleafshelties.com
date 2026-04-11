import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [RouterLink],
  standalone: true,
})
export class ContactComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
