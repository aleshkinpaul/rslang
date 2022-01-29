import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss']
})
export class AboutTeamComponent {

  constructor(private api: ApiService, public auth: AuthService) { }

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
    this.api.createNewUser({ name: 'tempName', email: 'sss@jd.ru', password: '87654321' }).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetUserButton() {
    this.api.getUser(this.auth.userId, this.auth.token).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickLoginButton() {
    this.auth.login({ email: 'sss@jd.ru', password: '87654321' });
  }

  onClickLogoutButton() {
    this.auth.logout();

  }

  onClickUpdateUserButton() {
    this.api.updateUser(this.auth.userId, this.auth.token, { email: 'sss@jd.ru', password: '87654321' }).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickDeleteUserButton() {
    this.api.deleteUser(this.auth.userId, this.auth.token).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetNewTokenButton() {
    this.auth.updateLogin();
  }

  onClickGetAllUserWordsButton() {
    this.api.getAllUserWords(this.auth.userId, this.auth.token).subscribe((response) => {
      console.log('resp:', response);
    });
  }
}
