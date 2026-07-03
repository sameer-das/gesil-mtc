import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedMyAttentionComponent } from './need-my-attention.component';

describe('NeedMyAttentionComponent', () => {
  let component: NeedMyAttentionComponent;
  let fixture: ComponentFixture<NeedMyAttentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedMyAttentionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedMyAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
