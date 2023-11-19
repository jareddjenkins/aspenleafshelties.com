import { Component, Input, OnInit } from '@angular/core';
import { Dog } from 'src/app/shared/model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() dogs: Dog[] | null = null;
}
