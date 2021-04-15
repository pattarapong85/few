import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn40020Component } from './fn40020.component';

describe('Fn40020Component', () => {
  let component: Fn40020Component;
  let fixture: ComponentFixture<Fn40020Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn40020Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn40020Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
