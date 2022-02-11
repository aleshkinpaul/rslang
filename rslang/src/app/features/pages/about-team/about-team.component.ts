import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IUserWord } from 'src/app/shared/interfaces';


@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss'],
})
export class AboutTeamComponent {

  constructor(private api: ApiService, public auth: AuthService, public route: Router) { }

  onClickGetWordsButton() {
    this.api.getWords(0, 0).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetWordButton() {
    this.api.getWord('5e9f5ee35eb9e72bc21af4af').subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickCreateNewUserButton() {
    this.api.createNewUser({ name: 'tempName', email: 'ppp@jd.ru', password: '87654321', avatar: 'rrr' }).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetUserButton() {
    this.api.getUser(this.auth.userId).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickLoginButton() {
    this.auth.login({ email: 'ppp@jd.ru', password: '87654321' });
  }

  onClickLogoutButton() {
    this.auth.logout();

  }

  onClickUpdateUserButton() {
    this.api.updateUser(this.auth.userId, { email: 'sss@jd.ru', password: '87654321' }).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickDeleteUserButton() {
    this.api.deleteUser(this.auth.userId).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetNewTokenButton() {
    this.auth.updateLogin();
  }

  onClickGetAllUserWordsButton() {
    this.api.getAllUserWords(this.auth.userId).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickUpsertButton() {
    const settings = {
      wordsPerDay: 10,
      optional: {
        tempParam: 'path',
      }
    }
    this.api.upsertSettings(this.auth.userId, settings).subscribe((response) => {
      console.log('av', response);
    });
  }

  onClickGetUpsertButton() {
    this.api.getSettings(this.auth.userId).subscribe((response) => {
      console.log('av', response);
    });
  }

  onClickCreateUserWordButton() {
    const wordSettings: IUserWord = {
      difficulty: 'easy',
      optional: {
        isStudied: false,
        correctAnswers: 2,
        wrongAnswers: 3,
        correctSeries: 1,
      }
    }
    this.api.createUserWord(this.auth.userId, '5e9f5ee35eb9e72bc21af4af', wordSettings).subscribe((response) => {
      console.log('word', response);
    });
  }

  startAudioChallenge() {
    this.route.navigate(['/audiochallenge', { page: 15, level: 0 }]);
  };

  startSprint() {
    this.route.navigate(['/sprint', { page: 1, level: 3 }]);
  };


}

