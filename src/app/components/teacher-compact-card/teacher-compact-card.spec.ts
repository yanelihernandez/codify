import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCompactCard } from './teacher-compact-card';

describe('TeacherCompactCard', () => {
  let component: TeacherCompactCard;
  let fixture: ComponentFixture<TeacherCompactCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCompactCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCompactCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
