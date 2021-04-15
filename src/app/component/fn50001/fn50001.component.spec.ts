import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn50001Component } from './fn50001.component';

describe('Fn50001Component', () => {
  let component: Fn50001Component;
  let fixture: ComponentFixture<Fn50001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn50001Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn50001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
