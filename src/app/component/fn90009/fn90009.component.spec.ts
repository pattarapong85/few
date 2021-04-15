import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90009Component } from './fn90009.component';

describe('Fn90009Component', () => {
  let component: Fn90009Component;
  let fixture: ComponentFixture<Fn90009Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90009Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90009Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
