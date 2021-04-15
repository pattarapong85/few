import { Component, OnInit} from '@angular/core';
import { firestore } from 'firebase/app';
import { Dropdown } from 'src/app/models/dropdown';
import { System } from 'src/app/models/system';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import * as firebase from 'firebase';

@Component({
  selector: 'app-fn10011',
  templateUrl: './fn10011.component.html',
  styleUrls: ['./fn10011.component.scss']
})
export class Fn10011Component implements OnInit {

  dataTable : any[];
  selectedRows: System[];
  cols: any[];
  deliverList : Dropdown[] = [];

  selectedValue: string;

  constructor(
    private app : AppService,
    private misc: MiscComponent,
    private masterService : MasterService) { }

  ngOnInit() {    
    this.getTableList();
    this.cols = [
        { field: 'CD', header: 'ตัวย่อขนส่ง' },
        { field: 'VALUE', header: 'ชื่อขนส่ง' }
    ];
  }
  
  getTableList() {
    let gategory = this.app.SYSTEM.CATEGORY_DELIVER;
    let sub_gategory = this.app.SYSTEM.SUB_CATEGORY_DELIVER;
    this.masterService.getSystemMasterList(gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      this.dataTable = [];
      for (let item of response) {
        let e = <System>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        e['CHECK'] = "N";
        this.dataTable.push(e);
      }

      let gategory2 = this.app.PRODUCT.CATEGORY;
      let sub_gategory2 = this.app.PRODUCT.SUB_CATEGORY_DELIVER;
      this.masterService.getDataDropDown(this.app.getHead(),gategory2,sub_gategory2).snapshotChanges().subscribe(response2 => {

        this.selectedRows = [];
        this.deliverList = [];
        for (let item of response2) {
          let d = <Dropdown>item.payload.doc.data();
          d['KEY'] = item.payload.doc.id;
          this.deliverList.push(d);

          if(d.ATT_05 == 'Y'){
            this.selectedValue = d.CD;
          }
          //
          for (let i=0;i<this.dataTable.length;i++) {
            let b = <System>this.dataTable[i];
            if(d.CD == b.CD){
              b['CHECK'] = "Y";
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
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_DELIVER;
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

  clickDefault(event,row){
    var db = firebase.firestore();
    let batch =  db.batch();
    for (let i=0;i<this.deliverList.length;i++) {
      let d = <Dropdown>this.deliverList[i];
      let newRow = new Dropdown();
      let gategory = this.app.PRODUCT.CATEGORY;
      let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_DELIVER;
      newRow.CATEGORY = gategory;
      newRow.SUB_CATEGORY = sub_gategory;
      newRow.CD = d.CD;
      newRow.VALUE = d.VALUE;
      newRow.ACTIVE_FLAG = 'Y';
      newRow.CREATE_DATE = firestore.Timestamp.now();
      newRow.CREATE_BY = this.app.getUsername();
      newRow.UPDATE_DATE = firestore.Timestamp.now();
      newRow.UPDATE_BY = this.app.getUsername();
      newRow.HEAD_CD = this.app.getHead();
      newRow.PROJECT = this.app.getProject();

      if(d.CD == row['CD']){
        newRow.ATT_05 = 'Y';
      }

      var ref = db.collection(this.app.DB.DROPDOWNS).doc(d['KEY']);
      let obj = Object.assign({}, newRow);
      batch.set(ref, obj);
    }
    batch.commit();
  }

  onRowUnSelectTable(e){
    this.misc.progressSpinner(true);
    for (let i=0;i<this.deliverList.length;i++) {
      let b = <Dropdown>this.deliverList[i];
      if(b.CD == e.data.CD){

        for (let i=0;i<this.dataTable.length;i++) {
          let dt = <System>this.dataTable[i];
          if(b.CD == dt.CD){
            dt['CHECK'] = "N";
          }
        }

        this.masterService.deleteDropDown(b['KEY']).catch(err => console.log(err));
      }
    } 
    this.misc.progressSpinner(false);
  }
}
