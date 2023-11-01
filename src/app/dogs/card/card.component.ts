import { Component, Input } from '@angular/core';
import { Dog } from '../model/dog';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() dog: Dog;

}
