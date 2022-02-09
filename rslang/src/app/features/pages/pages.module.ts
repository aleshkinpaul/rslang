import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
<<<<<<< HEAD

=======
>>>>>>> 2ba4550a0e59987defcd8e1490a7ec31b581cbfc
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { AboutTeamComponent } from './about-team/about-team.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { GamesComponent } from './games/games.component';
import { LearnbookComponent } from './learnbook/learnbook.component';
import { AudioChallengeComponent } from './audio-challenge/audio-challenge.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SprintComponent } from './sprint/sprint.component';
import { LoginComponent } from './login/login.component';




@NgModule({
  declarations: [MainPageComponent, AboutTeamComponent, StatisticsComponent, GamesComponent, LearnbookComponent, AudioChallengeComponent, SprintComponent, LoginComponent],
  imports: [
    CommonModule,

    MaterialModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]

})
export class PagesModule { }
