import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { AvailableComponent } from './available/available.component';

import { DogsRoutingModule } from './dogs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [
    AvailableComponent,
    BoysComponent,
    GirlsComponent,
    CardComponent,
  ],
  imports: [CommonModule, DogsRoutingModule,  SharedModule],
  exports: [CardComponent],
})
export class DogsModule {}
