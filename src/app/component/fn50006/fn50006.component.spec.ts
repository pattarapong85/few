import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn50006Component } from './fn50006.component';

describe('Fn50006Component', () => {
  let component: Fn50006Component;
  let fixture: ComponentFixture<Fn50006Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn50006Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn50006Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
