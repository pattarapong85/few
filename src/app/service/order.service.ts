import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent,HttpHeaders } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { OrderHeader } from 'src/app/models/order-header';
import { OrderDetail } from 'src/app/models/order-detail';
import { OrderHistory } from 'src/app/models/order-history';
import { OrderPay } from 'src/app/models/order-pay';
import { OrderTransport } from 'src/app/models/order-transport';
import { OrderNote } from 'src/app/models/order-note';
import { AppService } from 'src/app/service/app.service';
import * as firebase from 'firebase';
import { firestore } from 'firebase/app';
import { AngularFireStorage } from "@angular/fire/storage";
import { Globals } from 'src/app/common/globals';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderHeaderRef: AngularFirestoreCollection<OrderHeader> = null;
  orderDetailRef: AngularFirestoreCollection<OrderDetail> = null;
  orderHistoryRef: AngularFirestoreCollection<OrderHistory> = null;
  orderNoteRef: AngularFirestoreCollection<OrderNote> = null;
  orderPayRef: AngularFirestoreCollection<OrderPay> = null;
  orderTransportRef: AngularFirestoreCollection<OrderTransport> = null;
  
  constructor(private firestore : AngularFirestore , 
    private storage: AngularFireStorage,
    private http: HttpClient,
    private app : AppService,
    private globals: Globals) {
    this.orderHeaderRef = firestore.collection(this.app.DB.ORDER_HEADER);
    this.orderDetailRef = firestore.collection(this.app.DB.ORDER_DETAIL);
    this.orderHistoryRef= firestore.collection(this.app.DB.ORDER_HISTORY);
    this.orderNoteRef= firestore.collection(this.app.DB.ORDER_NOTE);
    this.orderPayRef= firestore.collection(this.app.DB.ORDER_PAY);
    this.orderTransportRef= firestore.collection(this.app.DB.ORDER_TRANSPORT);
   }


  getOrderS(headCode,dateFrom,DateTo,idx){
    if(idx == 0){ // ALL
      /*DRAFT : 'DRAFT',
      NO_PAY : 'NO_PAY',
      PAIED : 'PAIED',
      CONFIRM : 'CONFIRM',
      PACK : 'PACK',
      SEND : 'SEND',
      COMPLETE : 'COMPLETE'*/
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
    }else if(idx == 1){ // DRAFT
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "==", "DRAFT")
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
    }else if(idx == 2){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS_TRANFER_NO", "in", ['COD','BANK'])
        .where("STATUS_PAID", "==", false)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
    }else if(idx == 3){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "in", [this.app.STATUS.PACK,this.app.STATUS.SEND,this.app.STATUS.PAIED,this.app.STATUS.CONFIRM])
        .where("STATUS_PAID", "==", true)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }else if(idx == 4){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "==", this.app.STATUS.PAIED)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }else if(idx == 5){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "==", this.app.STATUS.PACK)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }else if(idx == 6){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "==", this.app.STATUS.SEND)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     } else if(idx == 7){
        return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "==", this.app.STATUS.COMPLETE)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }
  }

  getOrderSPack(headCode,dateFrom,DateTo,idx){
    if(idx == 0){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "in", [this.app.STATUS.PAIED,this.app.STATUS.CONFIRM])
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }else if(idx == 1){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("TRACKING_NO", "==", null)
        .where("STATUS", "==", this.app.STATUS.PACK)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }else if(idx == 2){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "==", this.app.STATUS.PACK)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }else if(idx == 3){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "==", this.app.STATUS.SEND)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     } else if(idx == 4){
        return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS", "==", this.app.STATUS.COMPLETE)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }
  }

  getOrderSReturn(headCode,dateFrom,DateTo){
    return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
      .where("PROJECT", "==", "FEW")
      .where("HEAD_CD", "==", headCode)
      .where("ACTIVE_FLAG", "==", "Y")
      .where("STATUS", "==", this.app.STATUS.RETURN)
      .where("ORDER_DATE",">=",dateFrom)
      .where("ORDER_DATE","<=",DateTo));
  }

  getOrderSPayment(headCode,dateFrom,DateTo,idx){
    if(idx == 0){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS_PAID", "==", false)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
    }else if(idx == 1){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("STATUS_PAID", "==", true)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }
  }

  getOrderSReadyToClose(headCode,dateFrom,DateTo,idx){
    if(idx == 0){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("ORDER_STEP", "==", 5)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
    }else if(idx == 1){
      return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
        .where("PROJECT", "==", "FEW")
        .where("HEAD_CD", "==", headCode)
        .where("ACTIVE_FLAG", "==", "Y")
        .where("ORDER_STEP", "==", 6)
        .where("ORDER_DATE",">=",dateFrom)
        .where("ORDER_DATE","<=",DateTo));
     }
  }

  getOrderPay(headCode,orderNo,status){
    return this.firestore.collection(this.app.DB.ORDER_HEADER, ref => ref
      .where("PROJECT", "==", "FEW")
      .where("HEAD_CD", "==", headCode)
      .where("ORDER_NO", "==", orderNo)
      .where("STATUS_TRANFER", "==", status)
      .where("COMPLETE_STATUS", "==", true));
  }

  async getOrderSXX(headCode,dateFrom,DateTo,idx){
  
  let query = firebase.firestore().collection(this.app.DB.ORDER_HEADER).where("PROJECT", "==", "FEW");
    query = query.where("HEAD_CD", "==", headCode);
    query = query.where("ORDER_DATE", ">=",dateFrom);
    query = query.where("ORDER_DATE", "<=",DateTo);
    query = query.where("ACTIVE_FLAG", "==", "Y");
   if(idx == 0){
    
   }else if(idx == 1){

   }else if(idx == 2){
     
   }else if(idx == 3){
     
  }else if(idx == 4){
     
  }else if(idx == 5){
     
  }else if(idx == 6){
     
  } 

  const a = await query.get();
    return a;
  }

  getOrder(key: string) {
    return this.orderHeaderRef.doc(key);
  }

  getOrderDetails(headCode: string, orderNo: string) {
    return this.firestore.collection(this.app.DB.ORDER_DETAIL, ref => ref.where("HEAD_CD", "==", headCode).where("ORDER_NO", "==", orderNo));
  }

  deleteOrder(key: string): Promise<void> {
    return this.orderHeaderRef.doc(key).delete();
  }

  generateOrder(){
    let order = new OrderHeader();

    order.ORDER_NO = this.app.generateOrderNo();
    order.ORDER_DATE = firestore.Timestamp.now();
    order.STATUS_TRANFER_NO = 'COD';
    order.STATUS_TRANFER_NAME = null;
    order.WAREHOUSE_NAME = null;
    
    order.ORDER_STEP =  0;  
    order.STATUS = this.app.STATUS.DRAFT;
    order.STATUS_NAME = this.app.TRANFER[0];
    order.STATUS_PAID = false;
     
    order.PRODUCT_QTY = 0;
      
    order.EMP_NO = this.app.getUsername(); 

    order.SKILL_NO = null;
    order.SKILL_NAME = null;

    order.CHANNEL_NO = null;
    order.CHANNEL_NAME = null;

    order.NAME_SOCIAL = null;  
    order.EMAIL = null;

    order.CUS_NAME = null;  
    order.CUS_ADDRESS = null; 
    order.CUS_DISTRICT = null; 
    order.CUS_AMPHURE = null; 
    order.CUS_PROVINCE = null; 
    order.CUS_ZIPCODE = null; 
    order.CUS_FULL_ADDRESS = null; 
    order.CUS_TEL1 = null; 
    order.CUS_TEL2 = null;  

    order.BILL_NAME = null; 
    order.BILL_ADDRESS = null; 
    order.BILL_DISTRICT = null; 
    order.BILL_AMPHURE = null; 
    order.BILL_PROVINCE = null; 
    order.BILL_ZIPCODE = null; 
    order.BILL_FULL_ADDRESS = null; 
    order.BILL_TEL1 = null;  
    order.BILL_TEL2 = null; 

    order.CUS_ADDRESS_SEND = null; 
    order.BILL_ADDRESS_SEND = null; 

    order.SHIPPING_COST = 0;
     
    order.TYPE_DISCOUNT = 'A';
    order.DISCOUNT_AMOUNT = 0;
    order.DISCOUNT_PERCENT = 0;

    order.TOTAL_DC = 0;
    order.TOTAL_ORDER = 0; 
    order.TOTAL_COMMISSION = 0;
    order.TOTAL_PAY = 0;

    order.TYPE_TAX = 'N';
    order.TAX = 0;
    order.VAT = 0;
    order.COD = 0;
    //order.FEE = 0;
    order.TANSPORT_RATE_NO = 'WEIGHT'; 
    order.TANSPORT_RATE_NAME = null; 
    // order.TRANSPORT_NO = null;
    // order.TRANSPORT_NAME = null;
    order.TRACKING_NO = null;
    // order.TANSPORT_COD_NO = null;
    // order.TANSPORT_COD_NAME = null;
    // order.TANSPORT_DATE = null; 
    // order.BANK_CODE = null; 
    // order.BANK_NAME = null;

    order.REMARK = null;  
    order.PRE_ORDER = false;
    // order.FLAG_TRANSFER = false;
    order.FLAG_COD = false;
    order.ACTIVE_FLAG = 'N';

    order.BILL_FLAG = false;


    order.CONFIRM_SUBMIT = false;
    order.CONFIRM_SUBMIT_BY = null;
    order.CONFIRM_SUBMIT_DATE = null; 

    order.CONFIRM_ORDER_STATUS = false;
    order.CONFIRM_ORDER_BY = null;
    order.CONFIRM_ORDER_DATE = null;

    order.CONFIRM_PAY_STATUS = false;
    order.CONFIRM_PAY_BY = null;
    order.CONFIRM_PAY_DATE = null;
    
    // order.TARNSFER_DATE = null;
    // order.TARNSPORT_DATE = null;
    // order.ATTACFILE_NAME = null;
    // order.SLIP_URL = null;
    // order.ATTACFILE_URL = null; 
    // order.REF_TRANFER = null;
    // order.REMARK_TRANFER = null;
    // order.ACCOUNT_NO = null;
    // order.AMOUNT_TRANFER = 0;
    
    order.PACK_STATUS = false;
    order.PACK_BY = null;
    order.PACK_DATE = null;

    order.SEND_STATUS = false;
    order.SEND_BY = null;
    order.SEND_DATE = null; 

    order.COMPLETE_STATUS = false;
    order.COMPLETE_BY = null;
    order.RECEIVE_DATE = null;
    order.COMPLETE_DATE = null; 

    order.RETURN_STATUS = false;
    order.RETURN_BY = null; 
    order.RETURN_DATE = null; 

    order.REORDER_STATUS = false;
    order.REORDER_BY = null; 
    order.REORDER_DATE = null;  

    order.CREATE_BY = this.app.getUsername();
    order.CREATE_DATE = firebase.firestore.Timestamp.now();
    order.UPDATE_BY = this.app.getUsername();
    order.UPDATE_DATE = firebase.firestore.Timestamp.now();
    order.HEAD_CD = this.app.getHead();
    order.PROJECT = this.app.getProject();

    order.ORDER_DETAILS = [];
    order.STOCK_REF_ID = [];
    order.TRANSPORT_REF_ID = [];
    order.PAY_REF_ID = [];

    return order;
  }

  async createOrUpdateOrder(key: string , data) {
    return await this.firestore.collection(this.app.DB.ORDER_HEADER).doc(key).set(data, { merge: true });
  }

  createOrder(data : OrderHeader) {
    return this.orderHeaderRef.add({...data});
  }

  getOrderHistory(headCode: string,orderNo: string) {
    return this.firestore.collection(this.app.DB.ORDER_HISTORY, ref => ref.where("HEAD_CD", "==", headCode)
    .where("ORDER_NO", "==", orderNo).orderBy("CREATE_DATE","asc"));
  }

  createOrderHistory(ordrNo , detail ,data) {
    let obj = Object.assign({}, data);
    let keyHistory = this.firestore.firestore.collection(this.app.DB.ORDER_HEADER).doc().id;
    let history = new OrderHistory();
    history.PROJECT = this.app.getProject();
    history.HEAD_CD = this.app.getHead();
    history.ORDER_NO = ordrNo;
    history.DETAIL = detail;
    history.DATA = obj;
    history.CREATE_DATE = firestore.Timestamp.now();
    history.CREATE_BY = this.app.getUsername();
    let objHistory = Object.assign({}, history);
    return this.firestore.collection(this.app.DB.ORDER_HISTORY).doc(keyHistory).set(objHistory, { merge: true });
  }
  

  getOrderPays(headCode: string,orderNo: string) {
    return this.firestore.collection(this.app.DB.ORDER_PAY, ref => ref.where("HEAD_CD", "==", headCode).where("ORDER_NO", "==", orderNo));
  }

  createOrderPay(data : OrderPay) {
    return this.orderPayRef.add({...data});
  }

  createOrUpdateOrderPay(key: string , data): void {
    this.firestore.collection(this.app.DB.ORDER_PAY).doc(key).set(data, { merge: true });
  }

  deleteOrderPay(key: string): Promise<void> {
    return this.orderPayRef.doc(key).delete();
  }

  getOneOrderPay(key: string){
    return this.orderPayRef.doc(key);
  }

  
  
  getOrderTransport(headCode: string,orderNo: string) {
    return this.firestore.collection(this.app.DB.ORDER_TRANSPORT, ref => ref.where("HEAD_CD", "==", headCode).where("ORDER_NO", "==", orderNo));
  }

  createOrderTransport(key: string , data) {
    return this.firestore.collection(this.app.DB.ORDER_TRANSPORT).doc(key).set(data, { merge: true });
  }

  deleteOrderTransport(key: string): Promise<void> {
    return this.orderTransportRef.doc(key).delete();
  }

  deleteOrderDetails(key: string): Promise<void> {
    return this.orderDetailRef.doc(key).delete();
  }

  getOrderNote(headCode: string,orderNo: string) {
    return this.firestore.collection(this.app.DB.ORDER_NOTE, ref => ref.where("HEAD_CD", "==", headCode).where("ORDER_NO", "==", orderNo));
  }

  createOrderNote(key: string , data) {
    return this.firestore.collection(this.app.DB.ORDER_NOTE).doc(key).set(data, { merge: true });
  }

  deleteOrderNote(key: string): Promise<void> {
    return this.orderNoteRef.doc(key).delete();
  }

  deleteFile(key: string){
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(key);
      imageRef.delete().then(function() {
      }).catch(function(error) {
        console.log(error);
      });
  }

  createOrUpdateOrderDetail(key: string , data): void {
    this.firestore.collection(this.app.DB.ORDER_DETAIL).doc(key).set(data, { merge: true });
  }

  /*updateStatusOrder(order : OrderHeader,action){
    if(order.STATUS_TRANFER_NO == 'COD'){
      if(action == this.app.ACTION.REORDER){
          order.REORDER_STATUS = true;
          order.REORDER_DATE = firestore.Timestamp.now();
          order.REORDER_BY = this.app.getUsername();  
          order.STATUS = this.app.COD.DRAFT;
          order.ORDER_STEP = 0;
          order.STATUS_NAME = this.app.COD['0'];
          order.STATUS_PAID = false;
      }else if(action == this.app.ACTION.SUBMIT){
        order.CONFIRM_SUBMIT = true;
        order.CONFIRM_SUBMIT_BY = this.app.getUsername();
        order.CONFIRM_SUBMIT_DATE = firestore.Timestamp.now();
        order.STATUS = this.app.COD.NO_PAY;
        order.ORDER_STEP = 1;
        order.STATUS_NAME = this.app.COD['1'];
      }else if(action == this.app.ACTION.CONFIRM){
        order.CONFIRM_ORDER_STATUS = true;
        order.CONFIRM_ORDER_DATE = firestore.Timestamp.now();
        order.CONFIRM_ORDER_BY = this.app.getUsername();
        order.STATUS = this.app.COD.CONFIRM;
        order.ORDER_STEP = 2;
        order.STATUS_NAME = this.app.COD['2'];
      }else if(action == this.app.ACTION.PACK){
        order.PACK_STATUS = true;
        order.PACK_DATE = firestore.Timestamp.now();
        order.PACK_BY = this.app.getUsername(); 
        order.STATUS = this.app.COD.PACK;
        order.ORDER_STEP = 3;
        order.STATUS_NAME = this.app.COD['3'];
      }else if(action == this.app.ACTION.SEND){
        order.SEND_STATUS = true;
        order.SEND_DATE = firestore.Timestamp.now();
        order.SEND_BY = this.app.getUsername();  
        order.STATUS = this.app.COD.SEND;
        order.ORDER_STEP = 4;
        order.STATUS_NAME = this.app.COD['4'];
      }else if(action == this.app.ACTION.PAID){
        order.CONFIRM_PAY_STATUS = true;
        order.CONFIRM_PAY_DATE = firestore.Timestamp.now();
        order.CONFIRM_PAY_BY = this.app.getUsername();  
        order.STATUS = this.app.COD.PAIED;
        order.ORDER_STEP = 5;
        order.STATUS_NAME = this.app.COD['5'];
        order.STATUS_PAID = true;
      }else if(action == this.app.ACTION.COMPLETE){
        order.COMPLETE_STATUS = true;
        order.COMPLETE_DATE = firestore.Timestamp.now();
        order.COMPLETE_BY = this.app.getUsername();  
        order.STATUS = this.app.COD.COMPLETE;
        order.ORDER_STEP = 6;
        order.STATUS_NAME = this.app.COD['6'];
      }
    }else{
      if(action == this.app.ACTION.REORDER){
        order.REORDER_STATUS = true;
        order.REORDER_DATE = firestore.Timestamp.now();
        order.REORDER_BY = this.app.getUsername();  
        order.STATUS = this.app.TRANFER.DRAFT;
        order.ORDER_STEP = 0;
        order.STATUS_NAME = this.app.COD['0'];
        order.STATUS_PAID = false;
      }else if(action == this.app.ACTION.SUBMIT){
        order.CONFIRM_SUBMIT = true;
        order.CONFIRM_SUBMIT_BY = this.app.getUsername();
        order.CONFIRM_SUBMIT_DATE = firestore.Timestamp.now();
        order.STATUS = this.app.TRANFER.NO_PAY;
        order.ORDER_STEP = 1;
        order.STATUS_NAME = this.app.TRANFER['1'];
      }else if(action == this.app.ACTION.PAID){
        order.CONFIRM_PAY_STATUS = true;
        order.CONFIRM_PAY_DATE = firestore.Timestamp.now();
        order.CONFIRM_PAY_BY = this.app.getUsername();  
        order.STATUS = this.app.TRANFER.PAIED;
        order.ORDER_STEP = 2;
        order.STATUS_NAME = this.app.TRANFER['2'];
      }else if(action == this.app.ACTION.CONFIRM){
        order.CONFIRM_ORDER_STATUS = true;
        order.CONFIRM_ORDER_DATE = firestore.Timestamp.now();
        order.CONFIRM_ORDER_BY = this.app.getUsername();
        order.STATUS = this.app.TRANFER.CONFIRM;
        order.ORDER_STEP = 3;
        order.STATUS_NAME = this.app.TRANFER['3'];
        order.STATUS_PAID = true;
      }else if(action == this.app.ACTION.PACK){
        order.PACK_STATUS = true;
        order.PACK_DATE = firestore.Timestamp.now();
        order.PACK_BY = this.app.getUsername(); 
        order.STATUS = this.app.TRANFER.PACK;
        order.ORDER_STEP = 4;
        order.STATUS_NAME = this.app.TRANFER['4'];
      }else if(action == this.app.ACTION.SEND){
        order.SEND_STATUS = true;
        order.SEND_DATE = firestore.Timestamp.now();
        order.SEND_BY = this.app.getUsername();  
        order.STATUS = this.app.TRANFER.SEND;
        order.ORDER_STEP = 5;
        order.STATUS_NAME = this.app.TRANFER['5'];
      }else if(action == this.app.ACTION.COMPLETE){
        order.COMPLETE_STATUS = true;
        order.COMPLETE_DATE = firestore.Timestamp.now();
        order.COMPLETE_BY = this.app.getUsername();  
        order.STATUS = this.app.TRANFER.COMPLETE;
        order.ORDER_STEP = 6;
        order.STATUS_NAME = this.app.TRANFER['6'];
      }
    }

    return order;
  } */


  reOrder(order : OrderHeader){
    order.REORDER_STATUS = true;
    order.REORDER_DATE = firestore.Timestamp.now();
    order.REORDER_BY = this.app.getUsername();  

    order.CONFIRM_SUBMIT = false;
    order.CONFIRM_SUBMIT_BY = null;
    order.CONFIRM_SUBMIT_DATE = null;

    order.CONFIRM_ORDER_STATUS = false;
    order.CONFIRM_ORDER_DATE = null;
    order.CONFIRM_ORDER_BY = null;

    order.PACK_STATUS = false;
    order.PACK_DATE = null;
    order.PACK_BY = null; 

    order.STATUS = this.app.STATUS.DRAFT;
    order.ORDER_STEP = 0;
    order.STATUS_NAME = this.app.COD['0'];
    order.STATUS_PAID = false;
    return order;
  }


  submitOrder(order : OrderHeader){
    order.CONFIRM_SUBMIT = true;
    order.CONFIRM_SUBMIT_BY = this.app.getUsername();
    order.CONFIRM_SUBMIT_DATE = firestore.Timestamp.now();
    order.STATUS = this.app.STATUS.NO_PAY;
    order.ORDER_STEP = 1;
    order.STATUS_NAME = this.app.TRANFER['1'];
    return order;
  }


  confirmOrder(order : OrderHeader){
    order.CONFIRM_ORDER_STATUS = true;
    order.CONFIRM_ORDER_DATE = firestore.Timestamp.now();
    order.CONFIRM_ORDER_BY = this.app.getUsername();
    order.STATUS = this.app.STATUS.CONFIRM;
   
    if(order.STATUS_TRANFER_NO == 'COD'){
      order.ORDER_STEP = 2;
      order.STATUS_NAME = this.app.COD['2'];
    }else{
      order.ORDER_STEP = 2;
      order.STATUS_NAME = this.app.TRANFER['2'];
      order.STATUS_PAID = true;
    }
    return order;
    
  }

  packOrder(order : OrderHeader){
    order.PACK_STATUS = true;
    order.PACK_DATE = firestore.Timestamp.now();
    order.PACK_BY = this.app.getUsername(); 
    order.STATUS = this.app.STATUS.PACK;

    if(order.STATUS_TRANFER_NO == 'COD'){
      order.ORDER_STEP = 3;
      order.STATUS_NAME = this.app.COD['3'];
    }else{
      order.ORDER_STEP = 3;
      order.STATUS_NAME = this.app.TRANFER['4'];
    }
    return order;
  }

  sendOrder(order : OrderHeader){
    order.SEND_STATUS = true;
    order.SEND_DATE = firestore.Timestamp.now();
    order.SEND_BY = this.app.getUsername();  
    order.STATUS = this.app.STATUS.SEND;

    if(order.STATUS_TRANFER_NO == 'COD'){
      order.ORDER_STEP = 4;
      order.STATUS_NAME = this.app.COD['4'];
    }else{
      order.ORDER_STEP = 5;
      order.STATUS_NAME = this.app.TRANFER['5'];
    }
    return order;
    
  }


  paiedOrder(order : OrderHeader){
    order.CONFIRM_PAY_STATUS = true;
    order.CONFIRM_PAY_DATE = firestore.Timestamp.now();
    order.CONFIRM_PAY_BY = this.app.getUsername();  
    order.STATUS = this.app.STATUS.PAIED;
    order.STATUS_PAID = true;

    if(order.STATUS_TRANFER_NO == 'COD'){
      order.ORDER_STEP = 5;
      order.STATUS_NAME = this.app.COD['5'];
    }else{
      order.ORDER_STEP = 3;
      order.STATUS_NAME = this.app.TRANFER['3'];
    }
    return order;
    
  }

  completeOrder(order : OrderHeader){
    order.COMPLETE_STATUS = true;
    order.COMPLETE_DATE = firestore.Timestamp.now();
    order.COMPLETE_BY = this.app.getUsername();  
    order.STATUS = this.app.STATUS.COMPLETE;
    order.ORDER_STEP = 6;
    order.STATUS_NAME = this.app.COD['6'];
    return order;
  }  


  returnOrder(order : OrderHeader){
    order.SEND_STATUS = true;
    order.SEND_DATE = firestore.Timestamp.now();
    order.SEND_BY = this.app.getUsername();  
    order.STATUS = this.app.STATUS.RETURN;
    order.ORDER_STEP = 7;
    order.STATUS_NAME = this.app.TRANFER['7'];
    return order;
  }

  setUpdateStatus(orderTemp){
    let obj = Object.assign({}, orderTemp);
    delete obj['KEY'];
    delete obj['FLAG'];
    delete obj['ORDER_DATE_FMT'];
    delete obj['CREATE_DATE_FMT'];
    delete obj['TANSPORT_DATE_FMT'];
    delete obj['CUS_FULL_ADDRESS'];

    delete obj['ORDER_DETAILS'];
    delete obj['STOCK_REF_ID'];
    delete obj['TRANSPORT_REF_ID'];
    delete obj['PAY_REF_ID'];
    return obj;
  }
}
