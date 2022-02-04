import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent {
  isExpanded: boolean = false;
  isDarkTheme: boolean = false;
  isBubble: boolean = true;

  constructor(public auth: AuthService, public route: Router) { }

  onLoginButtonClick() {
    if (this.auth.isAuthenticated) {
      this.auth.logout();
    } else {
      this.route.navigate(['/login']);
    }
  }
}
