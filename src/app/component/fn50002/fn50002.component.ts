import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
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
import { Stock } from 'src/app/models/stock';
import { Product } from 'src/app/models/product';
import { Wherehouse } from 'src/app/models/wherehouse';

@Component({
  selector: 'app-fn50002',
  templateUrl: './fn50002.component.html',
  styleUrls: ['./fn50002.component.scss']
})
export class Fn50002Component implements OnInit {

  products: Product [] = [];
  selectedProduct : Product;
  filteredproducts: Product[];

  wherehouseList : SelectItem[] = [];
  productList : [];

  WherehouseSend : string;
  WherehouseReceive : string;

  stock = new Stock;
  stockDate : Date = null;

  cols: any[];
  colsProduct: any[];


  display = false;
  stockDetail : Stock [] = [];

  constructor(
    private app : AppService,
    private firestore : AngularFirestore ,
    private router: Router,
    private route: ActivatedRoute,
    private misc: MiscComponent,
    private orderService : OrderService,
    private storage: AngularFireStorage,
    
    private location: Location,
    private masterService : MasterService,
    private stockService : StockService
  ) { }

  ngOnInit(): void {
    this.stockDate = new Date();

    this.stock.REF = null;
    this.stock.REMARK = null;
    this.getProduct();
    this.getWherehouse();

    this.cols = [
      { field: 'PRODUCT_CATEGORY', header: 'หมวดหมู่สินค้า' },
      { field: 'PRODUCT_SKU', header: 'รหัสสินค้า' },
      { field: 'PRODUCT_NAME', header: 'ชื่อสินค้า' },
      { field: 'REF', header: 'Ref.' },
      { field: 'REMARK', header: 'หมายเหตุ' },
    ];

    this.colsProduct= [
      { field: 'CATEGORY', header: 'หมวดหมู่สินค้า' },
      { field: 'PRODUCT_SKU', header: 'รหัสสินค้า' },
      { field: 'NAME', header: 'ชื่อสินค้า' },
      { field: 'BRAND', header: 'แบรนด์' }
    ];

    //this.descriptionList = this.app.getStatusStock();
  }

  ngAfterContentChecked(): void {
   
  }

