import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fn66002Component } from './fn66002.component';

describe('Fn66002Component', () => {
  let component: Fn66002Component;
  let fixture: ComponentFixture<Fn66002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fn66002Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fn66002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
