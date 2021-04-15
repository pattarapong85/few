import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Wherehouse } from 'src/app/models/wherehouse';
import { Supplier } from 'src/app/models/supplier';
import { Stock } from 'src/app/models/stock';
import { StockMovement } from 'src/app/models/stock-movement';
import { TransfersHeader } from 'src/app/models/transfers-header';
import { TransfersDetail } from 'src/app/models/transfers-detail';
import { Purchases } from 'src/app/models/purchases';
import * as firebase from 'firebase';
import { AppService } from 'src/app/service/app.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  // private db_wareHouse = 'WAREHOUSE';
  // private db_supplier = 'SUPPLIER';
  // private db_transferHeader = 'TRANSFERS_WAREHOUSE_H';
  // private db_transferDetail = 'TRANSFERS_WAREHOUSE_D';
  // private db_stock = 'STOCK';
  // private db_stock_movement = 'STOCK_MOVEMENT';
  // private db_purchases = 'PURCHASES';

  wherehouseRef: AngularFirestoreCollection<Wherehouse> = null;
  supplierRef: AngularFirestoreCollection<Supplier> = null;
  stockRef: AngularFirestoreCollection<Stock> = null;
  transfersHeaderRef: AngularFirestoreCollection<TransfersHeader> = null;
  transfersDetailRef: AngularFirestoreCollection<TransfersDetail> = null;
  purchasesRef: AngularFirestoreCollection<Purchases> = null;

  constructor(
    private app : AppService,
    private firestore: AngularFirestore,
    private http: HttpClient) { 
    this.wherehouseRef = firestore.collection(this.app.DB.WAREHOUSE);
    this.supplierRef = firestore.collection(this.app.DB.SUPPLIER);
    this.stockRef = firestore.collection(this.app.DB.STOCK);
    this.purchasesRef = firestore.collection(this.app.DB.PURCHASES);
  }

  getDataWherehouse(headCode){
    return this.firestore.collection(this.app.DB.WAREHOUSE, ref => ref.where("PROJECT", "==", "FEW").where("HEAD_CD", "==", headCode));
  }

  createWherehouse(data: Wherehouse): void {
    this.wherehouseRef.add({...data});
  }
 
  updateWherehouse(key: string, value : any): Promise<void> {
    return this.wherehouseRef.doc(key).set(value,{merge: true});
  }
 
  deleteWherehouse(key: string): Promise<void> {
    return this.wherehouseRef.doc(key).delete();
  }


  //SUPPLIER

  getDataSuplier(headCode){
    return this.firestore.collection(this.app.DB.SUPPLIER, ref => ref.where("PROJECT", "==", "FEW").where("HEAD_CD", "==", headCode));
  }

  createSuplier(data: Supplier): void {
    this.supplierRef.add({...data});
  }
 
  updateSuplier(key: string, value : any): Promise<void> {
    return this.supplierRef.doc(key).set(value,{merge: true});
  }
 
  deleteSuplier(key: string): Promise<void> {
    return this.supplierRef.doc(key).delete();
  }

  addDataStock(stocks){
    var db = firebase.firestore();
    let batch =  db.batch();
    for(let i=0;i<stocks.length;i++){
      let stocksTemp = stocks[i];
      var ref = db.collection(this.app.DB.STOCK).doc();
      let obj = Object.assign({}, stocksTemp);
      batch.set(ref, obj); 
    }
    batch.commit();
  }

  getStock(){
    var db = firebase.firestore();
    db.collectionGroup(this.app.DB.STOCK).get()
    .then(snap => {
        snap.forEach(doc => {
            console.log(doc.data());
        });
    });
  }

  getStockByOrder(headCode,orderNo){
    var db = firebase.firestore();
    return this.firestore.collection(this.app.DB.STOCK, ref => ref
      .where("PROJECT", "==", "FEW")
      .where("HEAD_CD", "==", headCode)
      .where("ORDER_NO","==",orderNo));
  }


  getStockMoveMent(headCode,dateFrom,DateTo){
        return this.firestore.collection(this.app.DB.STOCK, ref => ref
          .where("PROJECT", "==", "FEW")
          .where("HEAD_CD", "==", headCode)
          .where("DATE",">=",dateFrom)
          .where("DATE","<=",DateTo));
  }

  getStockAll(headCode){
    return this.firestore.collection(this.app.DB.STOCK, ref => ref
      .where("PROJECT", "==", "FEW")
      .where("HEAD_CD", "==", headCode));
}

  updateSTock(key: string, value : any): Promise<void> {
    return this.stockRef.doc(key).set(value,{merge: true});
  }

  deleteSTock(key: string): Promise<void> {
    return this.stockRef.doc(key).delete();
  }

  getOrderDetail(orderNo: string) {
    return this.firestore.collection(this.app.DB.STOCK, ref => ref.where("ORDER_NO", "==", orderNo));
  }
}
