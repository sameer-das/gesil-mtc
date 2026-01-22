import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, switchMap, takeUntil, tap, filter } from 'rxjs';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { APIResponse, ParentOptions, ParentUserTypeForMapping, Permissions, UpdatePermission, UpdateUserAadharPan, UpdateUserBasicDetails, UpdateUserParentTypePayload, UserDetail, UserListWithUserType, UserPermissions } from '../../../models/user.model';
import { UsersService } from '../../../services/users.service';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { UserCreateComponent } from "../user-create/user-create.component";
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';

export enum TABTYPE {
  BASIC_DETAIL = 'basic-details',
  DOCUMENTS = 'documents',
  REPORTING = 'reporting'
}

interface UserPermissionTable {
  featureId: number;
  featureName: string;
  isAllowed: boolean;
  mappingId: number;
}

@Component({
  selector: 'app-user-edit',
  imports: [PageHeaderComponent, UserCreateComponent,
    TabsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    FileUploadModule,
    DividerModule,
    ReactiveFormsModule,
    TooltipModule,
    RouterModule,
    TableModule, ToggleButtonModule],
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

  parentOptions: UserListWithUserType[] = [];
  selectedParent!: UserListWithUserType | undefined;

  aadharNo: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{12}$')]);
  pan: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]);

  selectedTab: string = 'basic-details';

  userPermission: UserPermissionTable[] = [];
  permissions: Permissions[] = [];

  ngOnInit(): void {
    this.fetchUserDetails();
    this.setActiveTab();
  }



  setActiveTab() {
    this.route.queryParams
      .pipe(takeUntil(this.$destroy),
        tap((param: Params) => {
          this.selectedTab = param['tab'];
        })).subscribe()
  }



  fetchUserPermissions() {
    this.usersService.getAllPermission()
      .pipe(
        takeUntil(this.$destroy),
        tap((resp: APIResponse<Permissions[]>) => { this.permissions = resp.data }),
        switchMap(_ => this.usersService.getFeatureMapping(this.userDetail.userId, 0)),
        tap((userPersmissionResp: APIResponse<UserPermissions[]>) => {
          this.userPermission = this.permissions.map((permission: Permissions) => {
            const existingPermission = userPersmissionResp.data.find((userPermission: UserPermissions) => userPermission.featureId === permission.featureId);

            return {
              featureId: permission.featureId,
              featureName: permission.feature,
              isAllowed: existingPermission?.mappingActive ?? false,
              mappingId: existingPermission?.mappingId ?? 0
            }
          })
          console.log(this.userPermission)
        })
      ).subscribe()
  }


  onPermissionChange(e: ToggleButtonChangeEvent, permission: UserPermissionTable) {
    const payload: UpdatePermission = {
      mappingId: permission.mappingId,
      userId: this.userDetail.userId,
      groupId: -1,
      featureId: permission.featureId,
      featureActive: permission.isAllowed
    }
    console.log(payload)

    this.usersService.updateFeatureMapping(payload)
      .pipe(takeUntil(this.$destroy),
        tap((resp: APIResponse<string>) => {
          if (resp.code === 200 && resp.data === 'S') {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: `Permission updated successfully.`, life: MessageDuaraion.STANDARD })
          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error', detail: `Permissioin Update Failed!`, life: MessageDuaraion.STANDARD })
          }
          this.fetchUserPermissions();
        }))
      .subscribe();
  }





  updateUserParentMapping() {
    console.log(this.selectedParent);
    if (this.selectedParent) {
      const updateUserMappingPayload: UpdateUserParentTypePayload = {
        userId: this.currentUserId,
        parentUserType: this.selectedParent.userType, // change this
        parentUser: this.selectedParent.userId
      }

      this.usersService.updateUserParentDetails(updateUserMappingPayload).pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (updateResp: APIResponse<string>) => {
            console.log(updateResp);
            if (updateResp.code === 200) {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'User details updated successfully.', life: MessageDuaraion.STANDARD })
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
        tap((resp: APIResponse<UserDetail>) => {
          console.log(resp);

          if (resp.code === 200) {
            this.userDetail = resp.data;
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

            this.fetchWholeUserList();
            this.fetchUserPermissions();

          }
        }))
      .subscribe()
  }



  // fetchParentTypesForCurrentUserType(userType: number) {
  //   this.usersService.getParentUserType(userType).pipe(takeUntil(this.$destroy))
  //     .subscribe({
  //       next: (resp: APIResponse<UserListWithUserType[]>) => {
  //         console.log(resp)
  //         if (resp.code === 200) {
  //           this.parentOptions = (resp.data)
  //             .map((curr: UserListWithUserType) => ({ ...curr, optionLabel: `${curr.parentFirstName} ${curr.parentMiddleName} ${curr.parentLastName} (${curr.parentUserTypeName})` }))

  //           if (this.userDetail.parentUserId > 0) {
  //             // set selectedParent as the user is already mapped to parent

  //             this.selectedParent = this.parentOptions.find((curr: ParentOptions) => {
  //               return curr.parentUserId === this.userDetail.parentUserId
  //             })
  //           }
  //         }
  //       }
  //     })
  // }



  fetchWholeUserList() {
    this.usersService.getUserWholeList(0, 0).pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<UserListWithUserType[]>) => {
          console.log(resp)
          if (resp.code === 200) {
            this.parentOptions = resp.data
              .filter(curr => curr.userId !== this.userDetail.userId)
              .map((curr) => ({ ...curr, optionLabel: `${curr.userName} (${curr.userTypeName})` }))


            if (this.userDetail.parentUserId > 0) {
              // set selectedParent as the user is already mapped to parent

              this.selectedParent = this.parentOptions.find((curr: UserListWithUserType) => {
                return curr.userId === this.userDetail.parentUserId
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
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200) {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: `Document uploaded successfully.`, life: MessageDuaraion.STANDARD });
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
        next: (resp: APIResponse<string>) => {
          if (resp.code === 200 && resp.data === 'S') {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: `User ${type} updated successfully.`, life: MessageDuaraion.STANDARD })
          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error', detail: `Update Failed!`, life: MessageDuaraion.STANDARD })
          }
        }
      })
  }

}
