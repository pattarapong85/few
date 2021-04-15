import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { Role } from 'src/app/models/role';
import { RoleAccess } from 'src/app/models/role-access';
import { SelectItem } from 'primeng/api';

import { AppService } from 'src/app/service/app.service';
import { UserService } from 'src/app/service/user.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ComponentProject } from 'src/app/models/component-project';

@Component({
  selector: 'app-fn90003',
  templateUrl: './fn90003.component.html',
  styleUrls: ['./fn90003.component.scss']
})
export class Fn90003Component implements OnInit {

  private subscriptions: Subscription[] = [];
    flagPrimaryKey : boolean;
    dataTable : ComponentProject[];
    selectedRows: ComponentProject[];
    roleAccess : RoleAccess [];
    cols: any[];
    role : string;

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
        this.role = params['role'];
        this.getTableList(this.role);
      }));
    
    this.cols = [
        { field: 'COMPONENT_CD', header: 'รหัส' },
        { field: 'COM_CATEGORY_CD', header: 'ลักษณะ' },
        { field: 'COMPONENT_NAME', header: 'ชื่อ Component' }
    ];
    }

    getTableList(role) {
      this.app.getComponentList(this.app.getHead()).snapshotChanges().subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let e = <ComponentProject>item.payload.doc.data();
          e['KEY'] =item.payload.doc.id;
          this.dataTable.push(e); 
        }
        this.userService.getRoleAccesstList(role,this.app.getHead()).snapshotChanges().subscribe(response2 => {
          this.roleAccess = [];
          for (let item of response2) {
            let e2 = <RoleAccess>item.payload.doc.data();
            e2['KEY'] =item.payload.doc.id; 
            this.roleAccess.push(e2);
          }
          
          this.selectedRows = [];
          this.dataTable.forEach(comp => {
            this.roleAccess.forEach(roleAcc => {
              if(comp.COMPONENT_CD == roleAcc.COMPONENT_CD){
                this.selectedRows.push(comp);
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
    let comp = event.data;
    this.misc.progressSpinner(true);
    let roleacc: RoleAccess = new RoleAccess();
    roleacc.COMPONENT_CD = comp.COMPONENT_CD;
    roleacc.ROLE_CD = this.role;
    roleacc.HEAD_CD = this.app.getHead();
    roleacc.PROJECT = this.app.getProject();
    this.userService.createRoleAccess(roleacc);
    this.misc.progressSpinner(false);
  }

  onRowUnselect(event) {
    let comp = event.data;
    this.roleAccess.forEach(roleAcc => {
      if(comp.COMPONENT_CD == roleAcc.COMPONENT_CD){
        let key = roleAcc['KEY'];
        this.delete(key);
      }
    });
  }

    
  goBack() {
    this.location.back();
  }

  delete(key) {
    this.misc.progressSpinner(true);
    this.userService.deleteRoleAccess(key).catch(err => console.log(err));
    this.misc.progressSpinner(false);
  }


}
