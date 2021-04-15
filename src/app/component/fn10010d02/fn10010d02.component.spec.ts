import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10010d02Component } from './fn10010d02.component';

describe('Fn10010d02Component', () => {
  let component: Fn10010d02Component;
  let fixture: ComponentFixture<Fn10010d02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10010d02Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10010d02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
