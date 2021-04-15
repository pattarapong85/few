import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10010Component } from './fn10010.component';

describe('Fn10010Component', () => {
  let component: Fn10010Component;
  let fixture: ComponentFixture<Fn10010Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10010Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10010Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
