import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn66001Component } from './fn66001.component';

describe('Fn66001Component', () => {
  let component: Fn66001Component;
  let fixture: ComponentFixture<Fn66001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn66001Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn66001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
