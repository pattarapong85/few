import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90005Component } from './fn90005.component';

describe('Fn90005Component', () => {
  let component: Fn90005Component;
  let fixture: ComponentFixture<Fn90005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90005Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
