import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListdogsComponent } from './listdogs/listdogs.component';
import { EnterdogsnavComponent } from './enterdogsnav/enterdogsnav.component';

@Component({
    selector: 'app-enterdogs',
    templateUrl: './enterdogs.component.html',
    styleUrls: ['./enterdogs.component.css'],
    standalone: true,
    imports: [EnterdogsnavComponent, ListdogsComponent, RouterOutlet]
})
export class EnterdogsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
