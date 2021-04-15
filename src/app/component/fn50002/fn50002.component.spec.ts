import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn50002Component } from './fn50002.component';

describe('Fn50002Component', () => {
  let component: Fn50002Component;
  let fixture: ComponentFixture<Fn50002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn50002Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn50002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
