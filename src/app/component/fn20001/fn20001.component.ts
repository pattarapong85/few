import { Component, OnInit } from '@angular/core';
import { OrderHeader } from 'src/app/models/order-header';
import { MasterService } from 'src/app/service/master.service';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { AppService } from 'src/app/service/app.service';
import { ConfirmationService } from 'primeng/api';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { StockService } from 'src/app/service/stock.service';
import { OrderPay } from 'src/app/models/order-pay';

@Component({
  selector: 'app-fn20001',
  templateUrl: './fn20001.component.html',
  styleUrls: ['./fn20001.component.scss']
})
export class Fn20001Component implements OnInit {
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

  transferList : SelectItem[] = [];

  indexTab : number = 0;

  ngOnInit(): void {
    this.cleardate();
    this.getOrders();
    this.transferList =  this.app.getStatusTranfer();
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
    
    this.orderService.getOrderS(this.app.getHead(),orderDateFrom,orderDateTo,this.indexTab).snapshotChanges()
      .subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let order = <OrderHeader>item.payload.doc.data();
          order['KEY'] = item.payload.doc.id;
          order['FLAG'] = order.ACTIVE_FLAG == 'Y' ? 'เปิด' : 'ปิด';
          order['ORDER_DATE_FMT'] = this.app.transformTimestamp(order.ORDER_DATE,"dd/MM/yyyy");
          order['CREATE_DATE_FMT'] = this.app.transformTimestamp(order.CREATE_DATE,"dd/MM/yyyy");
          // order['TANSPORT_DATE_FMT'] = this.app.transformTimestamp(order.TANSPORT_DATE,"dd/MM/yyyy");
          if(order.CUS_ADDRESS != undefined || order.CUS_ADDRESS != null){
            order['CUS_FULL_ADDRESS'] = order.CUS_ADDRESS + " " +order.CUS_DISTRICT + " " + order.CUS_AMPHURE + " " + order.CUS_PROVINCE + " " + order.CUS_ZIPCODE + " ";
          }

          this.orderService.getOrderPays(this.app.getHead(),order.ORDER_NO).snapshotChanges().subscribe(response => {
            let totalPay : number = 0;
            for (let item of response) {
              let orderpay = <OrderPay>item.payload.doc.data();
              if(orderpay.ACTIVE_FLAG == 'Y'){
                totalPay = totalPay + orderpay.AMOUNT;
              } 
            }
            order.TOTAL_PAY = totalPay;
            }, error => {
              console.log("ERROR",error);
            }); 
            this.dataTable.push(order);
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

  openNew() {
    this.router.navigate(['/fn20002/newOrder']);
  }

  openOrder(row){
    this.router.navigate(['/fn20003/'+row['KEY']]);
  }

  edit(row){
    this.router.navigate(['/fn20002/'+row['KEY']]);
  }

  delete(row){
    let key = row['KEY'];
    this.orderService.deleteOrder(key);
    if(row['ATTACFILE_NAME'] != undefined || row['ATTACFILE_NAME'] != null){
      this.orderService.deleteFile(row['ATTACFILE_NAME']);
    }
  }

  deleteSelected(){
    this.confirmationService.confirm({
      message: 'คุณต้องการลบตามที่เลือกหรือไม่?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          for(let i=0;i<this.selectedRows.length;i++){
            let order = this.selectedRows[i];
            this.delete(order);
            //this.orderService.deleteFile(order.ATTACFILE_NAME);
            if(order.STOCK_REF_ID != null && order.STOCK_REF_ID.length > 0){
              for (let index = 0; index < order.STOCK_REF_ID.length; index++) {
                let key = order.STOCK_REF_ID[index];
                this.stockService.deleteSTock(key);
              }
            }
        
            if(order.PAY_REF_ID != null && order.PAY_REF_ID.length > 0){
              for (let index = 0; index < order.PAY_REF_ID.length; index++) {
                let key = order.PAY_REF_ID[index];
                this.orderService.deleteOrderPay(key);
              }
            }
        
            if(order.TRANSPORT_REF_ID != null && order.TRANSPORT_REF_ID.length > 0){
              for (let index = 0; index < order.TRANSPORT_REF_ID.length; index++) {
                let key = order.TRANSPORT_REF_ID[index];
                this.orderService.deleteOrderTransport(key);
              }
            }

          }
          this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
          this.selectedRows = null;
      }
    });
  }

  handleChange(e) {
    this.indexTab = e.index;
    this.selectedRows = [];
    this.getOrders();  
  }

  goToTranferOrder(event,idx){
    this.confirmationService.confirm({
      message: 'คุณต้องการอัพเดรทตามที่เลือกหรือไม่?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          var db = firebase.firestore();
          let batch =  db.batch();
          for(let i=0;i<this.selectedRows.length;i++){
            let orderTemp = this.selectedRows[i];
            let order = new OrderHeader();
            order.ORDER_NO = orderTemp.ORDER_NO;
            order.STATUS_TRANFER_NO = idx;
            order.STATUS_TRANFER_NAME = this.app.getSelectLabel(idx,this.transferList);
            order.UPDATE_BY = this.app.getUsername();
            order.UPDATE_DATE = firebase.firestore.Timestamp.now();
            order = this.orderService.submitOrder(order);
            let obj = this.orderService.setUpdateStatus(order);
            var ref = db.collection(this.app.DB.ORDER_HEADER).doc(order.ORDER_NO);
            batch.update(ref, obj);
            this.orderService.createOrderHistory(obj.ORDER_NO,"ทำการเลือกจ่ายรูปแบบการจ่ายเงิน",obj); 
          }
          batch.commit();
          this.misc.newMessage('s', 'สำเร็จ', 'อัพเดรทข้อมูลเรียบร้อย');
          this.selectedRows = null;
      }
    });
    
  }


  confirmPay(event){
    var db = firebase.firestore();
    let batch =  db.batch();
    for(let i=0;i<this.selectedRows.length;i++){
      let orderTemp = this.selectedRows[i];
      let order = new OrderHeader();
      order.ORDER_NO = orderTemp.ORDER_NO;
      order.STATUS_TRANFER_NO = orderTemp.STATUS_TRANFER_NO;
      order.UPDATE_BY = this.app.getUsername();
      order.UPDATE_DATE = firebase.firestore.Timestamp.now();
      order = this.orderService.confirmOrder(order);
      let obj = this.orderService.setUpdateStatus(order);
      var ref = db.collection(this.app.DB.ORDER_HEADER).doc(order.ORDER_NO);
      batch.update(ref, obj);
      this.orderService.createOrderHistory(obj.ORDER_NO,"ทำการอัพเดรทการจ่ายเงิน",obj); 
    }

    batch.commit();
    this.misc.newMessage('s', 'สำเร็จ', 'อัพเดรทข้อมูลเรียบร้อย');
    this.selectedRows = null;
  }

  confirmPaied(event){
    var db = firebase.firestore();
    let batch =  db.batch();
    for(let i=0;i<this.selectedRows.length;i++){
      let orderTemp = this.selectedRows[i];
      let order = new OrderHeader();
      order.ORDER_NO = orderTemp.ORDER_NO;
      order.UPDATE_BY = this.app.getUsername();
      order.UPDATE_DATE = firebase.firestore.Timestamp.now();
      order = this.orderService.paiedOrder(order);
      let obj = this.orderService.setUpdateStatus(order);
      var ref = db.collection(this.app.DB.ORDER_HEADER).doc(order.ORDER_NO);
      batch.update(ref, obj);
      this.orderService.createOrderHistory(obj.ORDER_NO,"ทำการอัพเดรทการจ่ายเงิน",obj); 
    }

    batch.commit();
    this.misc.newMessage('s', 'สำเร็จ', 'อัพเดรทข้อมูลเรียบร้อย');
    this.selectedRows = null;
  }

  confirmSend(event){

  }


  confirmCompete(event){

  }

  returnOrder(event){

  }

}
