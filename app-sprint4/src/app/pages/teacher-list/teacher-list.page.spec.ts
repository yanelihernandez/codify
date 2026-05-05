import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherListPage } from './teacher-list.page';

describe('TeacherListPage', () => {
  let component: TeacherListPage;
  let fixture: ComponentFixture<TeacherListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
