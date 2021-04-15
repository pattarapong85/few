import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn20003Component } from './fn20003.component';

describe('Fn20003Component', () => {
  let component: Fn20003Component;
  let fixture: ComponentFixture<Fn20003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn20003Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn20003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
