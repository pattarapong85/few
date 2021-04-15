import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn80002Component } from './fn80002.component';

describe('Fn80002Component', () => {
  let component: Fn80002Component;
  let fixture: ComponentFixture<Fn80002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn80002Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn80002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
