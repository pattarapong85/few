import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn50005Component } from './fn50005.component';

describe('Fn50005Component', () => {
  let component: Fn50005Component;
  let fixture: ComponentFixture<Fn50005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn50005Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn50005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
