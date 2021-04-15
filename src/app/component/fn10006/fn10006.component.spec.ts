import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn10006Component } from './fn10006.component';

describe('Fn10006Component', () => {
  let component: Fn10006Component;
  let fixture: ComponentFixture<Fn10006Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn10006Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn10006Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
