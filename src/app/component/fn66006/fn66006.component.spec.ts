import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn66006Component } from './fn66006.component';

describe('Fn66006Component', () => {
  let component: Fn66006Component;
  let fixture: ComponentFixture<Fn66006Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn66006Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn66006Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
