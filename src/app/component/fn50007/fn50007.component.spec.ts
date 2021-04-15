import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn50007Component } from './fn50007.component';

describe('Fn50007Component', () => {
  let component: Fn50007Component;
  let fixture: ComponentFixture<Fn50007Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn50007Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn50007Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
