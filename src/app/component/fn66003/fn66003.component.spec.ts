import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn66003Component } from './fn66003.component';

describe('Fn66003Component', () => {
  let component: Fn66003Component;
  let fixture: ComponentFixture<Fn66003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn66003Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn66003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
