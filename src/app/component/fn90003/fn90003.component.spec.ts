import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90003Component } from './fn90003.component';

describe('Fn90003Component', () => {
  let component: Fn90003Component;
  let fixture: ComponentFixture<Fn90003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90003Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
