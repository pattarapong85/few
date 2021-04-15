import { Component, OnInit} from '@angular/core';
import { firestore } from 'firebase/app';
import { Dropdown } from 'src/app/models/dropdown';
import { System } from 'src/app/models/system';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { MiscComponent } from 'src/app/common/misc/misc.component';

@Component({
  selector: 'app-fn10012',
  templateUrl: './fn10012.component.html',
  styleUrls: ['./fn10012.component.scss']
})
export class Fn10012Component implements OnInit {

  dataTable : any[];
  selectedRows: System[];
  cols: any[];
  bankList : Dropdown[] = [];

  constructor(
    private app : AppService,
    private misc: MiscComponent,
    private masterService : MasterService) { }

  ngOnInit() {    
    this.getTableList();
    this.cols = [
        { field: 'CD', header: 'ตัวย่อธนาคาร' },
        { field: 'VALUE', header: 'ชื่อธนาคาร' }
    ];
  }
  getTableList() {
    let gategory = this.app.SYSTEM.CATEGORY_BANK;
    let sub_gategory = this.app.SYSTEM.SUB_CATEGORY_BANK;
    this.masterService.getSystemMasterList(gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      this.dataTable = [];
      for (let item of response) {
        let e = <System>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        this.dataTable.push(e);
      }

      let gategory2 = this.app.PRODUCT.CATEGORY;
      let sub_gategory2 = this.app.PRODUCT.SUB_CATEGORY_BANK;
      this.masterService.getDataDropDown(this.app.getHead(),gategory2,sub_gategory2).snapshotChanges().subscribe(response2 => {

        this.selectedRows = [];
        this.bankList = [];
        for (let item of response2) {
          let d = <Dropdown>item.payload.doc.data();
          d['KEY'] = item.payload.doc.id;
          this.bankList.push(d);
          for (let i=0;i<this.dataTable.length;i++) {
            let b = <System>this.dataTable[i];
            if(d.CD == b.CD){
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
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_BANK;
    newRow.CATEGORY = gategory;
    newRow.SUB_CATEGORY = sub_gategory;
    newRow.CD = e.data.CD;
    newRow.VALUE = e.data.VALUE;
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
    for (let i=0;i<this.bankList.length;i++) {
      let b = <Dropdown>this.bankList[i];
      if(b.CD == e.data.CD){
        this.masterService.deleteDropDown(b['KEY']).catch(err => console.log(err));
      }
    } 
    this.misc.progressSpinner(false);
  }
}
