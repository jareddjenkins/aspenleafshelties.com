import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponentsModule } from './material-components/material-components.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    MaterialComponentsModule
  ]
})
export class SharedModule {}
