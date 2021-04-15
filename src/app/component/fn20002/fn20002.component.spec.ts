import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn20002Component } from './fn20002.component';

describe('Fn20002Component', () => {
  let component: Fn20002Component;
  let fixture: ComponentFixture<Fn20002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn20002Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn20002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
