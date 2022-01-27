import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnbookComponent } from './learnbook.component';

describe('LearnbookComponent', () => {
  let component: LearnbookComponent;
  let fixture: ComponentFixture<LearnbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnbookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
