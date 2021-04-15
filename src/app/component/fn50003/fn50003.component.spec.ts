import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn50003Component } from './fn50003.component';

describe('Fn50003Component', () => {
  let component: Fn50003Component;
  let fixture: ComponentFixture<Fn50003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn50003Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn50003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
