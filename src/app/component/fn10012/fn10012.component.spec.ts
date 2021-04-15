import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10012Component } from './fn10012.component';

describe('Fn10012Component', () => {
  let component: Fn10012Component;
  let fixture: ComponentFixture<Fn10012Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10012Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10012Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
