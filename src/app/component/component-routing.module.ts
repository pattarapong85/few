import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Fn10001Component } from './fn10001/fn10001.component';
import { Fn10002Component } from './fn10002/fn10002.component';
import { Fn10003Component } from './fn10003/fn10003.component';
import { Fn10004Component } from './fn10004/fn10004.component';
import { Fn10005Component } from './fn10005/fn10005.component';
import { Fn10006Component } from './fn10006/fn10006.component';
import { Fn10007Component } from './fn10007/fn10007.component';
import { Fn10008Component } from './fn10008/fn10008.component';
import { Fn10009Component } from './fn10009/fn10009.component';
import { Fn10010Component } from './fn10010/fn10010.component';
import { Fn10010d01Component } from './fn10010d01/fn10010d01.component';
import { Fn10010d02Component } from './fn10010d02/fn10010d02.component';
import { Fn10010d03Component } from './fn10010d03/fn10010d03.component';
import { Fn10011Component } from './fn10011/fn10011.component';
import { Fn10012Component } from './fn10012/fn10012.component';
import { Fn20003Component } from './fn20003/fn20003.component';
import { Fn20002Component } from './fn20002/fn20002.component';
import { Fn20001Component } from './fn20001/fn20001.component';
import { Fn30001Component } from './fn30001/fn30001.component';
import { Fn30002Component } from './fn30002/fn30002.component';
import { Fn40001Component } from './fn40001/fn40001.component';
import { Fn40010Component } from './fn40010/fn40010.component';
import { Fn40020Component } from './fn40020/fn40020.component';
import { Fn50001Component } from './fn50001/fn50001.component';
import { Fn50002Component } from './fn50002/fn50002.component';
import { Fn50003Component } from './fn50003/fn50003.component';
import { Fn50004Component } from './fn50004/fn50004.component';
import { Fn50005Component } from './fn50005/fn50005.component';
import { Fn50006Component } from './fn50006/fn50006.component';
import { Fn50007Component } from './fn50007/fn50007.component';
import { Fn66001Component } from './fn66001/fn66001.component';
import { Fn66002Component } from './fn66002/fn66002.component';
import { Fn66003Component } from './fn66003/fn66003.component';
import { Fn66004Component } from './fn66004/fn66004.component';
import { Fn66005Component } from './fn66005/fn66005.component';
import { Fn66006Component } from './fn66006/fn66006.component';
import { Fn80001Component } from './fn80001/fn80001.component';
import { Fn80002Component } from './fn80002/fn80002.component';
import { Fn90001Component } from './fn90001/fn90001.component';
import { Fn90002Component } from './fn90002/fn90002.component';
import { Fn90003Component } from './fn90003/fn90003.component';
import { Fn90004Component } from './fn90004/fn90004.component';
import { Fn90005Component } from './fn90005/fn90005.component';
import { Fn90006Component } from './fn90006/fn90006.component';
import { Fn90007Component } from './fn90007/fn90007.component';
import { Fn90008Component } from './fn90008/fn90008.component';
import { Fn90009Component } from './fn90009/fn90009.component';
import { Fn90010Component } from './fn90010/fn90010.component';

const routes: Routes = [
  { path: 'fn10001', component: Fn10001Component },
  { path: 'fn10002', component: Fn10002Component },
  { path: 'fn10003', component: Fn10003Component },
  { path: 'fn10004', component: Fn10004Component },
  { path: 'fn10005', component: Fn10005Component },
  { path: 'fn10006', component: Fn10006Component },
  { path: 'fn10007', component: Fn10007Component },
  { path: 'fn10008', component: Fn10008Component },
  { path: 'fn10009', component: Fn10009Component },
  { path: 'fn10010', component: Fn10010Component },
  { path: 'fn10010d01/:key', component: Fn10010d01Component },
  { path: 'fn10010d02/:key', component: Fn10010d02Component },
  { path: 'fn10010d03/:key', component: Fn10010d03Component },
  { path: 'fn10011', component: Fn10011Component },
  { path: 'fn10012', component: Fn10012Component },
  { path: 'fn20001', component: Fn20001Component },
  { path: 'fn20002/:orderId', component: Fn20002Component },
  { path: 'fn20003/:orderId', component: Fn20003Component },
  { path: 'fn30001', component: Fn30001Component },
  { path: 'fn30002', component: Fn30002Component },
  { path: 'fn40001', component: Fn40001Component },
  { path: 'fn40010', component: Fn40010Component },
  { path: 'fn40020', component: Fn40020Component },
  { path: 'fn90001', component: Fn90001Component },
  { path: 'fn50001', component: Fn50001Component },
  { path: 'fn50002', component: Fn50002Component },
  { path: 'fn50003', component: Fn50003Component },
  { path: 'fn50004', component: Fn50004Component },
  { path: 'fn50005', component: Fn50005Component },
  { path: 'fn50006', component: Fn50006Component },
  { path: 'fn50007', component: Fn50007Component },
  { path: 'fn66001', component: Fn66001Component },
  { path: 'fn66002', component: Fn66002Component },
  { path: 'fn66003', component: Fn66003Component },
  { path: 'fn66004', component: Fn66004Component },
  { path: 'fn66005', component: Fn66005Component },
  { path: 'fn66006', component: Fn66006Component },
  { path: 'fn80001', component: Fn80001Component },
  { path: 'fn80002', component: Fn80002Component },
  { path: 'fn90002', component: Fn90002Component },
  { path: 'fn90003/:role', component: Fn90003Component },
  { path: 'fn90004', component: Fn90004Component },
  { path: 'fn90005/:user', component: Fn90005Component },
  { path: 'fn90006', component: Fn90006Component },
  { path: 'fn90007', component: Fn90007Component },
  { path: 'fn90008', component: Fn90008Component },
  { path: 'fn90009', component: Fn90009Component },
  { path: 'fn90010', component: Fn90010Component }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
