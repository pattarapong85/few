import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';

import { SharedService } from 'src/app/common/shared.service';
import { ExcelService } from 'src/app/service/excel.service';

import { Globals } from 'src/app/common/globals';
import { MasterService } from 'src/app/service/master.service';
import { MiscComponent } from 'src/app/common/misc/misc.component';

import { ComponentRoutingModule } from './component-routing.module';
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
import { Fn90001Component } from './fn90001/fn90001.component';
import { Fn90002Component } from './fn90002/fn90002.component';
import { Fn90003Component } from './fn90003/fn90003.component';
import { Fn90004Component } from './fn90004/fn90004.component';
import { Fn90005Component } from './fn90005/fn90005.component';
import { Fn90006Component } from './fn90006/fn90006.component';
import { Fn90007Component } from './fn90007/fn90007.component';
import { Fn80001Component } from './fn80001/fn80001.component';
import { Fn80002Component } from './fn80002/fn80002.component';
import { Fn20001Component } from './fn20001/fn20001.component';
import { Fn50001Component } from './fn50001/fn50001.component';
import { Fn50002Component } from './fn50002/fn50002.component';
import { Fn20002Component } from './fn20002/fn20002.component';
import { Fn50003Component } from './fn50003/fn50003.component';
import { Fn50004Component } from './fn50004/fn50004.component';
import { Fn50005Component } from './fn50005/fn50005.component';
import { Fn50006Component } from './fn50006/fn50006.component';
import { Fn50007Component } from './fn50007/fn50007.component';
import { Fn20003Component } from './fn20003/fn20003.component';
import { Fn10011Component } from './fn10011/fn10011.component';
import { Fn10012Component } from './fn10012/fn10012.component';
import { Fn10010d01Component } from './fn10010d01/fn10010d01.component';
import { Fn10010d02Component } from './fn10010d02/fn10010d02.component';
import { Fn10010d03Component } from './fn10010d03/fn10010d03.component';
import { Fn90008Component } from './fn90008/fn90008.component';
import { Fn90009Component } from './fn90009/fn90009.component';
import { Fn90010Component } from './fn90010/fn90010.component';
import { Fn30001Component } from './fn30001/fn30001.component';
import { Fn40001Component } from './fn40001/fn40001.component';
import { Fn40010Component } from './fn40010/fn40010.component';
import { Fn30002Component } from './fn30002/fn30002.component';
import { Fn40020Component } from './fn40020/fn40020.component';
import { Fn66001Component } from './fn66001/fn66001.component';
import { Fn66002Component } from './fn66002/fn66002.component';
import { Fn66003Component } from './fn66003/fn66003.component';
import { Fn66004Component } from './fn66004/fn66004.component';
import { Fn66005Component } from './fn66005/fn66005.component';
import { Fn66006Component } from './fn66006/fn66006.component';


@NgModule({
  declarations: [Fn10001Component, 
    Fn10002Component, Fn90001Component, Fn90002Component, Fn90003Component, Fn90004Component, 
    Fn90005Component, Fn90006Component, Fn90007Component, Fn80001Component, Fn80002Component, 
    Fn50001Component, Fn50002Component, Fn20001Component, Fn20002Component, Fn10003Component, 
    Fn10004Component, Fn10005Component, Fn10006Component, Fn10007Component, Fn10008Component, 
    Fn10009Component, Fn10010Component, Fn50003Component, Fn50004Component, Fn50005Component, 
    Fn50006Component, Fn50007Component, Fn20003Component, Fn10011Component, Fn10012Component, Fn10010d01Component, Fn10010d02Component, Fn10010d03Component, Fn90008Component, Fn90009Component, Fn90010Component, Fn30001Component, Fn40001Component, Fn40010Component, Fn30002Component, Fn40020Component, Fn66001Component, Fn66002Component, Fn66003Component, Fn66004Component, Fn66005Component, Fn66006Component],
  imports: [
    CommonModule,ComponentRoutingModule,BrowserModule,HttpClientModule,CardModule,InputTextModule
    ,BrowserAnimationsModule,FieldsetModule,FormsModule,CalendarModule,StepsModule,
    TableModule,PanelModule,ButtonModule,ToolbarModule,MenuModule,TabViewModule,
    MessageModule,ProgressSpinnerModule,InputSwitchModule,ToggleButtonModule,
    InputTextareaModule,DropdownModule,DialogModule,MessagesModule,ToastModule,
    AutoCompleteModule,InputNumberModule,ConfirmDialogModule,FileUploadModule,
    RadioButtonModule,SelectButtonModule,AccordionModule,CheckboxModule
  ],
  providers: [Globals, MessageService, MiscComponent,MasterService,SharedService,ConfirmationService,
    ExcelService]
})
export class ComponentModule { }
