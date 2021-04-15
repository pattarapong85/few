import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10002Component } from './fn10002.component';

describe('Fn10002Component', () => {
  let component: Fn10002Component;
  let fixture: ComponentFixture<Fn10002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10002Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
