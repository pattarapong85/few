import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { Role } from 'src/app/models/role';
import { SelectItem } from 'primeng/api';

import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { UserService } from 'src/app/service/user.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-fn90002',
  templateUrl: './fn90002.component.html',
  styleUrls: ['./fn90002.component.scss']
})
export class Fn90002Component implements OnInit {

  private subscriptions: Subscription[] = [];
    fncDialog: boolean;
    flagPrimaryKey : boolean;
    dataTable : any[];
    selectedRows: Role[];
    newRow: Role;
    submitted: boolean;
    statusList: SelectItem[];
    cols: any[];

    constructor(
      private app : AppService,
      private misc: MiscComponent,
      private router: Router,
      private userService : UserService,
      private confirmationService: ConfirmationService) { }

    ngOnInit() {    
    this.getTableList();
    this.statusList = this.app.getStatusFlag();

    this.cols = [
        { field: 'ROLE_CD', header: 'รหัสสิทธิ์' },
        { field: 'ROLE_NAME', header: 'ชื่อสิทธิ์การใช้งาน' }
    ];
    }

    openNew() {
        this.newRow = new Role();
        this.submitted = false;
        this.fncDialog = true;
        this.flagPrimaryKey = false;
    }

    onRowSelect(event) {
      this.router.navigate(['fn90003', event.data['ROLE_CD']]);
    }

    hideDialog() {
        this.fncDialog = false;
        this.submitted = false;
    }

    edit(newRow: Role) {
      this.newRow = {...newRow};
      this.fncDialog = true;
      this.flagPrimaryKey = true;
    }

    getTableList() {
      this.userService.getRoleList(this.app.getHead()).snapshotChanges()
      .subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let e = <Role>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          this.dataTable.push(e);
        }
        
      }, error => {
        console.log("ERROR",error);
      });
    }

    validateBeforeSave(newRow : Role){
      let ret = true;
      if (!this.newRow['KEY']) {
        this.dataTable.forEach(element => {
          if(element['ROLE_CD'] == newRow.ROLE_CD){
            this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีรหัสนี้ใช้แล้ว');
            ret = false;
          }
        });
      }

      return ret;
  }
    
  save() {
    this.submitted = true;
    this.misc.progressSpinner(true);
    if (this.validateBeforeSave(this.newRow)) {
      this.newRow.PROJECT = this.app.getProject();
      if (this.newRow['KEY']) {
        let mst = Object.assign({}, this.newRow);
        delete mst['KEY'];
        this.userService.updateRole(this.newRow['KEY'],mst).catch(err => console.log(err));
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.hideDialog();
        this.misc.progressSpinner(false);
      }else{
        this.newRow.HEAD_CD =  this.app.getHead();
        this.newRow.PROJECT = this.app.getProject();
        this.userService.createRole(this.newRow);
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.newRow = new Role();
        this.hideDialog();
        this.misc.progressSpinner(false);
      } 
    }else{
      this.misc.progressSpinner(false);
    }
    
  }

  delete(newRow: Role) {
    this.misc.progressSpinner(true);
    this.userService.deleteRole(newRow['KEY']).catch(err => console.log(err));
    this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
    this.misc.progressSpinner(false);
  }


}
