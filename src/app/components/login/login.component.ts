import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthUser } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, ButtonModule, PasswordModule, FormsModule, FloatLabelModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: []
})
export class LoginComponent implements OnDestroy {

  password: string = ''
  username: string = '';

  private loginService = inject(LoginService);
  private $destroy = new Subject<null>();
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private returnUrl: string = '/';

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next(null);
  }


  login(form: NgForm) {
    // console.log(form)
    this.loginService.login(form.value.username, form.value.password).pipe(takeUntil(this.$destroy)).subscribe({
      next: (resp: AuthUser) => {
        console.log(resp)
        if (resp) {
          localStorage.setItem('accessToken', resp.accessToken);
          localStorage.setItem('refreshToken', resp.refreshToken);
          localStorage.setItem('loginUserType', String(resp.userType));
          localStorage.setItem('loginUserFirstName', String(resp.firstName));

          this.router.navigateByUrl(this.returnUrl);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }, error: (err: HttpErrorResponse) => {
        console.log(err)
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Unauthorized', detail: 'Invalid credentials.', life: 3000 })
        }
      }
    })
  }
}
