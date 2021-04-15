import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10003Component } from './fn10003.component';

describe('Fn10003Component', () => {
  let component: Fn10003Component;
  let fixture: ComponentFixture<Fn10003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10003Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
