import { Component, OnInit, Output, EventEmitter ,ViewChild, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';

import { Dropdown } from 'src/app/models/dropdown';
import { SelectItem } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import * as firebase from 'firebase';
import { System } from 'src/app/models/system';

@Component({
  selector: 'app-fn10010',
  templateUrl: './fn10010.component.html',
  styleUrls: ['./fn10010.component.scss']
})
export class Fn10010Component implements OnInit {

  dataTable : any[];
  selectedRows: System[];
  cols: any[];
  dList : Dropdown[] = [];

  constructor(
    private app : AppService,
    private misc: MiscComponent,
    private router : Router,
    private masterService : MasterService) { }

  ngOnInit() {    
    this.getTableList();
    this.cols = [
        { field: 'CD', header: 'ตัวย่อการจัดส่ง' },
        { field: 'VALUE', header: 'ชื่อการจัดส่ง' },
        { field: 'ATT_01', header: 'ชื่อใช้งาน' }
        
    ];
  }
  getTableList() {
    let gategory = this.app.SYSTEM.CATEGORY_STATUS;
    let sub_gategory = this.app.SYSTEM.SUB_CATEGORY_TRANSPORT;
    this.masterService.getSystemMasterList(gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      this.dataTable = [];
      for (let item of response) {
        let e = <System>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        this.dataTable.push(e);
      }

      let gategory2 = this.app.PRODUCT.CATEGORY;
      let sub_gategory2 = this.app.PRODUCT.SUB_CATEGORY_TRANSPORT;
      this.masterService.getDataDropDown(this.app.getHead(),gategory2,sub_gategory2).snapshotChanges().subscribe(response2 => {

        this.selectedRows = [];
        this.dList = [];
        for (let item2 of response2) {
          let d = <Dropdown>item2.payload.doc.data();
          d['KEY'] = item2.payload.doc.id;
          this.dList.push(d);
          for (let i=0;i<this.dataTable.length;i++) {
            let b = <System>this.dataTable[i];
            if(d.CD == b.CD){
              b['ATT_01'] = d.VALUE;
              this.selectedRows.push(b);
            }
          }
        }
      }, error => {
        console.log("ERROR",error);
      });
      
    }, error => {
      console.log("ERROR",error);
    });
  }

  onRowSelectTable(e){
    this.misc.progressSpinner(true);
    let newRow = new Dropdown();
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_TRANSPORT;
    newRow.CATEGORY = gategory;
    newRow.SUB_CATEGORY = sub_gategory;
    newRow.CD = e.data.CD;
    newRow.VALUE = e.data.VALUE;
    newRow.ATT_01 = e.data.VALUE;
    newRow.ACTIVE_FLAG = 'Y';
    newRow.CREATE_DATE = firestore.Timestamp.now();
    newRow.CREATE_BY = this.app.getUsername();
    newRow.UPDATE_DATE = firestore.Timestamp.now();
    newRow.UPDATE_BY = this.app.getUsername();
    newRow.HEAD_CD = this.app.getHead();
    newRow.PROJECT = this.app.getProject();
    this.masterService.createDropDown(newRow);
    this.misc.progressSpinner(false);
  }

  onRowUnSelectTable(e){
    this.misc.progressSpinner(true);
    for (let i=0;i<this.dList.length;i++) {
      let b = <Dropdown>this.dList[i];
      if(b.CD == e.data.CD){
        this.masterService.deleteDropDown(b['KEY']).catch(err => console.log(err));
        e.data.ATT_01 = null;
      }
    } 
    this.misc.progressSpinner(false);
  }

  edit(e){
    let key = "";
    for (let i=0;i<this.dList.length;i++) {
      let b = <Dropdown>this.dList[i];
      if(b.CD == e.CD){
        key = b['KEY'];
      }
    } 
    if(key != ""){
      if(e.CD == 'ITEMS'){
        this.router.navigate(['/fn10010d01/'+key]);
      }else if(e.CD == 'FLAT'){
        this.router.navigate(['/fn10010d02/'+key]);
      }else if(e.CD == 'WEIGHT'){
        this.router.navigate(['/fn10010d03/'+key]);
      }
    }
    
  }
}

