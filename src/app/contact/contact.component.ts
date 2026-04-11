import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [MatButtonModule, MatCardModule, RouterLink],
  standalone: true,
})
export class ContactComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
