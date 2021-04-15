import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn30002Component } from './fn30002.component';

describe('Fn30002Component', () => {
  let component: Fn30002Component;
  let fixture: ComponentFixture<Fn30002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn30002Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn30002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
