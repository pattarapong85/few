import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SliderModule } from 'primeng/slider';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SharedModule } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { FileUploadModule } from 'primeng/fileupload';
import { SlideMenuModule } from 'primeng/slidemenu';
import { MenuItem } from 'primeng/api';
import { ComponentModule } from './component/component.module';
import { InputTextareaModule } from 'primeng/inputtextarea';

//import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireStorageModule,AngularFireStorageReference,AngularFireUploadTask} from "@angular/fire/storage";
import { environment } from '../environments/environment';


import { Globals } from 'src/app/common/globals';
import { SharedService } from 'src/app/common/shared.service';
import { AuthInterceptor } from 'src/app/common/auth.interceptor';

import { LocalStorageService } from 'src/app/service/local-storage.service';
import { AppService } from 'src/app/service/app.service';
import { UserService } from 'src/app/service/user.service';


import { LoginComponent } from './page/common/login/login.component';
import { HomeComponent } from './page/common/home/home.component';
import { HeaderComponent } from './page/base/header/header.component';
import { FooterComponent } from './page/base/footer/footer.component';
import { MiscComponent } from './common/misc/misc.component';

import { HashLocationStrategy ,LocationStrategy} from '@angular/common';

const routes: Routes = [
 
];
@NgModule({
  declarations: [
    AppComponent,LoginComponent,HeaderComponent,FooterComponent,
    HomeComponent,MiscComponent
  ],
  imports: [
    BrowserModule,AppRoutingModule,TableModule,FormsModule,HttpClientModule,ToolbarModule,
    ButtonModule,SplitButtonModule,SliderModule,FieldsetModule,PanelModule,CardModule,
    DialogModule,BrowserAnimationsModule,InputTextModule,MenuModule,ConfirmDialogModule,
    SharedModule,MenubarModule,ProgressSpinnerModule,InputSwitchModule
    ,ToggleButtonModule,ToastModule,InputTextareaModule,
    FileUploadModule,ComponentModule,
    AngularFireStorageModule,
    AngularFirestoreModule,AngularFireModule.initializeApp(environment.firebase),AngularFireDatabaseModule, // for database
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [{provide : LocationStrategy , useClass: HashLocationStrategy},
    Globals,UserService,
    LocalStorageService,
    AppService,
    MiscComponent,
    MessageService,
    MessageModule,
  SharedService,ConfirmationService,DatePipe,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
