import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModUploaderComponent } from './mod-uploader.component';

describe('ModUploaderComponent', () => {
  let component: ModUploaderComponent;
  let fixture: ComponentFixture<ModUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
