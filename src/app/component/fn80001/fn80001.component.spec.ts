import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn80001Component } from './fn80001.component';

describe('Fn80001Component', () => {
  let component: Fn80001Component;
  let fixture: ComponentFixture<Fn80001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn80001Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn80001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
