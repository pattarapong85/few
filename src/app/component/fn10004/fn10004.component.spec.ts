import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10004Component } from './fn10004.component';

describe('Fn10004Component', () => {
  let component: Fn10004Component;
  let fixture: ComponentFixture<Fn10004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10004Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
