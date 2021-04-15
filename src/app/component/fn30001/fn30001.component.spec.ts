import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn30001Component } from './fn30001.component';

describe('Fn30001Component', () => {
  let component: Fn30001Component;
  let fixture: ComponentFixture<Fn30001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn30001Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn30001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
