import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10009Component } from './fn10009.component';

describe('Fn10009Component', () => {
  let component: Fn10009Component;
  let fixture: ComponentFixture<Fn10009Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10009Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10009Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