  getProduct() {
    this.masterService.getDataProductList(this.app.getHead()).snapshotChanges()
    .subscribe(response => {
      let items : Product [] = [];
      for (let item of response) {
        let e = <Product>item.payload.doc.data();
        e['FULLNAME'] = e.PRODUCT_SKU +" "+e.NAME;
        items.push(e);
      }
      this.products = items;
    }, error => {
      console.log("ERROR",error);
    });
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

  filterProduct(event) {
    let filtered : Product[] = [];
    let query = event.query;
    if(query == null || query == undefined){
      query = '';
    }

    for(let i = 0; i < this.products.length; i++) {
        let product = this.products[i]; 
        if ((product['PRODUCT_SKU'] != null ?  product['PRODUCT_SKU'] : '').toLowerCase().indexOf(query.toLowerCase()) == 0 ||
            (product['NAME'] != null ?  product['NAME'] : '').toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(product);
        }
    }
    
    this.filteredproducts = filtered;
  }

  onRowSelect(e) {
    this.selectedProduct = e.data;
    this.clickSelectProduct();
    this.display = false;
  }

  clickSelectProduct(){
    if(this.selectedProduct != null){
    let productNo = this.selectedProduct['PRODUCT_SKU'];
    let product = this.checkProduct(productNo);
    if(product != null){
        let detail = new Stock;
        detail.ORDER_NO = null;
        detail.REF = this.stock.REF;
        detail.REMARK = this.stock.REMARK;
        detail.DATE = firebase.firestore.Timestamp.fromDate(this.stockDate);
        detail.PRODUCT_SKU = product.PRODUCT_SKU;
        detail.PRODUCT_NAME = product.NAME;
        detail.PRODUCT_CATEGORY = product.CATEGORY;
        detail.AMOUNT = 1;
        this.stockDetail.push(detail);
        this.selectedProduct = null;
    }else{
      this.display = true;
    }
  }else{
    this.display = true;
    //this.misc.newMsgPosition('tc','e', 'Error', 'กรุณาใส่สินค้า');
  }
}

checkProduct(productSKU){
  for(let i = 0; i < this.products.length; i++) {
    let product = this.products[i]; 
    if(product.PRODUCT_SKU == productSKU){
      return product;
    }
  }
  return null;
}

  delDetail(idx){
    this.stockDetail.splice(idx,1);
  }

  valedateb4Save(){
    let result = true;
    return result;
  }

  save(){
    if(this.valedateb4Save()){
      this.misc.progressSpinner(true);
      let items_send : Stock[]  = [];
      let items_receive : Stock[] = [];

      for(let i=0;i<this.stockDetail.length;i++){
        
      var detail = this.stockDetail[i];

      let s  =  new Stock();
      s.WAREHOUSE_NAME = this.WherehouseSend;
      s.ORDER_NO = detail.ORDER_NO;
      s.REF = detail.REF;
      s.REMARK = detail.REMARK;
      s.DATE = detail.DATE;
      s.PRODUCT_SKU = detail.PRODUCT_SKU;
      s.PRODUCT_NAME = detail.PRODUCT_NAME;
      s.PRODUCT_CATEGORY = detail.PRODUCT_CATEGORY; 
      s.STOCK_CATGORY = 'STOCK_OUT';
      s.STOCK_CD = 'PRODUCT_MOVE';
      s.STOCK_CATGORY_LABEL = 'สินค้าออก';
      s.STOCK_CD_LABEL = 'ย้ายสินค้า';
      s.AMOUNT = detail.AMOUNT;
      s.AMOUNT_IN = 0;
      s.AMOUNT_OUT = detail.AMOUNT;
      s.CREATE_DATE = firebase.firestore.Timestamp.now();
      s.CREATE_BY = this.app.getUsername();
      s.UPDATE_DATE = firebase.firestore.Timestamp.now();
      s.UPDATE_BY = this.app.getUsername();
      s.HEAD_CD = this.app.getHead();
      s.PROJECT = this.app.getProject();
      items_send.push(s);

      let r  =  new Stock();
      r.WAREHOUSE_NAME = this.WherehouseReceive;
      r.ORDER_NO = detail.ORDER_NO;
      r.REF = detail.REF;
      r.REMARK = detail.REMARK;
      r.DATE = detail.DATE;
      r.PRODUCT_SKU = detail.PRODUCT_SKU;
      r.PRODUCT_NAME = detail.PRODUCT_NAME;
      r.PRODUCT_CATEGORY = detail.PRODUCT_CATEGORY;
      r.STOCK_CATGORY = 'STOCK_IN';
      r.STOCK_CD = 'PRODUCT_MOVE';
      r.STOCK_CATGORY_LABEL = 'สินค้าเข้า';
      r.STOCK_CD_LABEL = 'ย้ายสินค้า';
      r.AMOUNT = detail.AMOUNT;
      r.AMOUNT_IN = detail.AMOUNT;
      r.AMOUNT_OUT = 0;
      r.CREATE_DATE = firebase.firestore.Timestamp.now();
      r.CREATE_BY = this.app.getUsername();
      r.UPDATE_DATE = firebase.firestore.Timestamp.now();
      r.UPDATE_BY = this.app.getUsername();
      r.HEAD_CD = this.app.getHead();
      r.PROJECT = this.app.getProject();
      items_receive.push(r);
    }

    this.stockService.addDataStock(items_send);
    this.stockService.addDataStock(items_receive);
    this.misc.newMsgPosition('tc','s', 'สำเร็จ', 'ทำการย้ายสินค้าสำเร็จ');
    this.stockDetail = [];
    this.misc.progressSpinner(false);
    }
  }

}
