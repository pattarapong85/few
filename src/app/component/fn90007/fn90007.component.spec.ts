import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90007Component } from './fn90007.component';

describe('Fn90007Component', () => {
  let component: Fn90007Component;
  let fixture: ComponentFixture<Fn90007Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90007Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90007Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
