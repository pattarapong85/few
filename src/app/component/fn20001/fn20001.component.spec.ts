import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn20001Component } from './fn20001.component';

describe('Fn20001Component', () => {
  let component: Fn20001Component;
  let fixture: ComponentFixture<Fn20001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn20001Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn20001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
