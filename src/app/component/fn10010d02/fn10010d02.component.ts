import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { OrderHeader } from 'src/app/models/order-header';
import { Address } from 'src/app/models/address';
import { MasterService } from 'src/app/service/master.service';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { OrderService } from 'src/app/service/order.service';
import { AppService } from 'src/app/service/app.service';
import { StockService } from 'src/app/service/stock.service';
import * as firebase from 'firebase';
import { firestore } from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import { Location } from '@angular/common';
import { Dropdown } from 'src/app/models/dropdown';
import { Product } from 'src/app/models/product';
import { Wherehouse } from 'src/app/models/wherehouse';
import { Stock } from 'src/app/models/stock';
import { System } from 'src/app/models/system';

@Component({
  selector: 'app-fn10010d02',
  templateUrl: './fn10010d02.component.html',
  styleUrls: ['./fn10010d02.component.scss']
})
export class Fn10010d02Component implements OnInit {

  private subscriptions: Subscription[] = [];

  key : string;

  details : any [] = [];
  selectedRows: any[];

  dataDropdown : Dropdown = new Dropdown();

  deliverList : SelectItem [] = [];

  clonedData: { [s: string] : any; } = {};


  constructor(private app : AppService,
    private firestore : AngularFirestore ,
    private router: Router,
    private route: ActivatedRoute,
    private misc: MiscComponent,
    private orderService : OrderService,
    private storage: AngularFireStorage,
    
    private location: Location,
    private masterService : MasterService,
    private stockService : StockService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.route.params.subscribe(params => {
      this.key = params['key'];
      let doc = this.masterService.getDocumentDropDown(this.key).get().subscribe(ref => {
        if(!ref.exists){
            this.details = [];
          }else{
            this.dataDropdown = <Dropdown>ref.data();
            this.details = [];
            if(this.dataDropdown['DETAILS'] != null && this.dataDropdown['DETAILS'] != undefined){
              for (let index = 0; index < this.dataDropdown['DETAILS'].length; index++) {
                let element = this.dataDropdown['DETAILS'][index];
                element['KEY'] = this.app.generateKey();
                this.details.push(element);
              }  
            }else{
              let gategory = this.app.SYSTEM.CATEGORY_DELIVER;
              let sub_gategory = this.app.SYSTEM.SUB_CATEGORY_DELIVER;
              this.masterService.getSystemMasterList(gategory,sub_gategory).snapshotChanges()
              .subscribe(response => {

                this.deliverList = [];
                let items = [];
                for (let item of response) {
                  let e = <System>item.payload.doc.data();
                  items.push({
                    KEY : this.app.generateKey(),
                    TRANSPORT_NO : e.CD, 
                    TRANSPORT_NAME : e.CD + " " +e.VALUE, 
                    PRICE : 0
                  });
                }
                this.details = items;
              }, error => {
                console.log("ERROR",error);
              });
            }
          }
          });
      
    }));

  }

  backToTable(){
    this.location.back();
  }

  onchangeTransport(e,index){
    let transport = this.getTransport(e.value);
    this.details[index].TRANSPORT_NAME = transport.label;
  }

  getTransport(code){
    for (let index = 0; index < this.deliverList.length; index++) {
      let element = this.deliverList[index];
      if(element.value == code){
        return element;
      }
    }
    return null;
  }


  

  onRowEditSave(row: any,index) {
    if(this.validate(row)){
      delete this.clonedData[row.KEY];
    }
  }

  validate(row: any){
    if(row.PRICE < 0){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาใส่ราคา');
      return false;
    }else {
      return true;
    }
  }

  onRowDelete(idx){
    const index : number = this.details.indexOf(idx);
    if (index !== -1) {
      this.details.splice(index, 1);
    }  
  }

  onRowEditInit(row: any) {
    this.clonedData[row.KEY] = {...row};
  }

  onRowEditCancel(row: any, index: number) {
       this.details[index] = this.clonedData[row.KEY];
       delete this.details[row.KEY];
  }

  save(){
    this.misc.progressSpinner(true);
    let items = [];
    let vald : boolean = true;
    for (let index = 0; index < this.details.length; index++) {
      let element = this.details[index];
      const PRICE : number = element.PRICE;
      let item = {
        TRANSPORT_NO : element.TRANSPORT_NO, 
        TRANSPORT_NAME : element.TRANSPORT_NAME, 
        PRICE : PRICE
      }
      vald = this.validate(item);
      if(!vald){
        break;
      }
      items.push(item);
    }

    if(vald){
      this.dataDropdown['DETAILS'] = items;
      this.masterService.updateDropDown(this.key,this.dataDropdown);
      this.misc.newMessage('s', 'สำเร็จ', 'อัพเดรทข้อมูลเรียบร้อย');
    }else{
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'ยังมีข้อผิดพลาด ไม่สามารถบันทึกได้');
    }
    this.misc.progressSpinner(false);
  }

}
