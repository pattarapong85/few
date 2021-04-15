import { Component, OnInit, Output, EventEmitter ,ViewChild, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { Wherehouse } from 'src/app/models/wherehouse';
import { SelectItem } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { StockService } from 'src/app/service/stock.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';

import { Address } from 'src/app/models/address';
import addressJson from 'src/assets/address.json';

@Component({
  selector: 'app-fn50006',
  templateUrl: './fn50006.component.html',
  styleUrls: ['./fn50006.component.scss']
})
export class Fn50006Component implements OnInit {

  private subscriptions: Subscription[] = [];
  fncDialog: boolean;
  flagPrimaryKey : boolean;
  dataTable : Wherehouse[];
  selectedRows: Wherehouse[];
  newRow: Wherehouse;
  submitted: boolean;
  statusList: SelectItem[];
  cols: any[];

  addressList : any[];
  filteredAddress: any[];

  constructor(
    private app : AppService,
    private misc: MiscComponent,
    private stockService : StockService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {    
  this.getTableList();
  this.getAddressList();
  this.statusList = this.app.getStatusFlag();

  this.cols = [
      { field: 'WAREHOUSE_NAME', header: 'ชื่อคลังสินค้า' },
      { field: 'W_FULL_ADDRESS', header: 'ที่อยู่' },
      { field: 'DESC', header: 'อธิบาย' },
      { field: 'REMARK', header: 'หมายเหตุ' },
      { field: 'FLAG', header: 'สถานะ' },
      { field: 'createDateFmt', header: 'วันที่สร้าง' },
      { field: 'CREATE_BY', header: 'สร้างโดย' }
  ];
  }

  getAddressList() {
      this.addressList = [];
      addressJson.data.forEach(e => {
        e['FULL_ADDRESS'] = e.district + " " + e.amphoe + " " + e.province + " " + e.zipcode
        this.addressList.push(e);
      });
  }

  filterAddress(event) {
    let filtered : Address[] = [];
    let query = event.query;
    for(let i = 0; i < this.addressList.length; i++) {
        let a : Address = this.addressList[i];
        if (a['FULL_ADDRESS'].toLowerCase().indexOf(query.toLowerCase()) != -1) {
            filtered.push(a);
        }
    }
    
    this.filteredAddress = filtered;
}

onSelectAutoComplete(event){
  //this.newRow.EMP_FULL_ADDRESS = event.FULLNAME;
  // this.newRow.EMP_DISTRICT = event.district;
  // this.newRow.EMP_AMPHURE = event.amphoe;
  // this.newRow.EMP_PROVINCE = event.province;
  // this.newRow.EMP_ZIPCODE = event.zipcode; 
}

  openNew() {
      this.newRow = new Wherehouse();
      this.newRow.ACTIVE_FLAG = 'Y';
      this.submitted = false;
      this.fncDialog = true;
      this.flagPrimaryKey = false;
  }

  hideDialog() {
      this.fncDialog = false;
      this.submitted = false;
  }

  edit(newRow: Wherehouse) {
    this.newRow = {...newRow};
    this.fncDialog = true;
    this.flagPrimaryKey = true;
  }

  getTableList() {
    this.stockService.getDataWherehouse(this.app.getHead()).snapshotChanges()
    .subscribe(response => {
      this.dataTable = [];
      for (let item of response) {
        let e = <Wherehouse>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        e['FLAG'] = e.ACTIVE_FLAG == 'Y' ? 'เปิด' : 'ปิด';
        e['W_FULL_ADDRESS'] = e.ADDRESS_NO + " "+e.FULL_ADDRESS['FULL_ADDRESS'];
        e['createDateFmt'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy");
        this.dataTable.push(e);
      }
      
    }, error => {
      console.log("ERROR",error);
    });
  }

  validateBeforeSave(newRow : Wherehouse){
    if(newRow.WAREHOUSE_NAME != undefined && newRow.WAREHOUSE_NAME.trim().length == 0) {
      return false;
    }else{
      let ret = true;
      if (!this.newRow['KEY']) {
        this.dataTable.forEach(element => {
          if(element.WAREHOUSE_NAME == newRow.WAREHOUSE_NAME){
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
    if (this.newRow['KEY']) {
      this.newRow.UPDATE_DATE = firestore.Timestamp.now();
      this.newRow.UPDATE_BY = this.app.getUsername();
      let mst = Object.assign({}, this.newRow);
      delete mst['KEY'];
      delete mst['FLAG'];
      delete mst['createDateFmt'];
      delete mst['W_FULL_ADDRESS'];
      this.stockService.updateWherehouse(this.newRow['KEY'],mst).catch(err => console.log(err));
      this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
      this.hideDialog();
      this.misc.progressSpinner(false);
    }else{
      this.newRow.HEAD_CD = this.app.getHead();
      this.newRow.PROJECT = this.app.getProject();
      this.newRow.CREATE_DATE = firestore.Timestamp.now();
      this.newRow.CREATE_BY = this.app.getUsername();
      this.newRow.UPDATE_DATE = firestore.Timestamp.now();
      this.newRow.UPDATE_BY = this.app.getUsername();
      this.stockService.createWherehouse(this.newRow);
      this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
      this.newRow = new Wherehouse();
      this.hideDialog();
      this.misc.progressSpinner(false);
    } 
  }else{
    this.misc.progressSpinner(false);
  }
  
}

  delete(newRow: Wherehouse) {
    this.misc.progressSpinner(true);
    this.stockService.deleteWherehouse(newRow['KEY']).catch(err => console.log(err));
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
              this.stockService.deleteWherehouse(this.selectedRows[i]['KEY']).catch(err => console.log(err));
            }
            this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
            this.selectedRows = null;
        }
    });
  }
}
