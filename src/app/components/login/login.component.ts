import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { EMPTY, map, Observable, race, Subject, takeUntil, takeWhile, timer } from 'rxjs';
import { LoginService } from '../../services/login.service';

import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { TabsModule } from 'primeng/tabs';
import { MessageDuaraion, MessageSeverity } from '../../models/config.enum';
import { AuthUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { TableModule } from "primeng/table";
@Component({
  selector: 'app-login',
  imports: [InputTextModule,
    ButtonModule,
    PasswordModule,
    FormsModule,
    FloatLabelModule,
    CarouselModule,
    CommonModule,
    DialogModule,
    TabsModule,
    InputOtpModule,
    AsyncPipe, TableModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: []
})
export class LoginComponent implements OnDestroy {

  password: string = ''
  username: string = '';
  mobileno: string = '';

  private loginService = inject(LoginService);
  $destroy = new Subject<null>();
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private permissionService = inject(PermissionService);
  private authService: AuthService = inject(AuthService);

  private returnUrl: string = '/';

  showOtpInput = false;
  otpValue: string = '';
  leftTime: Observable<number> = EMPTY;

  tabValue = 0;

  $cancelCountDown: Subject<boolean> = new Subject<boolean>()


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
          localStorage.setItem('loginUserId', String(resp.id));
          localStorage.setItem('loginUserFirstName', String(resp.firstName));
          localStorage.setItem('username', String(resp.username));
          this.permissionService.refreshPermissions(resp.id);

          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.authService.logout();
        }
      }, error: (err: HttpErrorResponse) => {
        console.log(err)
        if (err.status === 401) {
          this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Unauthorized', detail: 'Invalid credentials.', life: MessageDuaraion.STANDARD })
        }
      }
    })
  }


  images = [
    { src: 'assets/login-carousel/car-01.png', alt: 'Image 1', title: 'Property Tax' },
    { src: 'assets/login-carousel/car-02.png', alt: 'Image 2', title: 'Property Survey' },
    { src: 'assets/login-carousel/car-03.png', alt: 'Image 3', title: 'User Charge' },
    { src: 'assets/login-carousel/car-04.png', alt: 'Image 4', title: 'Water Charge' },
    { src: 'assets/login-carousel/car-05.png', alt: 'Image 5', title: 'Trade License' },
    { src: 'assets/login-carousel/car-06.png', alt: 'Image 6', title: 'Adverteisment ' }
  ];


  submitOtp() {
    console.log(this.otpValue)
  }

  validateMobile(f: NgForm) {
    console.log(f.value)
    this.showOtpInput = true
    this.leftTime = timer(0, 1000).pipe(
      takeUntil(race(this.$destroy, this.$cancelCountDown)),
      map(x => 15 - x),
      takeWhile(time => time >= 0))
  }
}
