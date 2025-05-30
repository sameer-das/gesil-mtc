import { Component, inject, numberAttribute, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { UserCreateComponent } from "../user-create/user-create.component";
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { APIResponse, ParentOptions, ParentUserTypeForMapping, UpdateUserAadharPan, UpdateUserBasicDetails, UpdateUserParentTypePayload, UserBasicDetails, UserDetail } from '../../../models/user.model';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadEvent, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
export enum TABTYPE {
  BASIC_DETAIL = 'basic-details',
  DOCUMENTS = 'documents',
  REPORTING = 'reporting'
}

@Component({
  selector: 'app-user-edit',
  imports: [PageHeaderComponent, UserCreateComponent,
    TabsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    FileUploadModule, DividerModule, ReactiveFormsModule, TooltipModule, RouterModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {

  private $destroy: Subject<null> = new Subject();
  private usersService: UsersService = inject(UsersService)
  private route: ActivatedRoute = inject(ActivatedRoute);
  private messageService: MessageService = inject(MessageService);

  private currentUserId!: number;
  private currentUserType!: number;

  userDetail!: UserDetail;
  userBasicDetail!: UpdateUserBasicDetails;

  parentOptions: ParentOptions[] = [];
  selectedParent!: ParentOptions | undefined;

  aadharNo: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{12}$')]);
  pan: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]);


  selectedTab: string = 'basic-details'

  ngOnInit(): void {
    this.fetchUserDetails();
    this.setActiveTab()
  }



  setActiveTab() {
    this.route.queryParams
      .pipe(takeUntil(this.$destroy),
        tap((param: Params) => {
          this.selectedTab = param['tab'];
        })).subscribe()
  }



  updateUserParentMapping() {
    console.log(this.selectedParent);
    if (this.selectedParent) {
      const updateUserMappingPayload: UpdateUserParentTypePayload = {
        userId: this.currentUserId,
        parentUserType: this.selectedParent.parentUserType,
        parentUser: this.selectedParent.parentUserId
      }

      this.usersService.updateUserParentDetails(updateUserMappingPayload).pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (updateResp: APIResponse) => {
            console.log(updateResp);
            if (updateResp.code === 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User details updated successfully.', life: 3000 })
            }
          }
        })
    }
  }



  fetchUserDetails() {
    this.route.params
      .pipe(takeUntil(this.$destroy),
        tap((param: Params) => console.log(param)),
        switchMap((param: Params) => this.usersService.getUserDetails(+param['userId'])),
        tap((resp: APIResponse) => {
          console.log(resp);

          if (resp.code === 200) {
            this.userDetail = resp.data as UserDetail;
            // this.populateStateName();
            this.userBasicDetail = {
              userId: this.userDetail.userId,
              firstName: this.userDetail.firstName,
              middleName: this.userDetail.middleName,
              lastName: this.userDetail.lastName,
              gender: this.userDetail.gender,
              userType: this.userDetail.userType,
              dob: this.userDetail.dob,
              mobile: this.userDetail.mobile,
              emailId: this.userDetail.emailId,
              state: this.userDetail.state,
              district: this.userDetail.district,
              pin: this.userDetail.pin,
              address: this.userDetail.address,
              employeeid: '',
              userOrganization: 0
            }
            // console.log(this.userBasicDetail);
            this.currentUserId = this.userDetail.userId;
            this.currentUserType = this.userDetail.userType;

            this.aadharNo.setValue(this.userDetail.aadharNo);
            this.pan.setValue(this.userDetail.pan)

            this.fetchParentTypesForCurrentUserType(this.userDetail.userType);

          }
        }))
      .subscribe()
  }



  fetchParentTypesForCurrentUserType(userType: number) {
    this.usersService.getParentUserType(userType).pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.code === 200) {
            this.parentOptions = (resp.data as ParentUserTypeForMapping[])
              .map((curr: ParentUserTypeForMapping) => ({ ...curr, optionLabel: `${curr.parentFirstName} ${curr.parentMiddleName} ${curr.parentLastName} (${curr.parentUserTypeName})` }))

            if (this.userDetail.parentUserId > 0) {
              // set selectedParent as the user is already mapped to parent

              this.selectedParent = this.parentOptions.find((curr: ParentOptions) => {
                return curr.parentUserId === this.userDetail.parentUserId
              })
            }
          }
        }
      })
  }



  onUpload(e: FileUploadHandlerEvent, type: string, element?: FileUpload) {
    const file = e.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const payload = {
        "userID": this.currentUserId,
        "documentType": type,
        "documentName": e.files[0].name,
        "documentNumber": "",
        "documentBase64data": reader.result
      }
      console.log(payload)
      this.usersService.uploadUserDocument(payload).pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse) => {
            if (resp.code === 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: `Document uploaded successfully.`, life: 3000 });
              element?.clear();
            }
          }
        })
    };
  }



  updateAadharPan(type: 'aadhar' | 'pan') {
    console.log(type);
    const payload: UpdateUserAadharPan = {
      userId: this.currentUserId,
      aadharNo: '',
      pan: '',
      type: type
    };

    if (type === 'aadhar') {
      payload.aadharNo = this.aadharNo.value;
    } else if (type === 'pan') {
      payload.pan = this.pan.value;
    }



    this.usersService.updateUserAadharPan(payload).pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse) => {
          if (resp.code === 200 && resp.data === 'S') {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${type} updated successfully.`, life: 3000 })
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `Update Failed!`, life: 3000 })
          }
        }
      })
  }

}
