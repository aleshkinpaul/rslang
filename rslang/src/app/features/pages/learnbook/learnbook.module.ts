import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { GroupComponent } from './group/group.component';
import { WordComponent } from './word/word.component';
import { LearnbookRoutingModule } from './learnbook-routing.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [  
    MainComponent,
    GroupComponent,
    WordComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LearnbookRoutingModule
  ]
})
export class LearnbookModule { }
