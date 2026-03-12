import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDemandAmountComponent } from './add-update-demand-amount.component';

describe('AddUpdateDemandAmountComponent', () => {
  let component: AddUpdateDemandAmountComponent;
  let fixture: ComponentFixture<AddUpdateDemandAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateDemandAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateDemandAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
