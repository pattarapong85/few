import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90006Component } from './fn90006.component';

describe('Fn90006Component', () => {
  let component: Fn90006Component;
  let fixture: ComponentFixture<Fn90006Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90006Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90006Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
