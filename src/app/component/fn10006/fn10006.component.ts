import { Component, OnInit, Output, EventEmitter ,ViewChild, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { Dropdown } from 'src/app/models/dropdown';
import { SelectItem } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';

@Component({
  selector: 'app-fn10006',
  templateUrl: './fn10006.component.html',
  styleUrls: ['./fn10006.component.scss']
})
export class Fn10006Component implements OnInit {

  private subscriptions: Subscription[] = [];
  fncDialog: boolean;
  flagPrimaryKey : boolean;
  dataTable : any[];
  selectedRows: Dropdown[];
  newRow: Dropdown;
  submitted: boolean;
  statusList: SelectItem[];
  cols: any[];

  checked: boolean = false;

  constructor(
    private app : AppService,
    private misc: MiscComponent,
    private masterService : MasterService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {    
  this.getTableList();
  this.statusList = this.app.getStatusFlag();

  this.cols = [
      { field: 'CD', header: 'รหัสทักษะการขาย' },
      { field: 'VALUE', header: 'ชื่อทักษะการขาย' },
      { field: 'DESC', header: 'อธิบาย' },
      { field: 'REMARK', header: 'หมายเหตุ' },
      { field: 'FLAG', header: 'สถานะ' },
      { field: 'ATT_05', header: 'ค่าเริ่มต้น' },
      { field: 'CREATE_DATE_FMT', header: 'วันที่สร้าง' },
      { field: 'CREATE_BY', header: 'สร้างโดย' }
  ];
  }

  openNew() {
      this.newRow = new Dropdown();
      this.newRow.ACTIVE_FLAG = 'Y';
      this.submitted = false;
      this.fncDialog = true;
      this.flagPrimaryKey = false;
      this.checked = false;
  }

  hideDialog() {
      this.fncDialog = false;
      this.submitted = false;
  }

  edit(newRow: Dropdown) {
    this.newRow = {...newRow};
    if(this.newRow.ATT_05 != null && this.newRow.ATT_05 == 'Y'){
      this.checked = true;
    }else{
      this.checked = false;
    }
    
    this.fncDialog = true;
    this.flagPrimaryKey = true;
  }

  getTableList() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_SKILL;
    this.masterService.getDataDropDown(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      this.dataTable = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        e['FLAG'] = e.ACTIVE_FLAG == 'Y' ? 'เปิด' : 'ปิด';
        e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy");
        this.dataTable.push(e);
      }
      
    }, error => {
      console.log("ERROR",error);
    });
  }

  checkDuplicate(cd){
    let r : boolean = false;
    for (let index = 0; index < this.dataTable.length; index++) {
      let element = this.dataTable[index];
      if(element.CD == cd){
        r = true;
      } 
    }
    return r;
  }

  validateBeforeSave(newRow : Dropdown){
    if(newRow.CD != undefined && newRow.CD.trim().length == 0) {
      return false;
    }else if(newRow.VALUE != undefined && newRow.VALUE.trim().length == 0) {
      return false;
    }else if(this.checkDuplicate(newRow.CD) && this.flagPrimaryKey == false){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีรหัสนี้ใช้แล้ว');
      return false;
    }else{
      return true;
    }
}
  
save() {
  this.submitted = true;
  this.misc.progressSpinner(true);
  if (this.validateBeforeSave(this.newRow)) {
    this.newRow.CATEGORY = this.app.PRODUCT.CATEGORY;
    this.newRow.SUB_CATEGORY = this.app.PRODUCT.SUB_CATEGORY_SKILL;
    this.newRow.HEAD_CD = this.app.getHead();
    this.newRow.PROJECT = this.app.getProject();

    if(this.checked){
      this.newRow.ATT_05 = 'Y';
      for (let index = 0; index < this.dataTable .length; index++) {
        let element = this.dataTable[index];
        if(element['ATT_05'] && element['ATT_05'] == 'Y'){
          element['ATT_05'] = 'N'
          let k = element['KEY'];
          let mst = Object.assign({}, element);
          delete element['KEY'];
          delete element['FLAG'];
          delete element['CREATE_DATE_FMT'];
          this.masterService.updateDropDown(k,mst).catch(err => console.log(err));
        }
      }
    }else{
      this.newRow.ATT_05 = 'N';
    }

    if (this.newRow['KEY']) {
      this.newRow.UPDATE_DATE = firestore.Timestamp.now();
      this.newRow.UPDATE_BY = this.app.getUsername();
      let mst = Object.assign({}, this.newRow);
      delete mst['KEY'];
      delete mst['FLAG'];
      delete mst['CREATE_DATE_FMT'];
      this.masterService.updateDropDown(this.newRow['KEY'],mst).catch(err => console.log(err));
      this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
      this.hideDialog();
      this.misc.progressSpinner(false);
    }else{
      this.newRow.CREATE_DATE = firestore.Timestamp.now();
      this.newRow.CREATE_BY = this.app.getUsername();
      this.newRow.UPDATE_DATE = firestore.Timestamp.now();
      this.newRow.UPDATE_BY = this.app.getUsername();
      this.masterService.createDropDown(this.newRow);
      this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
      this.newRow = new Dropdown();
      this.hideDialog();
      this.misc.progressSpinner(false);
    } 
  }else{
    this.misc.progressSpinner(false);
  }
  
}

delete(newRow: Dropdown) {
  this.misc.progressSpinner(true);
  this.masterService.deleteDropDown(newRow['KEY']).catch(err => console.log(err));
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
            this.masterService.deleteDropDown(this.selectedRows[i]['KEY']).catch(err => console.log(err));
          }
          this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
          this.selectedRows = null;
      }
  });
}

}
