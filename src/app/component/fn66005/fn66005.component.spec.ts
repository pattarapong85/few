import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn66005Component } from './fn66005.component';

describe('Fn66005Component', () => {
  let component: Fn66005Component;
  let fixture: ComponentFixture<Fn66005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn66005Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn66005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
