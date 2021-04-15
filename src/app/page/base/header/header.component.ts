import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Subscription } from 'rxjs';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { AppComponent } from 'src/app/app.component';
import { AppService } from 'src/app/service/app.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { ComponentProject } from 'src/app/models/component-project';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private appComp: AppComponent,
    private app: AppService,
    private userService: UserService, 
    private cookieService : CookieService,
    private misc: MiscComponent,
    
    private router: Router) { }

  items: MenuItem[];
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.misc.clearMessage(1000);
    //let localStorage = this.app.localStorageService();
    //let globals = localStorage.getLocalStorage();
    //let g = this.appComp.getGlobals();
    if(this.cookieService.get(this.app.USERNAME) != undefined){
      let u = new User();
      u.USERNAME = this.app.getUsername();
      u.HEAD_CD = this.app.getHead();
      u.PROJECT = this.app.getProject();
      this.app.getRoleUserList(u).subscribe(userRole => {
        let role = [];
        userRole.forEach(e => {role.push(e.ROLE_CD)});
        this.app.getRoleAccessList(role,this.app.getHead(),this.app.getProject()).subscribe(access => {
          let menuType = [];
          let submenu = [];
          const uniqueCompcode = [...new Set(access.map(item => item.COMPONENT_CD))];
            this.app.getComponentList(this.app.getHead()).snapshotChanges().subscribe(response => {
              let  component : ComponentProject [] = [];
              component = [];
              for (let item of response) {
                let e = <ComponentProject>item.payload.doc.data();
                component.push(e);
              }

              menuType = [];
              submenu = [];
              component.forEach(comp => {
                uniqueCompcode.forEach(acc => {
                  if(acc == comp.COMPONENT_CD){
                    if(comp.FLAG_LEVEL == 1){
                      menuType.push(comp);
                    }else if(comp.FLAG_LEVEL == 2){
                      submenu.push(comp);
                    }
                  }
                });
              });

              let items = [];
              let i = 0;
              
              menuType.forEach(e => {
                let subItems = [];
                let j = 0;
                submenu.forEach(s => {
                    if(e['COMPONENT_CD'] == s['PARENT']){
                      
                        subItems[j] = { label: s['COMPONENT_NAME'] + " ", icon: s['ICONS'], routerLink: s['COMPONENT_CD'] }
                        j++;
                    }
                });
                items[i] = { label: e['COMPONENT_NAME'] + " " ,items: subItems}
                i++;
              });
              this.items = items;
              this.appComp.setShowHeader(true);
              
            }, error => {
              console.log("ERROR",error);
            });
        });
      });
    }
    }

    logout() {
      this.misc.progressSpinner(true);
      //this.app.localStorageService().deleteLocalStorage();
      //this.app.getGlobals().token = "";
      this.cookieService.set(this.app.USERNAME,"",0);
      this.cookieService.set(this.app.HEAD,"",0);
      this.cookieService.set(this.app.PROJECT,'',0);
      this.router.navigate(['']);
      this.cookieService.deleteAll();
      this.misc.progressSpinner(false);
    }
}
