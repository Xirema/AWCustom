import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStateRendererComponent } from './game-state-renderer.component';

describe('DataCompletenessCheckerComponent', () => {
  let component: GameStateRendererComponent;
  let fixture: ComponentFixture<GameStateRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStateRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStateRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
