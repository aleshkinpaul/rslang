import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WrapperComponent } from './wrapper/wrapper.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [WrapperComponent, FooterComponent],
  imports: [
    FormsModule,
    MaterialModule,
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
