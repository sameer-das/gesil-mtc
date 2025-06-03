import { Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { APIResponse, CreateUserTypePayload, UpdateUserTypePayload, UserType } from '../../../models/user.model';
import { UsersService } from '../../../services/users.service';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";

@Component({
  selector: 'app-user-type-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, SelectModule, ButtonModule,
    InputTextModule, FluidModule, MultiSelectModule
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
    parentReportingUserType: new FormControl<UserType[]>([], [Validators.required])
  })

  userTypeDetails!: UserType;

  allUserTypes: UserType[] = [
    { userType: 2, userTypeName: 'Project Manager' },
    { userType: 3, userTypeName: 'Municipalty Admin' },
    { userType: 4, userTypeName: 'Project Lead' },
    { userType: 5, userTypeName: 'Team Lead' },
  ]


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
