import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCompletenessCheckerComponent } from './data-completeness-checker.component';

describe('DataCompletenessCheckerComponent', () => {
  let component: DataCompletenessCheckerComponent;
  let fixture: ComponentFixture<DataCompletenessCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCompletenessCheckerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCompletenessCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
