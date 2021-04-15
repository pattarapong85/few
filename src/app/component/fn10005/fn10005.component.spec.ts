import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10005Component } from './fn10005.component';

describe('Fn10005Component', () => {
  let component: Fn10005Component;
  let fixture: ComponentFixture<Fn10005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10005Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
