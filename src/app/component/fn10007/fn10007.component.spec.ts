import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10007Component } from './fn10007.component';

describe('Fn10007Component', () => {
  let component: Fn10007Component;
  let fixture: ComponentFixture<Fn10007Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10007Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10007Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
