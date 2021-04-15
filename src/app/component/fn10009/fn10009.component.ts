import { Component, OnInit, Output, EventEmitter ,ViewChild, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { Dropdown } from 'src/app/models/dropdown';
import { SelectItem } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { Wherehouse } from 'src/app/models/wherehouse';
import { StockService } from 'src/app/service/stock.service';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-fn10009',
  templateUrl: './fn10009.component.html',
  styleUrls: ['./fn10009.component.scss']
})
export class Fn10009Component implements OnInit {

  private subscriptions: Subscription[] = [];
  fncDialog: boolean;
  flagPrimaryKey : boolean;
  dataTable : any[];
  selectedRows: Dropdown[];
  newRow: Dropdown;
  submitted: boolean;
  statusList: SelectItem[];

  task: AngularFireUploadTask;

  pathChannel : string;

  uploadedFiles: any[] = [];

  channels : SelectItem[] = [];
  wherehouseList : SelectItem[] = [];

  checked: boolean = false;
  

  constructor(
    private app : AppService,
    private misc: MiscComponent,
    private masterService : MasterService,
    private stockService : StockService,
    private storage: AngularFireStorage,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {    
  this.getTableList();
  this.getChannel();
  this.getWherehouse();
  this.pathChannel  = this.app.getHead()+"/Channel/uploadChannel/";
  this.statusList = this.app.getStatusFlag();

  }

  openNew() {
      this.newRow = new Dropdown();
      this.newRow.ACTIVE_FLAG = 'Y';
      this.submitted = false;
      this.fncDialog = true;
      this.flagPrimaryKey = false;
      this.checked = false;
  }

  getWherehouse() {
    this.stockService.getDataWherehouse(this.app.getHead()).snapshotChanges().subscribe(response => {
      let items = [];
      for (let item of response) {
        let e = <Wherehouse>item.payload.doc.data();
        items.push({label: e.WAREHOUSE_NAME, value: e.WAREHOUSE_NAME});
      }
      this.wherehouseList = items;
    }, error => {
      console.log("ERROR",error);
    });
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

  getChannel() {
    let gategory = this.app.SYSTEM.CATEGORY_STATUS;
    let sub_gategory = this.app.SYSTEM.SUB_CATEGORY_CHANNEL;
    this.masterService.getSystemMasterList(gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.VALUE, value: e.VALUE});
      }
      this.channels = items;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getTableList() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_CHANNEL;
    this.masterService.getDataDropDown(this.app.getHead(),gategory,sub_gategory).snapshotChanges().subscribe(response => {
      
      this.dataTable = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        this.dataTable.push(e);
      }
      
    }, error => {
      console.log("ERROR",error);
    });
  }

  validateBeforeSave(newRow : Dropdown){
    if(newRow.VALUE != undefined && newRow.VALUE.trim().length == 0) {
      return false;
    }else{
      let ret = true;
      if (!this.newRow['KEY']) {
        this.dataTable.forEach(element => {
          if(element['VALUE'] == newRow.VALUE){
            this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีรหัสนี้ใช้แล้ว');
            ret = false;
          }
        });
      }

      return ret;
  }
}
  
async save() {
  this.submitted = true;
  this.misc.progressSpinner(true);
  if (this.validateBeforeSave(this.newRow)) {
    this.newRow.CATEGORY = this.app.PRODUCT.CATEGORY;
    this.newRow.SUB_CATEGORY = this.app.PRODUCT.SUB_CATEGORY_CHANNEL;
    this.newRow.HEAD_CD = this.app.getHead();
    this.newRow.PROJECT = this.app.getProject();

    if(this.newRow.ATTACFILE_NAME == null){
      this.newRow.ATTACFILE_NAME = null;
      this.newRow.ATTACFILE_URL = null;
    }

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

    if(this.uploadedFiles.length == 1){
      for (let file of this.uploadedFiles) {
        let newName = this.app.getHead() + this.app.transformDate(new Date(),'yyyyMMddHHmmss');
        let doc = this.pathChannel+this.newRow.CD+"/"+newName;
        
        this.task = this.storage.upload(doc,file);
        (await this.task).ref.getDownloadURL().then(url => { 
          this.newRow.ATTACFILE_NAME = doc;
          this.newRow.ATTACFILE_URL = url; 
          console.log(this.newRow);

          let mst = Object.assign({}, this.newRow);
          delete mst['KEY'];
          this.masterService.updateDropDown(this.newRow['KEY'],mst).catch(err => console.log(err));
          this.uploadedFiles = [];       
        });
      }
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

onUpload(event) {
  for(let file of event.files) {
      this.uploadedFiles.push(file);
  }
}

deleteFile(row) {
  this.misc.progressSpinner(true);
  if(row['ATTACFILE_NAME'] != null){
    this.masterService.deleteFile(row['ATTACFILE_NAME']);
    this.newRow.ATTACFILE_NAME = null;
    this.newRow.ATTACFILE_URL = null; 
  }
  this.misc.progressSpinner(false);
}

}
