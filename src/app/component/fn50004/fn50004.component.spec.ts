import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn50004Component } from './fn50004.component';

describe('Fn50004Component', () => {
  let component: Fn50004Component;
  let fixture: ComponentFixture<Fn50004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn50004Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn50004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
