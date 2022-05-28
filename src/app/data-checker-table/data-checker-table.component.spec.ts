import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCheckerTableComponent } from './data-checker-table.component';

describe('DataCheckerTableComponent', () => {
  let component: DataCheckerTableComponent;
  let fixture: ComponentFixture<DataCheckerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCheckerTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCheckerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
