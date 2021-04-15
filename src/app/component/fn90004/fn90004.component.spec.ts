import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90004Component } from './fn90004.component';

describe('Fn90004Component', () => {
  let component: Fn90004Component;
  let fixture: ComponentFixture<Fn90004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90004Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
