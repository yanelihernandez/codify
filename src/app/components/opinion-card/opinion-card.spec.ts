import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionCard } from './opinion-card';

describe('OpinionCard', () => {
  let component: OpinionCard;
  let fixture: ComponentFixture<OpinionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpinionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
