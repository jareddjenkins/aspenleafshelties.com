import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    standalone: false
})
export class ContactComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
