import { Component, OnInit, Output, EventEmitter ,ViewChild, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { Attribute } from 'src/app/models/attribute';
import { SelectItem } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';

@Component({
  selector: 'app-fn10008',
  templateUrl: './fn10008.component.html',
  styleUrls: ['./fn10008.component.scss']
})
export class Fn10008Component implements OnInit {

  private subscriptions: Subscription[] = [];
  fncDialog: boolean;
  flagPrimaryKey : boolean;
  dataTable : any[];
  selectedRows: Attribute[];
  newRow: Attribute;
  submitted: boolean;
  statusList: SelectItem[];
  cols: any[];

  codeAttdetail : String;
  valueAttdetail : String;

  constructor(
    private app : AppService,
    private misc: MiscComponent,
    private masterService : MasterService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {    
  this.getTableList();
  this.statusList = this.app.getStatusFlag();

  this.cols = [
      { field: 'CODE', header: 'รหัสคุณสมบัติ' },
      { field: 'VALUE', header: 'ชื่อคุณสมบัติ' },
      { field: 'DESC', header: 'อธิบาย' },
      { field: 'REMARK', header: 'หมายเหตุ' },
      { field: 'FLAG', header: 'สถานะ' },
      { field: 'createDateFmt', header: 'วันที่สร้าง' },
      { field: 'CREATE_BY', header: 'สร้างโดย' }
  ];
  }

  newAttribute(){
    let v = {
      CODE : this.codeAttdetail,
      VALUE : this.valueAttdetail
    }
    this.newRow.ATTRIBUTE_DETAIL.push(v);
    this.codeAttdetail = "";
    this.valueAttdetail = "";
  }

  deleteAttDetail(idx) {
    const index : number = this.newRow.ATTRIBUTE_DETAIL.indexOf(idx);
    if (index !== -1) {
      this.newRow.ATTRIBUTE_DETAIL.splice(index, 1);
    }        
}

  openNew() {
      this.newRow = new Attribute();
      this.newRow.ACTIVE_FLAG = 'Y';
      this.submitted = false;
      this.fncDialog = true;
      this.flagPrimaryKey = false;
  }

  hideDialog() {
      this.fncDialog = false;
      this.submitted = false;
  }

  edit(newRow: Attribute) {
    this.newRow = {...newRow};
    this.fncDialog = true;
    this.flagPrimaryKey = true;
  }

  getTableList() {
    this.masterService.getDataAttribute(this.app.getHead()).snapshotChanges()
    .subscribe(response => {
      this.dataTable = [];
      for (let item of response) {
        let e = <Attribute>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        e['FLAG'] = e.ACTIVE_FLAG == 'Y' ? 'เปิด' : 'ปิด';
        e['createDateFmt'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy");
        this.dataTable.push(e);
      }
      
    }, error => {
      console.log("ERROR",error);
    });
  }

  validateBeforeSave(newRow : Attribute){
    if(newRow.CODE != undefined && newRow.CODE.trim().length == 0) {
      return false;
    }else if(newRow.VALUE != undefined && newRow.VALUE.trim().length == 0) {
      return false;
    }else{
      let ret = true;
      if (!this.newRow['KEY']) {
        this.dataTable.forEach(element => {
          if(element['CODE'] == newRow.CODE){
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
    this.newRow.HEAD_CD = this.app.getHead();
    this.newRow.PROJECT = this.app.getProject();
    if (this.newRow['KEY']) {
      this.newRow.UPDATE_DATE = firestore.Timestamp.now();
      this.newRow.UPDATE_BY = this.app.getUsername();
      let mst = Object.assign({}, this.newRow);
      delete mst['KEY'];
      delete mst['FLAG'];
      delete mst['createDateFmt'];
      this.masterService.updateAttribute (this.newRow['KEY'],mst).catch(err => console.log(err));
      this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
      this.hideDialog();
      this.misc.progressSpinner(false);
    }else{
      this.newRow.CREATE_DATE = firestore.Timestamp.now();
      this.newRow.CREATE_BY = this.app.getUsername();
      this.newRow.UPDATE_DATE = firestore.Timestamp.now();
      this.newRow.UPDATE_BY = this.app.getUsername();
      this.masterService.createAttribute(this.newRow);
      this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
      this.newRow = new Attribute();
      this.hideDialog();
      this.misc.progressSpinner(false);
    } 
  }else{
    this.misc.progressSpinner(false);
  }
  
}

delete(newRow: Attribute) {
  this.misc.progressSpinner(true);
  this.masterService.deleteAttribute(newRow['KEY']).catch(err => console.log(err));
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
            this.masterService.deleteAttribute(this.selectedRows[i]['KEY']).catch(err => console.log(err));
          }
          this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
          this.selectedRows = null;
      }
  });
}

}

