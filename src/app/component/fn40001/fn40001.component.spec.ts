import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn40001Component } from './fn40001.component';

describe('Fn40001Component', () => {
  let component: Fn40001Component;
  let fixture: ComponentFixture<Fn40001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn40001Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn40001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
