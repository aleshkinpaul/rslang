import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss']
})
export class AboutTeamComponent {

  constructor(private api: ApiService) { }

  onClickGetWordsButton() {
    this.api.getWords(0, 0).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetWordButton() {
    this.api.getWord('5e9f5ee35eb9e72bc21af4a0').subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickCreateNewUserButton() {
    this.api.createNewUser({ name: 'tempName', email: 'sss@jd.ru', password: '87654321' }).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetUserButton() {
    this.api.getUser('61f30c12eb87140016ebfd14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjMwMDdkZWI4NzE0MDAxNmViZmQxMiIsImlhdCI6MTY0MzMxODEyOCwiZXhwIjoxNjQzMzMyNTI4fQ.6O2pKL8AdP6SSN7VIHpYgy0K2u4c0rdDfnPTMasnaiM').subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickSignInButton() {
    this.api.signIn({ email: 'sss@jd.ru', password: '87654321' }).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickUpdateUserButton() {
    this.api.updateUser('61f30c12eb87140016ebfd14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjMwMDdkZWI4NzE0MDAxNmViZmQxMiIsImlhdCI6MTY0MzMxNjQyNiwiZXhwIjoxNjQzMzMwODI2fQ.PR1ipcMOBIhZ6i0R65ec5YNP1j580USJhsM_bgKlGhA', { email: 'sss@jd.ru', password: '87654321' }).subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickDeleteUserButton() {
    this.api.deleteUser('61f30c12eb87140016ebfd14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjMwMDdkZWI4NzE0MDAxNmViZmQxMiIsImlhdCI6MTY0MzMxODEyOCwiZXhwIjoxNjQzMzMyNTI4fQ.6O2pKL8AdP6SSN7VIHpYgy0K2u4c0rdDfnPTMasnaiM').subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetNewTokenButton() {
    this.api.getNewUserTokens('61f30c12eb87140016ebfd14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjMwYzEyZWI4NzE0MDAxNmViZmQxNCIsInRva2VuSWQiOiI0NjJhNTQ4Ny1iYjRiLTQ3OWItYjYzYS1iNjNlOTFlNjhjNWYiLCJpYXQiOjE2NDMzMTgzMjcsImV4cCI6MTY0MzMzNDUyN30.1Hd-V4v_0y4h2aACl8Aq7lNWCDB852yWKixoDvaIc1Y').subscribe((response) => {
      console.log('resp:', response);
    });
  }

  onClickGetAllUserWordsButton() {
    this.api.getAllUserWords('61f30c12eb87140016ebfd14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjMwYzEyZWI4NzE0MDAxNmViZmQxNCIsImlhdCI6MTY0MzMxODM1NiwiZXhwIjoxNjQzMzMyNzU2fQ.bIuNCDtGtB4DEblKu2LX7oPWPooOM7-jtW0_7iYhnsw').subscribe((response) => {
      console.log('resp:', response);
    });
  }
}
