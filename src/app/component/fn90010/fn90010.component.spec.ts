import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90010Component } from './fn90010.component';

describe('Fn90010Component', () => {
  let component: Fn90010Component;
  let fixture: ComponentFixture<Fn90010Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90010Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90010Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
