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
import { System } from 'src/app/models/system';
import { Stock } from 'src/app/models/stock';
import { Product } from 'src/app/models/product';
import { Wherehouse } from 'src/app/models/wherehouse';

@Component({
  selector: 'app-fn50001',
  templateUrl: './fn50001.component.html',
  styleUrls: ['./fn50001.component.scss']
})
export class Fn50001Component implements OnInit {

  products: Product [] = [];
  selectedProduct : Product;
  filteredproducts: Product[];

  wherehouseList : SelectItem[] = [];
  descriptionList : SelectItem[] = [];
  patterns : System[] = [];
  patternList : SelectItem[] = [];
  
  productList : [];

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
    this.getPatternList();

    //this.stockService.getStock();

    this.cols = [
      { field: 'WAREHOUSE_NAME', header: 'คลังสินค้า' },
      { field: 'STOCK_CATGORY_LABEL', header: 'ลักษณะ' },
      { field: 'STOCK_CD_LABEL', header: 'รูปแบบ' },
      { field: 'REF', header: 'Ref.' },
      { field: 'REMARK', header: 'หมายเหตุ' },
      { field: 'PRODUCT_CATEGORY', header: 'หมวดหมู่สินค้า' },
      { field: 'PRODUCT_SKU', header: 'รหัสสินค้า' },
      { field: 'PRODUCT_NAME', header: 'ชื่อสินค้า' }
    ];

    this.colsProduct= [
      { field: 'CATEGORY', header: 'หมวดหมู่สินค้า' },
      { field: 'PRODUCT_SKU', header: 'รหัสสินค้า' },
      { field: 'NAME', header: 'ชื่อสินค้า' },
      { field: 'BRAND', header: 'แบรนด์' }
    ];

    this.descriptionList = this.app.getStatusStock();
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

  getPatternList() {
    let gategory = this.app.SYSTEM.CATEGORY_STOCK;
    this.masterService.getSubGategorySystemMasterList(gategory).snapshotChanges()
    .subscribe(response => {
      this.patterns = [];
      for (let item of response) {
        let e = <System>item.payload.doc.data(); 
        this.patterns.push(e);
      }
    }, error => {
      console.log("ERROR",error);
    });
  }

  getDesc(cd){
    for(let i=0;i<this.app.getStatusStock().length;i++){
      let v = this.app.getStatusStock()[i];
      if(cd == v.value){
        return v.label;
      }
    }

    return null;
  }

  getPattern(cd){
    for(let i=0;i<this.patterns.length;i++){
      let v = this.patterns[i];
      if(cd == v.CD){
        return v.VALUE;
      }
    }
    return null;
  }

  onChangeDesc(e){
    this.patternList = [];
    this.patterns.forEach(element => {
      if(e.value == element.SUB_CATEGORY){
        let item = {label: element.VALUE, value: element.CD}
        this.patternList.push(item);
      }
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
    if(this.stock.WAREHOUSE_NAME == null){
      this.misc.newMsgPosition('tc','e', 'Error', 'กรุณาเลือกคลังสินค้า');
    }else if(this.stock.STOCK_CATGORY == null){
      this.misc.newMsgPosition('tc','e', 'Error', 'กรุณาเลือกรูปแบบ');
    }else if(this.stock.STOCK_CD == null){
      this.misc.newMsgPosition('tc','e', 'Error', 'กรุณาเลือกลักษณะ');
    }else{
      if(this.selectedProduct != null){
      let productNo = this.selectedProduct['PRODUCT_SKU'];
      let product = this.checkProduct(productNo);
      if(product != null){
          let detail = new Stock;
          detail.WAREHOUSE_NAME = this.stock.WAREHOUSE_NAME;
          detail.ORDER_NO = null;
          detail.REF = this.stock.REF;
          detail.REMARK = this.stock.REMARK;
          detail.DATE = firebase.firestore.Timestamp.fromDate(this.stockDate);

          detail.STOCK_CATGORY = this.stock.STOCK_CATGORY;
          detail.STOCK_CD = this.stock.STOCK_CD;

          detail.PRODUCT_SKU = product.PRODUCT_SKU;
          detail.PRODUCT_NAME = product.NAME;
          detail.PRODUCT_CATEGORY = product.CATEGORY;

          detail.AMOUNT = 1;

          detail.STOCK_CATGORY_LABEL = this.getDesc(this.stock.STOCK_CATGORY);
          detail.STOCK_CD_LABEL = this.getPattern(this.stock.STOCK_CD);

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

  beforesave(){

    for(let i=0;i<this.stockDetail.length;i++){
      var detail = this.stockDetail[i];
      if(detail.STOCK_CATGORY == 'STOCK_IN'){
        detail.AMOUNT_IN = detail.AMOUNT;
        detail.AMOUNT_OUT = 0;
      }else if(detail.STOCK_CATGORY == 'STOCK_OUT'){
        detail.AMOUNT_IN = 0;
        detail.AMOUNT_OUT = detail.AMOUNT;
      }
      
      detail.CREATE_DATE = firebase.firestore.Timestamp.now();
      detail.CREATE_BY = this.app.getUsername();
      detail.UPDATE_DATE = firebase.firestore.Timestamp.now();
      detail.UPDATE_BY = this.app.getUsername();
      detail.HEAD_CD = this.app.getHead();
      detail.PROJECT = this.app.getProject();
    }
  }

  save(){
    this.misc.progressSpinner(true);
    this.beforesave();
    this.stockService.addDataStock(this.stockDetail);
    this.misc.newMsgPosition('tc','s', 'สำเร็จ', 'ทำการเพิ่มสินค้าเข้าสต็อคสำเร็จ');
    this.stockDetail = [];
    this.misc.progressSpinner(false);
  }
}
