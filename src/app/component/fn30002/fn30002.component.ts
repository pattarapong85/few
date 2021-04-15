import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MasterService } from 'src/app/service/master.service';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { OrderService } from 'src/app/service/order.service';
import { AppService } from 'src/app/service/app.service';
import { StockService } from 'src/app/service/stock.service';
import * as firebase from 'firebase';
import { ConfirmationService } from 'primeng/api';
import { firestore } from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import { Location } from '@angular/common';
import { System } from 'src/app/models/system';
import { Stock } from 'src/app/models/stock';
import { Product } from 'src/app/models/product';
import { Wherehouse } from 'src/app/models/wherehouse';
import { OrderTransport } from 'src/app/models/order-transport';
import { OrderHeader } from 'src/app/models/order-header';

@Component({
  selector: 'app-fn30002',
  templateUrl: './fn30002.component.html',
  styleUrls: ['./fn30002.component.scss']
})
export class Fn30002Component implements OnInit {

  orderTracking : any;
  orderTrackingList : any [];
  packDate : Date = null;
  cols: any[];

  constructor(
    private app : AppService,
    private firestore : AngularFirestore ,
    private router: Router,
    private route: ActivatedRoute,
    private misc: MiscComponent,
    private confirmationService: ConfirmationService,
    private orderService : OrderService,
    private storage: AngularFireStorage,
    
    private location: Location,
    private masterService : MasterService,
    private stockService : StockService
  ) { }

  ngOnInit(): void {
    this.packDate = new Date();
    this.orderTracking = {};
    this.orderTrackingList = [];
    this.cols = [
      { field: 'ORDER_NO', header: 'หมายเลขคำสั่งซื้อ' },
      { field: 'TRACKING_NO', header: 'หมายเลขแทรคกิ้ง' },
    ];
  }

  ngAfterContentChecked(): void {
   
  }

  backToTable(){
    this.location.back();
  }

  delDetail(idx){
    this.orderTrackingList.splice(idx,1);
  }

  async addToTable(orderTracking){

    if(orderTracking.ORDER_NO != null && orderTracking.TRACKING_NO != null){

      //async function getUserByEmail(email) {
        // Make the initial query
        var db = firebase.firestore();
        const query = await db.collection(this.app.DB.ORDER_HEADER).where('ORDER_NO', '==', orderTracking.ORDER_NO).get();
      
         if (!query.empty) {
          /*const snapshot = query.docs[0];
          const data = snapshot.data();*/
          let v = {
            ORDER_NO : orderTracking.ORDER_NO,
            TRACKING_NO : orderTracking.TRACKING_NO
          }
          this.orderTrackingList.push(v);
          this.orderTracking = {};
        } else {
          // not found
          this.misc.newMsgPosition('tc','e', 'Error', 'ไม่มีเลขที่ออร์เดอร์ที่ใส่มา');
        }
      
     // }

      
    }
  }

  
  save(){
    this.misc.progressSpinner(true);
    this.confirmationService.confirm({
      message: 'คุณต้องการยืนยันส่งสินค้าใช่หรือไม่?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //var db = firebase.firestore();
        //let batch =  db.batch();
        for (let index = 0; index < this.orderTrackingList.length; index++) {
          const element = this.orderTrackingList[index];
          this.orderService.getOrderTransport(this.app.getHead(),element.ORDER_NO).snapshotChanges().subscribe(response => {
            for (let item of response) {
              let e = <OrderTransport>item.payload.doc.data();
              let key = item.payload.doc.id
              e.TRACKING_NO = element.TRACKING_NO;
              let obj = Object.assign({}, e);
              this.orderService.createOrderTransport(key,obj);

              let order = new OrderHeader(); 
              order.ORDER_NO = element.ORDER_NO;
              order.TRACKING_NO = element.TRACKING_NO;
              order.UPDATE_BY = this.app.getUsername();
              order.UPDATE_DATE = firebase.firestore.Timestamp.now();
              order = this.orderService.packOrder(order); 
              let objHead = this.orderService.setUpdateStatus(order);
              this.orderService.createOrUpdateOrder(order.ORDER_NO,objHead);
            }
          }, error => {
            console.log("ERROR",error);
          });
          
        }
        this.orderTrackingList = [];
        this.misc.newMsgPosition('tc','s', 'สำเร็จ', 'บันทึกหมายเลขแทรกกิ้งเรียบร้อย');
        this.misc.progressSpinner(false);
      }
    });
    this.misc.progressSpinner(false);
    }
}
