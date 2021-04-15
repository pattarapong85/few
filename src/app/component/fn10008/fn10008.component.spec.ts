import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10008Component } from './fn10008.component';

describe('Fn10008Component', () => {
  let component: Fn10008Component;
  let fixture: ComponentFixture<Fn10008Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10008Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10008Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
