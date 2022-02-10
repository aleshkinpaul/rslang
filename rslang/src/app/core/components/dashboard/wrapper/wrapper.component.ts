import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent {
  mobileQuery: MediaQueryList;
  isExpanded: boolean = false;
  isDarkTheme: boolean = false;
  isBubble: boolean = true;
  isSound: boolean = true;
  private _mobileQueryListener: () => void;

  constructor(public auth: AuthService, public route: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  onLoginButtonClick() {
    if (this.auth.isAuthenticated) {
      this.auth.logout();
    } else {
      this.route.navigate(['/login']);
    }
  }
}
