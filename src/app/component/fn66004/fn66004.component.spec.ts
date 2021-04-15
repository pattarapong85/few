import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn66004Component } from './fn66004.component';

describe('Fn66004Component', () => {
  let component: Fn66004Component;
  let fixture: ComponentFixture<Fn66004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn66004Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn66004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
