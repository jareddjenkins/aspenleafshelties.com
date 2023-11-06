import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopNavComponent } from './desktop-nav/desktop-nav.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, RouterLink } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DesktopNavComponent, MobileNavComponent, FooterComponent],
  imports: [CommonModule, RouterLink, RouterModule, SharedModule],
  exports: [DesktopNavComponent, MobileNavComponent],
})
export class CoreModule {}
