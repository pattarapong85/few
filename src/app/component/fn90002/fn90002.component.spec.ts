import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90002Component } from './fn90002.component';

describe('Fn90002Component', () => {
  let component: Fn90002Component;
  let fixture: ComponentFixture<Fn90002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90002Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
