import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ButtonAccentComponent } from './components/button-accent/button-accent.component';
import { MaterialModule } from '../material/material.module';
import { ButtonPrimaryComponent } from './components/button-primary/button-primary.component';
import { ResultingPageComponent } from './components/resulting-page/resulting-page.component';
import { MilkywayAnimationComponent } from './components/milkyway-animation/milkyway-animation.component';



@NgModule({
  declarations: [
    ButtonAccentComponent,
    ButtonPrimaryComponent,
    ResultingPageComponent,
    MilkywayAnimationComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule
  ],
  exports: [
    HttpClientModule,
    ButtonAccentComponent,
    ButtonPrimaryComponent,
    ResultingPageComponent,
    MilkywayAnimationComponent,

  ],
})
export class SharedModule { }
