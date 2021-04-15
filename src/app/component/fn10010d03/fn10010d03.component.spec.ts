import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10010d03Component } from './fn10010d03.component';

describe('Fn10010d03Component', () => {
  let component: Fn10010d03Component;
  let fixture: ComponentFixture<Fn10010d03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10010d03Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10010d03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
