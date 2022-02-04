import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Subject, throwError } from 'rxjs';
import { ERROR_MESSAGE } from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IUser, IUserData } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public createUserError$ = new Subject<string>();
  isLoginPage = true;
  isHidePassword = true;
  name = new FormControl('');
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  form!: FormGroup;
  submitted = false;

  constructor(public auth: AuthService, private api: ApiService, private route: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: this.name,
      email: this.email,
      password: this.password,
    });

    this.changeNameValidators();
  }

  changeNameValidators() {
    if (this.isLoginPage) {
      this.name.clearValidators();
    } else {
      this.name.setValidators([Validators.required, Validators.minLength(3)]);
    }
    this.name.updateValueAndValidity();
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Вам нужно ввести Email';
    }

    return this.email.hasError('email') ? 'Неправильный Email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Вам нужно ввести пароль';
    }

    return this.password.hasError('minlength') ? 'Минимальная длинна пароля 8 символов' : '';
  }

  getNameErrorMessage() {
    if (this.name.hasError('required')) {
      return 'Вам нужно ввести имя';
    }

    return this.name.hasError('minlength') ? 'Минимальная длинна имени 3 символа' : '';
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitted = true;

    if (this.isLoginPage) {
      this.onLogin();
    } else {
      this.onRegister();
    }
  }

  onLogin() {
    const user: IUserData = {
      email: this.form.value.email,
      password: this.form.value.password,
    }

    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.route.navigate(['/mainpage']);
    });
  }

  onRegister() {
    const user: IUser = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password,
    }

    this.api.createNewUser(user).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 417) {
          this.createUserError$.next(ERROR_MESSAGE.create);
        }
        return throwError(() => error);
      })
    ).subscribe((response) => {
      this.loginAfterRegister(response.email, user.password);
    });
  }

  loginAfterRegister(email: string, password: string) {
    const newUser: IUserData = {
      email: email,
      password: password,
    }

    this.auth.login(newUser).subscribe(() => {
      this.form.reset();
      this.route.navigate(['/mainpage']);
    });
  }

  changeMode() {
    this.isLoginPage = !this.isLoginPage;
    this.changeNameValidators();
  }
}
