import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { User } from 'src/app/models/user';
import { SelectItem } from 'primeng/api';

import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { UserService } from 'src/app/service/user.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-fn90004',
  templateUrl: './fn90004.component.html',
  styleUrls: ['./fn90004.component.scss']
})
export class Fn90004Component implements OnInit {

  private subscriptions: Subscription[] = [];
    fncDialog: boolean;
    flagPrimaryKey : boolean;
    dataTable : any[];
    selectedRows: User[];
    newRow: User;
    submitted: boolean;
    statusList: SelectItem[];
    cols: any[];

    constructor(
      private app : AppService,
      private misc: MiscComponent,
      private userService : UserService,
      private router: Router,
      private confirmationService: ConfirmationService) { }

    ngOnInit() {    
    this.getTableList();
    this.statusList = this.app.getStatusFlag();

    this.cols = [
        { field: 'USERNAME', header: 'รหัสผู้ใช้งานโปรแกรม' },
        { field: 'PASSWORD', header: 'พาสเวิส' }
    ];
    }

    onRowSelect(event) {
      this.router.navigate(['fn90005', event.data['USERNAME']]);
    }

    openNew() {
        this.newRow = new User();
        this.submitted = false;
        this.fncDialog = true;
        this.flagPrimaryKey = false;
    }

    hideDialog() {
        this.fncDialog = false;
        this.submitted = false;
    }

    edit(newRow: User) {
      this.newRow = {...newRow};
      this.fncDialog = true;
      this.flagPrimaryKey = true;
    }

    getTableList() {
      
      this.userService.getUserList(this.app.getHead()).snapshotChanges()
      .subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let e = <User>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          this.dataTable.push(e);
        }
        
      }, error => {
        console.log("ERROR",error);
      });
    }

    validateBeforeSave(newRow : User){
      let ret = true;
      if (!this.newRow['KEY']) {
        this.dataTable.forEach(element => {
          if(element['USERNAME'] == newRow.USERNAME){
            this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีรหัสนี้ใช้แล้ว');
            ret = false;
          }
        });
      }

      return ret;
  }
    
  async save() {
    this.submitted = true;
    this.misc.progressSpinner(true);
    if (this.validateBeforeSave(this.newRow)) {
      this.newRow.PROJECT = this.app.getProject();
      if (this.newRow['KEY']) {
        let mst = Object.assign({}, this.newRow);
        delete mst['KEY'];
        this.userService.updateUser(this.newRow['KEY'],mst).catch(err => console.log(err));
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.hideDialog();
        this.misc.progressSpinner(false);
      }else{
        var db = firebase.firestore();
        const query = await db.collection(this.app.DB.EMPLOYEE).where('EMP_NO', '==', this.newRow.USERNAME).get();
         if (!query.empty) {
          this.newRow.HEAD_CD =  this.app.getHead();
          this.newRow.PROJECT = this.app.getProject();
          this.userService.createUser(this.newRow);
          this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
          this.newRow = new User();
        } else {
          // not found
          this.misc.newMsgPosition('tc','e', 'Error', 'ไม่มีรหัสพนักงานนี้');
        }
        this.hideDialog();
        this.misc.progressSpinner(false);
      } 
    }else{
      this.misc.progressSpinner(false);
    } 
  }

  delete(newRow: User) {
    this.misc.progressSpinner(true);
    this.userService.deleteUser(newRow['KEY']).catch(err => console.log(err));
    this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
    this.misc.progressSpinner(false);
  }

}
