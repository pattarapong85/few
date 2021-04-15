import { Component, OnInit, Output, EventEmitter ,ViewChild, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { System } from 'src/app/models/system';
import { SelectItem } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';

@Component({
  selector: 'app-fn90006',
  templateUrl: './fn90006.component.html',
  styleUrls: ['./fn90006.component.scss']
})
export class Fn90006Component implements OnInit {

  private subscriptions: Subscription[] = [];
    fncDialog: boolean;
    flagPrimaryKey : boolean;
    dataTable : any[];
    selectedRows: System[];
    newRow: System;
    submitted: boolean;
    cols: any[];

    constructor(
      private app : AppService,
      private misc: MiscComponent,
      private masterService : MasterService,
      private confirmationService: ConfirmationService) { }

    ngOnInit() {    
    this.getTableList();

    this.cols = [
        { field: 'CATEGORY', header: 'CATEGORY' },
        { field: 'SUB_CATEGORY', header: 'SUB_CATEGORY' },
        { field: 'CD', header: 'CD' },
        { field: 'VALUE', header: 'VALUE' },
        { field: 'REMARK', header: 'REMARK' },
        { field: 'PROJECT', header: 'PROJECT' }
      ];
    }

    openNew() {
        this.newRow = new System();
        this.submitted = false;
        this.fncDialog = true;
        this.flagPrimaryKey = false;
        this.newRow.REMARK = null;
    }

    hideDialog() {
        this.fncDialog = false;
        this.submitted = false;
    }

    edit(newRow: System) {
      this.newRow = {...newRow};
      this.fncDialog = true;
      this.flagPrimaryKey = true;
    }

    getTableList() {
      this.masterService.getDataSystem().snapshotChanges()
      .subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let e = <System>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          this.dataTable.push(e);
        }
        
      }, error => {
        console.log("ERROR",error);
      });
    }

    validateBeforeSave(newRow : System){
      if(newRow.CATEGORY == undefined && newRow.CATEGORY.trim().length == 0) {
        return false;
      }else if(newRow.SUB_CATEGORY != undefined && newRow.SUB_CATEGORY.trim().length == 0) {
        return false;
      }else if(newRow.CD != undefined && newRow.CD.trim().length == 0) {
        return false;
      }else{
        let ret = true;

        if (!this.newRow['KEY']) {
          this.dataTable.forEach(element => {
            if(element['HEAD_CD'] == newRow.CATEGORY && element['SUB_CATEGORY'] && element['CD']){
              this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีรหัสนี้ใช้แล้ว');
              ret = false;
            }
          });
        }

        return ret;
    }
  }
    
  save() {
    this.submitted = true;
    this.misc.progressSpinner(true);
    if (this.validateBeforeSave(this.newRow)) {
      this.newRow.PROJECT =this.app.getProject();
      if (this.newRow['KEY']) {
        let mst = Object.assign({}, this.newRow);
        delete mst['KEY'];
        delete mst['FLAG'];
        delete mst['createDateFmt'];
        this.masterService.updateSystem (this.newRow['KEY'],mst).catch(err => console.log(err));
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.hideDialog();
        this.misc.progressSpinner(false);
      }else{
        this.masterService.createSystem (this.newRow);
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.newRow = new System();
        this.hideDialog();
        this.misc.progressSpinner(false);
      } 
    }else{
      this.misc.progressSpinner(false);
    }
    
  }

  delete(newRow: System) {
    this.misc.progressSpinner(true);
    this.masterService.deleteSystem(newRow['KEY']).catch(err => console.log(err));
    this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
    this.misc.progressSpinner(false);
  }

  deleteSelected() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected data?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            for(let i=0;i<this.selectedRows.length;i++){
              this.masterService.deleteSystem(this.selectedRows[i]['KEY']).catch(err => console.log(err));
            }
            this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
            this.selectedRows = null;
        }
    });
  }
}
