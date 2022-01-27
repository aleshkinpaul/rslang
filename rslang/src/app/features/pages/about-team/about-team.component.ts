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
}
