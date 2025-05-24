import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Params, Router, RouterModule, UrlSegment } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { UsersService } from '../../../services/users.service';
import { APIResponse, CreateUserTypePayload, UpdateUserTypePayload, UserType } from '../../../models/user.model';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-type-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, SelectModule, ButtonModule,
    InputTextModule, FluidModule
  ],
  templateUrl: './user-type-create.component.html',
  styleUrl: './user-type-create.component.scss',
})
export class UserTypeCreateComponent implements OnInit, OnDestroy {
  private _location = inject(Location);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private usersService: UsersService = inject(UsersService);
  private messageService: MessageService = inject(MessageService);

  $destroy: Subject<null> = new Subject();
  editMode: boolean = false;

  userTypeForm: FormGroup = new FormGroup({
    userType: new FormControl('', [Validators.required]),
  })

  userTypeDetails!: UserType;;


  ngOnDestroy(): void {
    this.$destroy.next(null);
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    // console.log(this.route.queryParams)
    this.route.url.pipe(takeUntil(this.$destroy),
      tap((segments: UrlSegment[]) => {
        this.editMode = segments[1].path === 'edit'
      }),
      switchMap((x) => this.route.params),
      filter(x => !!x['userId'] ),
      switchMap((params: Params) => this.usersService.getUserType(+params['userId'])),
      tap((userTypeResp: APIResponse) => {
        if (userTypeResp.code === 200) {
          this.userTypeDetails = (userTypeResp.data as UserType[])[0];
          this.userTypeForm.patchValue({ userType: this.userTypeDetails.userTypeName });
        }
      }),

    )
      .subscribe()
  }

  onSaveUserType() {
    if (!this.editMode) {
      console.log(this.userTypeForm.value)
      const payload: CreateUserTypePayload = {
        userTypeName: this.userTypeForm.value.userType
      }
      this.usersService.createUserType(payload)
        .pipe(takeUntil(this.$destroy))
        .subscribe((resp: APIResponse) => {
          console.log(resp)
          if (resp.code === 200 && resp.data === 'S') {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User type created successfully.', life: 3000 });
            this.userTypeForm.reset();
          }
        })

    } else {
      console.log(this.userTypeForm.value)
      const payload: UpdateUserTypePayload = {
        userType: this.userTypeDetails?.userType,
        userTypeName: this.userTypeForm.value.userType
      }
      this.usersService.updateUserType(payload).pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (updateResp: APIResponse) => {
            if (updateResp.code === 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User type updated successfully.', life: 3000 });
              this._location.back();
            }
          }
        })
    }

  }

}
