import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherDetailPage } from './teacher-detail.page';

describe('TeacherDetailPage', () => {
  let component: TeacherDetailPage;
  let fixture: ComponentFixture<TeacherDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
