import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { SelectModule } from 'primeng/select';
import { Category, CreateUpdateSubCategory, SubCategory } from '../../../../models/master-data.model';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MasterDataService } from '../../../../services/master-data.service';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';

@Component({
  selector: 'app-sub-category-create',
  imports: [PageHeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule],
  templateUrl: './sub-category-create.component.html',
  styleUrl: './sub-category-create.component.scss'
})
export class SubCategoryCreateComponent implements OnInit, OnDestroy {


  subCategoryId = input<number | undefined>();
  editMode = computed(() => !!this.subCategoryId());
  $destroy: Subject<null> = new Subject();

  categories: Category[] = [];
  subCategoryDetail!: SubCategory;

  subCategoryForm: FormGroup = new FormGroup({
    subCategoryName: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    taxAmountPerMonth: new FormControl('', [Validators.required, Validators.pattern(/^\d{1,6}(\.\d{1,2})?$/)]),
  })


  private masterDataService: MasterDataService = inject(MasterDataService);
  private messageService: MessageService = inject(MessageService);
  private route: ActivatedRoute = inject(ActivatedRoute);


  ngOnDestroy(): void {
    this.$destroy.next(null);
  }



  ngOnInit(): void {
    if (!this.editMode()) {
      // Create Mode
      this.masterDataService.categoryList()
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<{ categories: Category[], totalCount: number }>) => {
            if (resp.code === 200) {
              this.categories = resp.data.categories;
              const preSelectCategoryId = this.route.snapshot.queryParams?.['catId'];

              if (preSelectCategoryId) {
                const founCat = resp.data.categories.find(z => z.categoryId === +preSelectCategoryId);
                this.subCategoryForm.patchValue({ category: founCat }, { emitEvent: false });
              }
            }
          }
        })
    } else {
      // Edit Mode
      forkJoin([
        this.masterDataService.categoryList(),
        this.masterDataService.subCategoryDetail(this.subCategoryId()!)
      ]).pipe(takeUntil(this.$destroy))
        .subscribe({
          next: ([catResp, subCatResp]) => {
            if (subCatResp.code == 200 &&
              subCatResp.data &&
              catResp.code === 200 &&
              catResp.data.categories.length > 0) {
              this.subCategoryDetail = subCatResp.data;
              this.categories = catResp.data.categories;
              const foundCategory = catResp.data.categories.find((cat: Category) => cat.categoryId === subCatResp.data.categoryId);

              this.subCategoryForm.patchValue(
                {
                  subCategoryName: subCatResp.data.subCategoryName,
                  taxAmountPerMonth: subCatResp.data.taxAmountPerMonth,
                  category: foundCategory
                }, { emitEvent: false })
            }
          }
        })
    }
  }



  onSaveSubCategory() {
    console.log(this.subCategoryForm.value)
    if (!this.editMode()) {
      // Create Mode
      const createSubCategoryPayload: CreateUpdateSubCategory = {
        subCategoryName: this.subCategoryForm.value.subCategoryName.trim(),
        categoryId: this.subCategoryForm.value.category['categoryId'],
        taxAmountPerMonth: this.subCategoryForm.value.taxAmountPerMonth
      }

      this.masterDataService.createSubCategory(createSubCategoryPayload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Sub Category created successfully.', life: MessageDuaraion.STANDARD });
              this.subCategoryForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Sub Category creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    } else {
      // Edit Mode
      const updateSubCategoryPayload: CreateUpdateSubCategory = {
        subCategoryId: +this.subCategoryId()!,
        subCategoryName: this.subCategoryForm.value.subCategoryName.trim(),
        categoryId: this.subCategoryForm.value.category['categoryId'],
        taxAmountPerMonth: this.subCategoryForm.value.taxAmountPerMonth
      }

      this.masterDataService.updateSubCategory(updateSubCategoryPayload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Sub Category updated successfully.', life: MessageDuaraion.STANDARD });
              this.subCategoryForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Sub Category update failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
  }

}
