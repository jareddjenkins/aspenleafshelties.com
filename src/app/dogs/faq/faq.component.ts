import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  imports: [MatButtonModule, MatCardModule, RouterLink],
  standalone: true,
})
export class FaqComponent {
  readonly questionnaireEnabled = environment.questionnaireEnabled;
}
