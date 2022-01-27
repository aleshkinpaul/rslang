import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutTeamComponent } from './about-team/about-team.component';
import { GamesComponent } from './games/games.component';
import { LearnbookComponent } from './learnbook/learnbook.component';
import { MainPageComponent } from './main-page/main-page.component';
import { StatisticsComponent } from './statistics/statistics.component';



const routes: Routes = [
  {
    path:'',
    component: MainPageComponent

  },
  {
    path:'mainpage',
    component: MainPageComponent

  },
  {
    path:'aboutteam',
    component: AboutTeamComponent

  },
  {
    path:'statistics',
    component: StatisticsComponent

  },
  {
    path:'learnbook',
    component: LearnbookComponent

  },
  {
    path:'games',
    component: GamesComponent

  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
