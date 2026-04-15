import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDetailCard } from './teacher-detail-card';

describe('TeacherDetailCard', () => {
  let component: TeacherDetailCard;
  let fixture: ComponentFixture<TeacherDetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDetailCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherDetailCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
