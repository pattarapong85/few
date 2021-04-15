import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn90001Component } from './fn90001.component';

describe('Fn90001Component', () => {
  let component: Fn90001Component;
  let fixture: ComponentFixture<Fn90001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn90001Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn90001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
