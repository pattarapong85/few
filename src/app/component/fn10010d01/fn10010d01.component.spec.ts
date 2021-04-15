import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10010d01Component } from './fn10010d01.component';

describe('Fn10010d01Component', () => {
  let component: Fn10010d01Component;
  let fixture: ComponentFixture<Fn10010d01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10010d01Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10010d01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
