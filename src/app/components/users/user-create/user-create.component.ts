import { NgClass } from '@angular/common';
import { Component, effect, inject, input, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { filter, first, forkJoin, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { APIResponse, ChildUserType, District, UserBasicDetails, State, UpdateUserBasicDetails } from '../../../models/user.model';
import { UsersService } from '../../../services/users.service';
import { PageHeaderComponent } from '../../utils/page-header/page-header.component';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';

@Component({
  selector: 'app-user-create',
  imports: [InputTextModule,
    SelectModule,
    TextareaModule,
    FluidModule,
    DatePickerModule,
    ButtonModule,
    FormsModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    NgClass],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
  providers: [UsersService]
})
export class UserCreateComponent implements OnInit {


  constructor() {
    effect(() => {
      if (this.editUser() && this.initialized()) {
        const state = this.states().find((curr: State) => this.editUser()?.state === curr.id);
        const currentUserType = this.childUserTypes().find((curr: ChildUserType) => this.editUser()?.userType === curr.childUserType);
        let district;
        if (state) {
          this.usersService.getDistrict(state.id)
            .pipe(takeUntil(this.destroy$),
              tap((districtResp: APIResponse<District[]>) => {
                if (districtResp.code === 200) {
                  district = (districtResp.data).find((curr: District) => curr.id === this.editUser()?.district);
                  this.patchUserFormForEdit(state, district, currentUserType);

                }
              }))
            .subscribe();
        }

      }
    })
  }


  currentLoggedUserType: number = +(localStorage.getItem('loginUserType') || 0);

  editMode = input(false);
  editUser = input<null | UpdateUserBasicDetails>(null);

  messageService = inject(MessageService);
  usersService = inject(UsersService);

  destroy$ = new Subject<null>();

  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    middleName: new FormControl('',),
    lastName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    userType: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),

    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    pin: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
    address: new FormControl('', [Validators.required]),

    mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    emailId: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]),
  })

  genders = [
    { name: 'Male', code: 'M' },
    { name: 'Female', code: 'F' },
    { name: 'Others', code: 'O' },
  ];

  childUserTypes = signal<ChildUserType[]>([]);
  states = signal<State[]>([]);
  districts = signal<District[]>([]);
  initialized = signal<boolean>(false);


  ngOnInit(): void {
    this.initialize();
    this.populateDistrictsAccordingToStateChange();
    console.log(this.editMode())
  }



  initialize() {
    forkJoin([
      this.usersService.getStates(),
      this.usersService.getChildrenUserType(this.currentLoggedUserType)
    ])
      .pipe(takeUntil(this.destroy$), tap(([statesResp, childrenTypeResp]) => {
        if (statesResp.code === 200 && childrenTypeResp.code === 200) {
          this.states.set(statesResp.data as State[]);
          this.childUserTypes.set(childrenTypeResp.data as ChildUserType[]);
          this.initialized.set(true);
        }
      }))
      .subscribe();
  }



  patchUserFormForEdit(currentState: State, currentDistrict: District | undefined, currentUserType: ChildUserType | undefined) {
    const gender = this.genders.find(curr => curr.code === this.editUser()?.gender);
    this.userForm.patchValue({
      firstName: this.editUser()?.firstName,
      middleName: this.editUser()?.middleName,
      lastName: this.editUser()?.lastName,
      userType: currentUserType,
      gender: gender,
      dob: new Date(this.editUser()?.dob as string),

      state: currentState,
      district: currentDistrict,
      pin: this.editUser()?.pin,
      address: this.editUser()?.address,

      mobile: this.editUser()?.mobile,
      emailId: this.editUser()?.emailId?.toLocaleLowerCase()
    })



  }



  onSaveUpdateUser() {
    if (this.editMode()) {
      this.updateUser()
    } else {
      this.saveNewUser()
    }
  }



  saveNewUser() {
    // console.log(this.userForm.value);
    const payload: UserBasicDetails = {
      firstName: this.userForm.value.firstName,
      middleName: this.userForm.value.middleName,
      lastName: this.userForm.value.lastName,
      gender: this.userForm.value.gender.code,
      dob: this.getDate(this.userForm.value.dob),
      mobile: this.userForm.value.mobile,
      emailId: this.userForm.value.emailId,
      state: +this.userForm.value.state.id,
      district: +this.userForm.value.district.id,
      address: this.userForm.value.address,
      pin: this.userForm.value.pin,
      userType: this.userForm.value.userType.childUserType,
      employeeid: '',
      userOrganization: 0
    }


    this.usersService.saveNewUserBasicDetails(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: APIResponse<string>) => {
          console.log(resp)
          if (resp.code === 200) {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'User added successfully.', life: MessageDuaraion.STANDARD })
            this.userForm.reset();
          }

        }
      })

  }



  updateUser() {
    const updateUserPayload: UpdateUserBasicDetails = {
      userId: this.editUser()?.userId,
      firstName: this.userForm.value.firstName,
      middleName: this.userForm.value.middleName,
      lastName: this.userForm.value.lastName,
      gender: this.userForm.value.gender.code,
      dob: this.getDate(this.userForm.value.dob),
      mobile: this.userForm.value.mobile,
      emailId: this.userForm.value.emailId,
      state: +this.userForm.value.state.id,
      district: +this.userForm.value.district.id,
      address: this.userForm.value.address,
      pin: this.userForm.value.pin,
      userType: this.userForm.value.userType.childUserType,
      employeeid: "",
      userOrganization: 0
    }

    console.log(updateUserPayload)

    this.usersService.updateUserBasicDetails(updateUserPayload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (updateResp: APIResponse<string>) => {
        console.log(updateResp);
        if (updateResp.code === 200) {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'User details updated successfully.', life: MessageDuaraion.STANDARD })
            // this.userForm.reset();
          }
      }
    })


  }



  populateDistrictsAccordingToStateChange() {
    this.userForm.get('state')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(state => !!state),
        switchMap((state: State) => this.usersService.getDistrict(state.id)),
        tap((distResp: APIResponse<District[]>) => {
          console.log(distResp)
          if (distResp.code === 200) {
            this.districts.set(distResp.data);
          } else {
            this.districts.set([]);
          }
        }),
      )
      .subscribe();
  }


  getDate(date: Date | string) {
    const d = new Date(date).getTime() + 19800000;
    return new Date(d).toISOString();
  }

}
