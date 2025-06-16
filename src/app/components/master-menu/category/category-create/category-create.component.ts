import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, take, takeUntil } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Category, CreateUpdateCategory } from '../../../../models/master-data.model';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { SubCategoryListComponent } from "../sub-category-list/sub-category-list.component";

@Component({
  selector: 'app-category-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, ButtonModule, InputTextModule, RouterModule, SubCategoryListComponent],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss'
})
export class CategoryCreateComponent implements OnInit, OnDestroy {

  categoryId = input<number | undefined>();
  editMode = computed(() => !!this.categoryId());
  categoryDetail: Category | undefined;

  $destroy: Subject<null> = new Subject();

  categoryForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', [Validators.required])
  });

  private messageService: MessageService = inject(MessageService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private masterDataService: MasterDataService = inject(MasterDataService);


  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    if (this.editMode()) {
      this.masterDataService.categoryDetail(this.categoryId()!)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<Category>) => {
            if (resp.code === 200 && resp.data) {
              this.categoryDetail = resp.data;
              this.categoryForm.patchValue({ categoryName: resp.data.categoryName }, { emitEvent: false });
            } else {
              this.categoryForm.patchValue({ categoryName: '' }, { emitEvent: false });
            }
          }
        })
    }
  }


  onSaveCategory() {
    if (!this.editMode()) {
      // Create Mode
      const categoryCreate: CreateUpdateCategory = {
        categoryName: this.categoryForm.value.categoryName.trim()
      }
      this.masterDataService.createCategory(categoryCreate)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Category created successfully.', life: MessageDuaraion.STANDARD });
              this.categoryForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Category creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    } else {
      // Edit Mode
      const categoryUpdatePayload: CreateUpdateCategory = {
        categoryId: this.categoryId() ?? 0,
        categoryName: this.categoryForm.value.categoryName.trim()
      }

      this.masterDataService.updateCategory(categoryUpdatePayload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              
              if (this.categoryDetail)
                this.categoryDetail['categoryName'] = this.categoryForm.value.categoryName.trim();

              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Category updated successfully.', life: MessageDuaraion.STANDARD });
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Category update failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
  }




}
