import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { Role } from 'src/app/models/role';
import { RoleUser } from 'src/app/models/role-user';

import { AppService } from 'src/app/service/app.service';
import { UserService } from 'src/app/service/user.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-fn90005',
  templateUrl: './fn90005.component.html',
  styleUrls: ['./fn90005.component.scss']
})
export class Fn90005Component implements OnInit {

  private subscriptions: Subscription[] = [];
    flagPrimaryKey : boolean;
    dataTable : Role[];
    selectedRows: Role[];
    roleUser : RoleUser [];
    cols: any[];
    userName : String;

    constructor(
      private app : AppService,
      private misc: MiscComponent,
      private router: Router,
      private location: Location,
      private route: ActivatedRoute,
      private userService : UserService,
      private confirmationService: ConfirmationService) { }

    ngOnInit() {    
      this.subscriptions.push(this.route.params.subscribe(params => {
        this.userName = params['user'];
        this.getTableList(this.userName);
      }));
    
    this.cols = [
        { field: 'ROLE_CD', header: 'รหัสสิทธิ์' },
        { field: 'ROLE_NAME', header: 'ชื่อสิทธิ์การใช้งาน' }
    ];
    }

    getTableList(usrName) {
      this.userService.getRoleList(this.app.getHead()).snapshotChanges().subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let e = <Role>item.payload.doc.data();
          e['KEY'] =item.payload.doc.id;
          this.dataTable.push(e); 
        }
        this.userService.getRoleUserList(usrName,this.app.getHead()).snapshotChanges().subscribe(response2 => {
          this.roleUser = [];
          for (let item of response2) {
            let e2 = <RoleUser>item.payload.doc.data();
            e2['KEY'] =item.payload.doc.id; 
            this.roleUser.push(e2);
          }
          
          this.selectedRows = [];
          this.dataTable.forEach(role => {
            this.roleUser.forEach(u => {
              if(role.ROLE_CD == u.ROLE_CD){
                this.selectedRows.push(role);
              }
            });
          });
          
        }, error => {
          console.log("ERROR",error);
          this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'ระบบผิดพลาดบางอย่าง');
        });
    }, error => {
      console.log("ERROR",error);
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'ระบบผิดพลาดบางอย่าง');
    });
  }

  onRowSelect(event) {
    let role = event.data;
    this.misc.progressSpinner(true);
    let roleUser: RoleUser = new RoleUser();
    roleUser.ROLE_CD = role.ROLE_CD;
    roleUser.USERNAME = this.userName;
    roleUser.HEAD_CD = this.app.getHead();
    roleUser.PROJECT = this.app.getProject();
    this.userService.createRoleUser(roleUser);
    this.misc.progressSpinner(false);
  }

  onRowUnselect(event) {
    let role = event.data;
    this.roleUser.forEach(u => {
      if(role.ROLE_CD == u.ROLE_CD){
        let key = u['KEY'];
        this.delete(key);
      }
    });
  }

    
  goBack() {
    this.location.back();
  }

  delete(key) {
    this.misc.progressSpinner(true);
    this.userService.deleteRoleUser(key).catch(err => console.log(err));
    this.misc.progressSpinner(false);
  }

}
