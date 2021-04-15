import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90008Component } from './fn90008.component';

describe('Fn90008Component', () => {
  let component: Fn90008Component;
  let fixture: ComponentFixture<Fn90008Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90008Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90008Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
