import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { AboutTeamComponent } from './about-team/about-team.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { GamesComponent } from './games/games.component';
import { LearnbookComponent } from './learnbook/learnbook.component';




@NgModule({
  declarations: [MainPageComponent, AboutTeamComponent, StatisticsComponent, GamesComponent, LearnbookComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
