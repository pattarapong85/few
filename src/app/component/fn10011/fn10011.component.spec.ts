import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10011Component } from './fn10011.component';

describe('Fn10011Component', () => {
  let component: Fn10011Component;
  let fixture: ComponentFixture<Fn10011Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10011Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10011Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
