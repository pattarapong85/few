import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn40010Component } from './fn40010.component';

describe('Fn40010Component', () => {
  let component: Fn40010Component;
  let fixture: ComponentFixture<Fn40010Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn40010Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn40010Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
