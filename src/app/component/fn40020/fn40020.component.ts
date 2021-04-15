import { Component, OnInit } from '@angular/core';
import { OrderHeader } from 'src/app/models/order-header';
import { MasterService } from 'src/app/service/master.service';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { AppService } from 'src/app/service/app.service';
import { ConfirmationService } from 'primeng/api';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-fn40020',
  templateUrl: './fn40020.component.html',
  styleUrls: ['./fn40020.component.scss']
})
export class Fn40020Component implements OnInit {

  constructor(private app : AppService,
    private firestore : AngularFirestore ,
    private router: Router,
    private misc: MiscComponent,
    private orderService : OrderService,
    private confirmationService: ConfirmationService,
    private stockService : StockService,
    private masterService : MasterService) { }

  dataTable : any[];
  selectedRows : OrderHeader[];

  orderDateFrom : Date;
  orderDateTo : Date;

  indexTab : number = 0;

  ngOnInit(): void {
    this.cleardate();
    this.getOrders();
  }

  onSelectDate(e){
    this.getOrders();
  }
  getOrders(){
    this.orderDateFrom.setHours(0);
    this.orderDateFrom.setMinutes(0);
    this.orderDateFrom.setSeconds(0);
    this.orderDateTo.setHours(23);
    this.orderDateTo.setMinutes(59);
    this.orderDateTo.setSeconds(59);
  
    let orderDateFrom = firebase.firestore.Timestamp.fromDate(this.orderDateFrom);
    let orderDateTo = firebase.firestore.Timestamp.fromDate(this.orderDateTo);
    this.orderService.getOrderSReadyToClose(this.app.getHead(),orderDateFrom,orderDateTo,this.indexTab).snapshotChanges()
      .subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let e = <OrderHeader>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          e['FLAG'] = e.ACTIVE_FLAG == 'Y' ? 'เปิด' : 'ปิด';
          e['ORDER_DATE_FMT'] = this.app.transformTimestamp(e.ORDER_DATE,"dd/MM/yyyy");
          e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy");
          // e['TANSPORT_DATE_FMT'] = this.app.transformTimestamp(e.TANSPORT_DATE,"dd/MM/yyyy");
          if(e.CUS_ADDRESS != undefined || e.CUS_ADDRESS != null){
            e['CUS_FULL_ADDRESS'] = e.CUS_ADDRESS + " " +e.CUS_DISTRICT + " " + e.CUS_AMPHURE + " " + e.CUS_PROVINCE + " " + e.CUS_ZIPCODE + " ";
          }
          this.dataTable.push(e);
        }
        
      }, error => {
        console.log("ERROR",error);
      });
  }

  cleardate(){
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);
    this.orderDateFrom = firstDay; 
    this.orderDateTo = lastDay; 
  }

  confirmCompete(event){
    this.misc.progressSpinner(true);
    this.confirmationService.confirm({
      message: 'คุณต้องการยืนยันส่งสินค้าใช่หรือไม่?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var db = firebase.firestore();
        let batch =  db.batch();
        this.dataTable.forEach(element => {
          let order = new OrderHeader(); 
          order.ORDER_NO = element.ORDER_NO;
          order.TRACKING_NO = element.TRACKING_NO;
          order.UPDATE_BY = this.app.getUsername();
          order.UPDATE_DATE = firebase.firestore.Timestamp.now();
          order = this.orderService.completeOrder(order);
          let objHead = this.orderService.setUpdateStatus(order);
          var ref = db.collection(this.app.DB.ORDER_HEADER).doc(order.ORDER_NO);
          batch.update(ref, objHead);
          this.orderService.createOrUpdateOrder(order.ORDER_NO,objHead);
        });

        batch.commit();
        this.misc.newMsgPosition('tc','s', 'สำเร็จ', 'ทำการปิดออเดอร์เรียบร้อย');
        this.misc.progressSpinner(false);
      }
    });
    this.misc.progressSpinner(false);
  }

  handleChange(e) {
    this.indexTab = e.index;
    this.getOrders();  
  }

}
