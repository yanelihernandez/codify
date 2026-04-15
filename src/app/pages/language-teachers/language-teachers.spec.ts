import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageTeachers } from './language-teachers';

describe('LanguageTeachers', () => {
  let component: LanguageTeachers;
  let fixture: ComponentFixture<LanguageTeachers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageTeachers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageTeachers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
