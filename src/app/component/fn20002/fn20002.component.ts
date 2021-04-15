import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OrderHeader } from 'src/app/models/order-header';
import { OrderDetail } from 'src/app/models/order-detail';
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
import { Stock } from 'src/app/models/stock';
import { OrderPay } from 'src/app/models/order-pay';
import { OrderTransport } from 'src/app/models/order-transport';
import { Head } from 'src/app/models/head';
import { Employee } from 'src/app/models/employee';
import { Customer } from 'src/app/models/customer';
import addressJson from 'src/assets/address.json';


@Component({
  selector: 'app-fn20002',
  templateUrl: './fn20002.component.html',
  styleUrls: ['./fn20002.component.scss']
})
export class Fn20002Component implements OnInit {

  private subscriptions: Subscription[] = [];

  key : string;

  display : boolean = false;
  vatFlag : boolean = false;
  displaySavenew : boolean = false;
  checkedDiscount: boolean = true;
  //checkedPreOder: boolean = false;
  //checkedTransfer: boolean = false;
  fncDialogOrderPay : boolean;
  fncDialogOrderTransport : boolean;

  uploadedFilesPay: any[] = [];
  uploadedFilesTransport: any[] = [];

  sku : string;
  products: Product [] = [];
  selectedProduct : Product;
  filteredproducts: Product[];


  customers: Customer [] = [];
  selectedCustomers : Customer;
  filteredCustomers: Customer[];

  addressOwner: any[] = [];

  addressList: any[] = [];
  selectedAddress: any = [];
  filteredAddress: any[] = [];

  units : SelectItem[] = [];
  skills : SelectItem[] = [];
  channels : SelectItem[] = [];
  channelList : Dropdown[] = [];
  
  bankList : SelectItem[] = [];
  transferList : SelectItem[] = [];
  transportList : SelectItem[] = [];
  transportRateList : any[] = [];
  taxTypeList : SelectItem[] = [];
  deleverList : SelectItem[] = [];
  statusDiscountList : SelectItem[] = [];
  usersList : SelectItem[] = [];
  
  orderDate : Date = null;
  transferDate : Date = null;
  packDate : Date = null;
  orderReceiveDate : Date = null;
  transportDate : Date = null;
  productList : [];

  colsProduct: any[];

  order = new OrderHeader;
  orderDetail : OrderDetail [] = [];
  stockList : Stock [] = [];
  orderPay : OrderPay [] = [];
  orderTransport : OrderTransport [] = [];
  

  task: AngularFireUploadTask;
  pathOrderPay :string;
  pathOrderTransport :string;

  newRowOrderPay : OrderPay;

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
    this.subscriptions.push(this.route.params.subscribe(params => {
      let key = params['orderId'];
      this.getOrder(key);
    }));

    this.getCustomerList();
    this.getAddressList();
    this.getAddressSenditems();
    this.getUnitList();
    this.getSkill();
    this.getChannel();
    this.getBankList();
    this.getTransportList();
    this.getTransportDeliver();
    this.getTaxList();
    
    this.getProduct();
    this.getUsersList();
    this.statusDiscountList = this.app.getStatusDiscount();
    this.transferList =  this.app.getStatusTranfer();

    this.newRowOrderPay = new OrderPay();

    this.colsProduct= [
      { field: 'CATEGORY_NAME', header: 'หมวดหมู่สินค้า' },
      { field: 'PRODUCT_SKU', header: 'รหัสสินค้า' },
      { field: 'NAME', header: 'ชื่อสินค้า' },
      { field: 'BRAND', header: 'แบรนด์' }
    ];
  }

  ngAfterContentChecked(): void {

  }

  getOrder(key : string){
    this.newRowOrderPay = new OrderPay();
    if(key == 'newOrder'){
      //this.key = this.firestore.firestore.collection(this.app.DB.ORDER_HEADER).doc().id;
      this.order = this.orderService.generateOrder();
      this.key = this.order.ORDER_NO;
      this.pathOrderPay  = this.app.getHead()+"/Order/"+this.order.ORDER_NO+'/uploadTranfer/';
      this.pathOrderTransport  = this.app.getHead()+"/Order/"+this.order.ORDER_NO+'/uploadDeliver/';
      this.orderDate = this.order.ORDER_DATE.toDate();
      this.orderDetail = [];
      this.order.TYPE_TAX = 'N';
      this.displaySavenew = true;
      this.orderReceiveDate = new Date();
      this.packDate = new Date();
      this.transferDate = new Date();
      this.transportDate = new Date();
    }else{
      this.orderService.getOrder(key).snapshotChanges().subscribe(response => {
      this.key = key;
      this.order =  <OrderHeader>response.payload.data();
      this.pathOrderPay  = this.app.getHead()+"/Order/"+this.order.ORDER_NO+'/uploadTranfer/';
      this.pathOrderTransport  = this.app.getHead()+"/Order/"+this.order.ORDER_NO+'/uploadDeliver/';
      this.orderDate = this.order.ORDER_DATE.toDate();
      
      // if(this.order.TARNSFER_DATE != null && this.order.TARNSFER_DATE != undefined){
      //   this.transferDate = this.order.TARNSFER_DATE.toDate();
      // }

      if(this.order.RECEIVE_DATE != null && this.order.RECEIVE_DATE != undefined){
        this.orderReceiveDate = this.order.RECEIVE_DATE.toDate();
      }


      if(this.order.PACK_DATE != null && this.order.PACK_DATE != undefined){
        this.packDate = this.order.PACK_DATE.toDate();
      }

      if(this.order.TRANSPORT_DATE != null && this.order.TRANSPORT_DATE != undefined){
        this.transportDate = this.order.TRANSPORT_DATE.toDate();
      }

      this.orderService.getOrderDetails(this.app.getHead(),this.order.ORDER_NO).snapshotChanges().subscribe(response => {
        this.orderDetail = [];
        for (let item of response) {
          let detail = <OrderDetail>item.payload.doc.data();
          this.orderDetail.push(detail);
        }
      }, error => {
        console.log("ERROR",error);
      });

      this.orderService.getOrderPays(this.app.getHead(),this.order.ORDER_NO).snapshotChanges().subscribe(response => {
        this.orderPay = [];
        for (let item of response) {
          let detail = <OrderPay>item.payload.doc.data();
          this.orderPay.push(detail);
        }
      }, error => {
        console.log("ERROR",error);
      });


      this.orderService.getOrderTransport(this.app.getHead(),this.order.ORDER_NO).snapshotChanges().subscribe(response => {
        this.orderTransport = [];
        for (let item of response) {
          let detail = <OrderTransport>item.payload.doc.data();
          this.orderTransport.push(detail);
        }
      }, error => {
        console.log("ERROR",error);
      });

      

      

      
      // this.order.ORDER_DETAILS.forEach( detail => {
        
      // });
      this.displaySavenew = false;
     }, error => {
       console.log("ERROR",error);
     });
    }
  }

  getCustomerList() {
    this.masterService.getDataCustomer(this.app.getHead()).snapshotChanges()
    .subscribe(response => {
      this.customers = [];
      for (let item of response) {
        let e = <Customer>item.payload.doc.data();
      e['FULLNAME'] = e.CUS_NAME + " " +e.CUS_NAME_SOCIAL + " " + e.TEL ;

        this.customers.push(e);
      }
    }, error => {
      console.log("ERROR",error);
    });
  }
  
  getUsersList(){
    this.masterService.getDataEmployee(this.app.getHead()).snapshotChanges()
    .subscribe(response => {
      let items = [];
      for (let item of response) {
        let e = <Employee>item.payload.doc.data();
        items.push({label: e.FIRSTNAME+" "+e.LASTNAME, value: e.EMP_NO});
      }
      this.usersList = items;
    }, error => {
      console.log("ERROR",error);
    });
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

  getAddressSenditems(){
    this.masterService.getDataHead(this.app.getHead()).snapshotChanges().subscribe(response => {
      let heads = [];
      let items = [];
      let headInfo = new Head();
      for (let item of response) {
        let e = <Head>item.payload.doc.data();
        heads.push(e);
        //
      }
      headInfo = heads[0];
      headInfo.ADDRESSS_LIST.forEach(element => {
        items.push({label: element.ADDRESS_FULL , value: element.ADDRESS_FULL});
      });
      
      this.addressOwner = items;
    }, error => {
      console.log("ERROR",error);
    });
   }

  getTaxList() {
    let gategory = this.app.SYSTEM.CATEGORY_STATUS;
    let sub_gategory = this.app.SYSTEM.SUB_CATEGORY_TAX;
    this.masterService.getSystemMasterList(gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.VALUE, value: e.CD});
      }
      this.taxTypeList = items;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getTransportList() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_TRANSPORT;
    this.masterService.getDropdownList(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      this.transportRateList = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.VALUE, value: e.CD});
        this.transportRateList.push(e); 
      }
      this.transportList = items;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getTransportDeliver() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_DELIVER;
    this.masterService.getDropdownList(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      let transNo = '';
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.CD + " " + e.VALUE, value: e.CD});
        if(e.ATT_05 == 'Y'){
          transNo = e.CD;
        }
      }
      this.deleverList = items;
      this.order.TRANSPORT_NO = transNo;
      this.addOrderTransport(transNo);

    }, error => {
      console.log("ERROR",error);
    });
  }

  getBankList() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_BANK;
    this.masterService.getDropdownList(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.CD + " " + e.VALUE, value: e.CD});
      }
      this.bankList = items;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getChannel() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_CHANNEL;
    this.masterService.getDropdownList(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      let key = '';
      this.channelList = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.CD+ " | "+e.ATT_01 + " | "+ e.VALUE + " | "+e.ATT_02, value: e.CD ,title : e.ATTACFILE_URL });
        this.channelList.push(e);

        if(e.ATT_05 !=null && e.ATT_05 == 'Y'){
          key = e.CD;
        }

      }
      this.channels = items;
      this.order.CHANNEL_NO = key;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getSkill() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_SKILL;
    this.masterService.getDropdownList(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      let key = '';
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.VALUE, value: e.CD});
        if(e.ATT_05 !=null && e.ATT_05 == 'Y'){
          key = e.CD;
        }
      }
      this.skills = items;
      this.order.SKILL_NO = key;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getUnitList() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_UNIT_PRODUCT;
    this.masterService.getDropdownList(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.VALUE, value: e.CD});
      }
      this.units = items;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getAddressList() {
      this.addressList = [];
      addressJson.data.forEach(e => {
        e['FULL_ADDRESS'] = e.district + " " + e.amphoe + " " + e.province + " " + e.zipcode
        this.addressList.push(e);
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

  filterAddress(event) {
    let filtered : Address[] = [];
    let query = event.query;
    for(let i = 0; i < this.addressList.length; i++) {
        let a : Address = this.addressList[i];
        if (a['FULL_ADDRESS'].toLowerCase().indexOf(query.toLowerCase()) != -1) {
            filtered.push(a);
        }
    }
    
    this.filteredAddress = filtered;
}



filterCustomerList(event) {
  let filtered : Customer[] = [];
  let query = event.query;
  for(let i = 0; i < this.customers.length; i++) {
      let a : Customer = this.customers[i];
      if (a['FULLNAME'].toLowerCase().indexOf(query.toLowerCase()) != -1) {
          filtered.push(a);
      }
  }
  
  this.filteredCustomers = filtered;
}

onSelectCustomer(event){
  this.order.CUS_NAME = event.CUS_NAME;
  this.order.NAME_SOCIAL = event.CUS_NAME_SOCIAL;
  this.order.CUS_ADDRESS = event.CUS_ADDRESS;
  this.order.CUS_TEL1 = event.TEL;
  this.order.CUS_TEL2 = event.TEL2;

  this.order.CUS_DISTRICT = event.CUS_FULL_ADDRESS.district;
  this.order.CUS_AMPHURE = event.CUS_FULL_ADDRESS.amphoe;
  this.order.CUS_PROVINCE = event.CUS_FULL_ADDRESS.province;
  this.order.CUS_ZIPCODE = event.CUS_FULL_ADDRESS.zipcode; 

  this.order.BILL_DISTRICT  = event.CUS_FULL_ADDRESS.district;
  this.order.BILL_AMPHURE = event.CUS_FULL_ADDRESS.amphoe; 
  this.order.BILL_PROVINCE = event.CUS_FULL_ADDRESS.province;
  this.order.BILL_ZIPCODE = event.CUS_FULL_ADDRESS.zipcode; 

  this.order.EMAIL = event.CUS_ADDRESS;
  this.order.CUS_FULL_ADDRESS = event.CUS_FULL_ADDRESS;

  /*

ACTIVE_FLAG: "Y"
CREATE_BY: "admin"
CREATE_DATE: t {seconds: 1602332456, nanoseconds: 414000000}
CUS_ADDRESS: "98/1"
CUS_AMPHURE: "วังชิ้น"
CUS_DISTRICT: "แม่พุง"
CUS_FULL_ADDRESS: {district: "แม่พุง", district_code: 540705, FULL_ADDRESS: "แม่พุง วังชิ้น แพร่ 54160", zipcode: 54160, amphoe_code: 5407, …}
CUS_NAME: "ภัทรพงษ์ ใจเอ้ย"
CUS_NAME_SOCIAL: "เสือพง"
CUS_PROVINCE: "แพร่"
CUS_ZIPCODE: 54160
EMAIL: "pattarapong85@hotmail.com"
FULLNAME: "ภัทรพงษ์ ใจเอ้ย เสือพง 0846101918"
HEAD_CD: "HOME"
PROJECT: "FEW"
TEL: "0846101918"
TEL2: "0846325698"
UPDATE_BY: "admin"

  */
}

onSelectProduct(e){
  //this.sku = e.PRODUCT_SKU;
}

onchangeTransferBy(e){
  this.clearTranfer();
  this.orderPay = [];
  this.order.FLAG_COD = false;

   if(e.value == 'BANK'){
    this.openNewOrderPay();
   }else{
     this.calculate();
   }
}

clearCOD(){
  this.order.FLAG_COD =false;
  this.order.STATUS = this.app.STATUS.DRAFT;
  this.uploadedFilesPay = [];
  this.uploadedFilesTransport = [];
}

clearTranfer(){
  this.transferDate = new Date();;
  this.orderPay = [];
  this.uploadedFilesPay = [];
  this.uploadedFilesTransport = [];
}

clickSearchProduct(){
  this.selectedProduct = this.checkProductBysku(this.sku);
  if(this.selectedProduct == null){
    this.display = true;
  }else{
    this.insertProductToDetail();
    this.sku = null;
    this.calculate();
  }
}

onRowSelect(e) {
  this.selectedProduct = e.data;
  this.insertProductToDetail();
  this.display = false;
  this.calculate();
}


// clickSelectProduct(){
//   this.selectedProduct = this.checkProductBysku(this.sku);
  // if(this.selectedProduct == null){
  //   this.clickSearchProduct();

  // }else{
  //   this.insertProductToDetail();
  //   this.sku = null;
  // }
  
// }


insertProductToDetail(){
  if(this.selectedProduct != null){
    let productNo = this.selectedProduct['PRODUCT_SKU'];
    // if(this.checkProductDetail(productNo) != null){
      
    // }else{
      let product = this.checkProductBySKU(productNo);
      let detail = new OrderDetail;
      
      detail.PRODUCT_IMG = product.images.length > 0 ? product.images[0].ATTACFILE_URL : null; 
      detail.ORDER_NO = this.order.ORDER_NO;
      detail.PRODUCT_SKU = product.PRODUCT_SKU;
      detail.PRODUCT_NAME = product.NAME;
      detail.PRODUCT_CATEGORY = product.CATEGORY_NAME;
      detail.PRICE = product.PRICE;
      detail.DCPERCENT = 0.00;
      detail.DCAMOUNT = 0.00;
      detail.AMOUNT = 1;
      detail.UNIT = product.UNIT;
      detail.COMMISSION = product.COMMISSION != null ? product.COMMISSION : 0;
      detail.TOTAL_PRICE = product.PRICE;
      detail.TOTAL_COMM = product.COMMISSION != null ? product.COMMISSION : 0;
      //detail.UNIT_NAME = this.app.getSelectLabel(product.UNIT,this.units)
      detail.EMP_NO = this.app.getUsername();
      this.orderDetail.push(detail);
    // }   
    this.selectedProduct = null;
  }else{
    this.misc.newMsgPosition('tc','e', 'Error', 'กรุณาใส่สินค้า');
  }
}

// checkProductDetail(productSKU){
//   for(let i = 0; i < this.orderDetail.length; i++) {
//     let product = this.orderDetail[i]; 
//     if(product.PRODUCT_SKU == productSKU){
//       return i;
//     }
//   }
//   return null;
// }

checkProductBySKU(productSKU){
  for(let i = 0; i < this.products.length; i++) {
    let product = this.products[i]; 
    if(product.PRODUCT_SKU == productSKU){
      return product;
    }
  }
  return null;
}

checkProductBysku(sku){
  for(let i = 0; i < this.products.length; i++) {
    let product = this.products[i]; 
    if(product.PRODUCT_SKU == sku){
      return product;
    }
  }
  return null;
}

delDetail(idx){
  this.orderDetail.splice(idx,1);
  this.calculate();
}

onSelectAddress(event){
  
  this.order.CUS_DISTRICT = event.district;
  this.order.CUS_AMPHURE = event.amphoe;
  this.order.CUS_PROVINCE = event.province;
  this.order.CUS_ZIPCODE = event.zipcode; 

  this.order.BILL_DISTRICT  = event.district;
  this.order.BILL_AMPHURE = event.amphoe; 
  this.order.BILL_PROVINCE = event.province;
  this.order.BILL_ZIPCODE = event.zipcode; 
}

getPriceTransport(t,ts,weight,qty){

  let p : number = 0;
  let details = [];
  for (let index = 0; index < this.transportRateList.length; index++) {
    let element = this.transportRateList[index];
    if(t == element.CD){
      details = element.DETAILS; 
    }
  }

  if(this.order.TANSPORT_RATE_NO == 'WEIGHT'){ // "รูปแบบการจัดส่งแบบราคาตามน้ำหนักสินค้า"
    for (let index = 0; index < details.length; index++) {
      let element = details[index];
      if(weight >= element.MIN && weight <= element.MAX && element.TRANSPORT_NO == ts){
        p = Number(element.PRICE);
      }
    }
  }else if(this.order.TANSPORT_RATE_NO == 'ITEMS'){ //"รูปแบบราคาตามจำนวนสินค้า"
    for (let index = 0; index < details.length; index++) {
      let element = details[index];
      if(qty >= element.MIN && qty <= element.MAX && element.TRANSPORT_NO == ts){
        p = Number(element.PRICE);
      }
    }
  }else if(this.order.TANSPORT_RATE_NO == 'FLAT'){ //"รูปแบบการจัดส่งแบบราคาคงที่"
    for (let index = 0; index < details.length; index++) {
      let element = details[index];
      if(element.TRANSPORT_NO == ts){
        p = Number(element.PRICE);
      }
    }

  }
  return p;
}



calculate(){
  let totalHeader : number = 0;
  let totalCommHeader: number = 0;

  let weight : number = 0;
  let items : number = 0;

  this.orderDetail.forEach((detail : OrderDetail) => {
    if(detail.DCPERCENT > 0){
      detail.DCAMOUNT = detail.PRICE * (detail.DCPERCENT / 100.00);
    }

    detail.TOTAL_PRICE =  detail.AMOUNT * (detail.PRICE - detail.DCAMOUNT);
    detail.TOTAL_COMM =   detail.AMOUNT * detail.COMMISSION;
    totalHeader = totalHeader + detail.TOTAL_PRICE;
    totalCommHeader = totalCommHeader + detail.TOTAL_COMM;

    let p = this.checkProductBySKU(detail.PRODUCT_SKU);
    weight = weight + (Number(p.WEIGHT) *  Number(detail.AMOUNT));
    items = items + Number(detail.AMOUNT);

  });

  let totalPay : number = 0;
  if(this.order.STATUS_TRANFER_NO =='BANK'){
    this.orderPay.forEach((detail : OrderPay) => {
      totalPay = totalPay + detail.AMOUNT;
    });
  }

  this.order.TOTAL_PAY = totalPay;
  
  /*let totalShipping : number = 0;
  this.orderTransport .forEach((detail : OrderTransport) => {
    totalShipping = totalShipping + detail.SHIPPING_COST;
  });*/

  //this.order.SHIPPING_COST = totalShipping;
  
  if(this.order.TYPE_DISCOUNT == 'A'){
    this.checkedDiscount = true;
    this.order.DISCOUNT_PERCENT = 0;
    this.order.TOTAL_DC = this.order.DISCOUNT_AMOUNT;
  }else{
    this.checkedDiscount = false;
    this.order.DISCOUNT_AMOUNT = 0;
    this.order.TOTAL_DC =  totalHeader * (this.order.DISCOUNT_PERCENT /100.00);
  }



  totalHeader = totalHeader + this.order.SHIPPING_COST + this.order.COD - this.order.TOTAL_DC;
  
  let totalafterTax : number = 0;
  let tax : number = 0;
    if(this.order.TYPE_TAX == 'S'){
      this.vatFlag = true;  
      tax = totalHeader * this.order.VAT / 100.00;
      totalafterTax = totalHeader + tax;
    }else if(this.order.TYPE_TAX == 'V'){
      this.vatFlag = false;
      this.order.VAT = 0;
      tax = totalHeader * 0.07;
      totalafterTax = totalHeader + tax;
    }else if(this.order.TYPE_TAX == 'C'){
      this.vatFlag = false;
      this.order.VAT = 0;
      totalafterTax = totalHeader * 100 / 107;
      tax = totalHeader - totalafterTax;
    }else if(this.order.TYPE_TAX == 'N'){
      this.vatFlag = false;
      this.order.VAT = 0;
      totalafterTax = totalHeader;
    }

    this.order.TAX = Number(tax.toFixed(2));
    this.order.PRODUCT_QTY = this.orderDetail.length;
    this.order.TOTAL_ORDER = Number(totalafterTax.toFixed(2));
    this.order.TOTAL_COMMISSION = Number(totalCommHeader.toFixed(2));

    if(this.order.TRANSPORT_NO != null){
      this.addOrderTransport(this.order.TRANSPORT_NO)
    }
  }

  backToTable(){
    this.location.back();
  }

  onUploadPay(event){
    for(let file of event.files) {
      this.newRowOrderPay.ATTACFILE_NAME = file.name;
      this.uploadedFilesPay.push(file);
    }
  }

  deleteFile(key) {
      this.orderService.deleteFile(key);
  }

  addOrderDetail(){
    var db = firebase.firestore();
    let batch =  db.batch();
    this.order.ORDER_DETAILS = [];

    this.orderDetail.forEach(detail => {
      let n = this.app.getSelectLabel(detail.EMP_NO,this.usersList);
      detail.EMP_FULLNAME = n;
      detail.UNIT_NAME = this.app.getSelectLabel(detail.UNIT,this.units);
      detail.CREATE_DATE = firebase.firestore.Timestamp.now();
      detail.CREATE_BY = this.app.getUsername();
      detail.UPDATE_DATE = firebase.firestore.Timestamp.now();
      detail.UPDATE_BY = this.app.getUsername();
      detail.HEAD_CD = this.app.getHead();
      detail.PROJECT = this.app.getProject();
      var ref = db.collection(this.app.DB.ORDER_DETAIL).doc();
      let obj = Object.assign({}, detail);
      this.order.ORDER_DETAILS.push(ref.id);
      batch.set(ref, obj);
    });
    batch.commit();
  }

  addDataToStock(){
    var db = firebase.firestore();
    let batch =  db.batch();
    this.order.STOCK_REF_ID = [];
    this.stockList.forEach(detail => {
      var ref = db.collection(this.app.DB.STOCK).doc();
      let obj = Object.assign({}, detail);
      this.order.STOCK_REF_ID.push(ref.id);
      batch.set(ref, obj);
    });
    batch.commit();
  }

  hideDialog(){
    this.fncDialogOrderPay = false;
    this.fncDialogOrderTransport = false;
  }

  deletePay(idx,row){
    this.orderPay.splice(idx,1);
    if(row.ATTACFILE_URL != null){
      this.orderService.deleteFile(row.ATTACFILE_NAME);
    }
    this.calculate();
  }

  deleteTransport(idx,row){
    this.orderTransport.splice(idx,1);
    if(row.ATTACFILE_URL != null){
      this.orderService.deleteFile(row.ATTACFILE_NAME);
    }
    this.calculate();
  }

  

  UpdateOrderPay(key){
    this.newRowOrderPay.UPDATE_BY = this.app.getUsername();
    this.newRowOrderPay.UPDATE_DATE = firebase.firestore.Timestamp.now();
    let obj = Object.assign({}, this.newRowOrderPay);
    this.orderService.createOrUpdateOrderPay(key,obj);
  }

  UpdateOrder(key){
    this.order.UPDATE_BY = this.app.getUsername();
    this.order.UPDATE_DATE = firebase.firestore.Timestamp.now();
    let obj = Object.assign({}, this.order);
    this.orderService.createOrUpdateOrder(key,obj);
  }

  // UpdateOrderTransport(key){
  //   this.newRowTransport.UPDATE_DATE = firebase.firestore.Timestamp.now();
  //   this.newRowTransport.UPDATE_BY = this.app.getUsername();
  //   let obj = Object.assign({}, this.newRowTransport);
  //   this.orderService.createOrderTransport(key,obj);
  // }

  // onchangeCOD(e){
  //   this.misc.progressSpinner(true);
  //   for(let i=0;i<this.deleverList.length;i++){
  //     let b = this.deleverList[i];
  //     if(e.value == b['value']){
  //       this.newRowOrderPay.DELIVER_NAME = b['label'];
  //     }
  //   }
  //   this.misc.progressSpinner(false);
  // }

  openNewOrderPay() {
    this.fncDialogOrderPay = true;
    this.transferDate = new Date();
    this.newRowOrderPay = new OrderPay();
    this.newRowOrderPay.ORDER_NO = this.order.ORDER_NO;
    this.newRowOrderPay.PAY_DATE = null;
    this.newRowOrderPay.DELIVER_CODE = null;
    this.newRowOrderPay.DELIVER_NAME = null;
    this.newRowOrderPay.BANK_CODE = null;
    this.newRowOrderPay.BANK_NAME = null;
    this.newRowOrderPay.STATUS_TRANFER_NO = this.order.STATUS_TRANFER_NO;
    this.newRowOrderPay.STATUS_TRANFER_NAME = this.app.getSelectLabel(this.order.STATUS_TRANFER_NO,this.transferList);
    this.newRowOrderPay.AMOUNT = 0;
    this.newRowOrderPay.COD_SERVICE = 0;
    this.newRowOrderPay.FEE = 0;
    this.newRowOrderPay.REMARK = null;
    this.newRowOrderPay.ACCOUNT_NO =  null;
    this.newRowOrderPay.REF = null;
     
    this.newRowOrderPay.CREATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowOrderPay.CREATE_BY = this.app.getUsername();
    this.newRowOrderPay.UPDATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowOrderPay.UPDATE_BY = this.app.getUsername();
    this.newRowOrderPay.ACTIVE_FLAG = 'Y';
    this.newRowOrderPay.HEAD_CD = this.app.getHead();
    this.newRowOrderPay.PROJECT = this.app.getProject();
  }

  async addOrderPay(){
    this.misc.progressSpinner(true);

    if(this.order.STATUS_TRANFER_NO == 'BANK' && (this.newRowOrderPay.BANK_CODE == null || this.newRowOrderPay.BANK_CODE.length ==0 )){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาเลือกธนาคาร');
    }else{
      let transferDate = null;
      if(this.transferDate != null){
        transferDate = firebase.firestore.Timestamp.fromDate(this.transferDate);
      }

      this.newRowOrderPay.BANK_NAME  = this.app.getSelectLabel(this.newRowOrderPay.BANK_CODE,this.bankList);
      this.newRowOrderPay.DELIVER_NAME = this.app.getSelectLabel(this.newRowOrderPay.DELIVER_CODE,this.deleverList);
      this.newRowOrderPay.PAY_DATE = transferDate;
      this.newRowOrderPay.CREATE_DATE = firebase.firestore.Timestamp.now();
      this.newRowOrderPay.CREATE_BY = this.app.getUsername();
      this.newRowOrderPay.UPDATE_DATE = firebase.firestore.Timestamp.now();
      this.newRowOrderPay.UPDATE_BY = this.app.getUsername();
      this.newRowOrderPay.ACTIVE_FLAG = 'Y';
      this.newRowOrderPay.HEAD_CD = this.app.getHead();
      this.newRowOrderPay.PROJECT = this.app.getProject();
      this.orderPay.push(this.newRowOrderPay);

      this.calculate();
      this.hideDialog();
    }
    this.misc.progressSpinner(false);
  }

  async saveOrderPay(){
    this.misc.progressSpinner(true);
    var db = firebase.firestore();
    // let batch =  db.batch();
    this.order.PAY_REF_ID = [];
    for (let index = 0; index < this.orderPay.length; index++) {
      let detail = this.orderPay[index];
      var key = db.collection(this.app.DB.ORDER_PAY).doc().id;
      let obj = Object.assign({}, detail);
      this.order.PAY_REF_ID.push(key);
      this.orderService.createOrUpdateOrderPay(key,obj);
      // batch.set(ref, obj);

      if(this.uploadedFilesPay.length > 0 && detail.ATTACFILE_NAME != null){
        for (let file of this.uploadedFilesPay) {
          if(file.name == detail.ATTACFILE_NAME){
            let newName = this.app.getHead() + this.app.transformDate(new Date(),'yyyyMMddHHmmss');
            let doc = this.pathOrderPay+newName;
            detail.ATTACFILE_NAME = doc;
            this.task = this.storage.upload(doc,file);
            (await this.task).ref.getDownloadURL().then(url => { 
              detail.ATTACFILE_URL = url;  
              let obj2 = Object.assign({}, detail);
              this.orderService.createOrUpdateOrderPay(key,obj2);
              //batch.update(ref, obj2);      
            });
          }
        }
      }
      
    }
    //batch.commit();
    this.misc.progressSpinner(false);
  }

  onchangeTransport(event){
    if(event.value != null){
      this.addOrderTransport(event.value);
    }
  }

  addOrderTransport(t){
    this.misc.progressSpinner(true);
    this.orderTransport = [];
    let newRowTransport = new OrderTransport();
    newRowTransport.ORDER_NO = this.order.ORDER_NO;
    newRowTransport.CUS_NAME = this.order.CUS_NAME;
    newRowTransport.CUS_ADDRESS_FULL = this.order.CUS_ADDRESS + " ตำบล " +this.order.CUS_DISTRICT + "อำเภอ" + this.order.CUS_AMPHURE + "จังหวัด " + this.order.CUS_PROVINCE + " รหัสไปรษณีย์" + this.order.CUS_ZIPCODE ;
    newRowTransport.TEL1 = this.order.CUS_TEL1;
    newRowTransport.TEL2 = this.order.CUS_TEL2 == undefined ? null: this.order.CUS_TEL2;

    let transferDate = null;
    if(this.transferDate != null){
      transferDate = firebase.firestore.Timestamp.fromDate(this.transferDate);
    }

    let packDate = null;
    if(this.packDate != null){
        packDate = firebase.firestore.Timestamp.fromDate(this.packDate);
    }

    let transportDate = null;
    if(this.transportDate != null){
      transportDate = firebase.firestore.Timestamp.fromDate(this.transportDate);
    }

    let orderReceiveDate = null;
    if(this.orderReceiveDate != null){
      orderReceiveDate = firebase.firestore.Timestamp.fromDate(this.orderReceiveDate);
    }

    if(this.addressOwner.length > 0){     
      newRowTransport.MY_ADDRESS_DROPDOWN = this.addressOwner[this.addressOwner.length-1].value;
      newRowTransport.MY_ADDRESS = this.addressOwner[this.addressOwner.length-1].value;
    }

    newRowTransport.TRACKING_NO = this.order.TRACKING_NO;
    newRowTransport.TRANSPORT_NO = t;
    newRowTransport.TRANSPORT_NAME = this.app.getSelectLabel(t,this.deleverList);
    newRowTransport.PACKDATE_DATE = packDate;
    newRowTransport.TRANSPORT_DATE = transportDate;
    newRowTransport.RECIEVE_DATE = orderReceiveDate;
    newRowTransport.TRACKING_NO = this.order.TRACKING_NO;

    newRowTransport.CREATE_DATE = firebase.firestore.Timestamp.now();
    newRowTransport.CREATE_BY = this.app.getUsername();
    newRowTransport.UPDATE_DATE = firebase.firestore.Timestamp.now();
    newRowTransport.UPDATE_BY = this.app.getUsername();
    newRowTransport.HEAD_CD = this.app.getHead();
    newRowTransport.PROJECT = this.app.getProject();
    this.orderTransport.push(newRowTransport);

    if(this.order.STATUS_TRANFER_NO =='COD'){
      this.orderPay = [];
      this.newRowOrderPay.ORDER_NO = this.order.ORDER_NO;
      this.newRowOrderPay.BANK_CODE = null;
      this.newRowOrderPay.BANK_NAME = null;
      this.newRowOrderPay.STATUS_TRANFER_NO = this.order.STATUS_TRANFER_NO;
      this.newRowOrderPay.STATUS_TRANFER_NAME = this.app.getSelectLabel(this.newRowOrderPay.STATUS_TRANFER_NO,this.transferList);
      this.newRowOrderPay.DELIVER_CODE = t;
      this.newRowOrderPay.DELIVER_NAME = this.app.getSelectLabel(t,this.deleverList);
      this.newRowOrderPay.PAY_DATE = orderReceiveDate;
      this.newRowOrderPay.COD_SERVICE = this.order.COD;
      this.newRowOrderPay.AMOUNT = this.order.TOTAL_ORDER;
      this.newRowOrderPay.CREATE_DATE = firebase.firestore.Timestamp.now();
      this.newRowOrderPay.CREATE_BY = this.app.getUsername();
      this.newRowOrderPay.UPDATE_DATE = firebase.firestore.Timestamp.now();
      this.newRowOrderPay.UPDATE_BY = this.app.getUsername();
      this.newRowOrderPay.ACTIVE_FLAG = 'Y';
      this.newRowOrderPay.HEAD_CD = this.app.getHead();
      this.newRowOrderPay.PROJECT = this.app.getProject();
      this.orderPay.push(this.newRowOrderPay);
    }
    this.hideDialog();
    this.misc.progressSpinner(false);
  }

  async saveOrderTransport(){
    this.misc.progressSpinner(true);
    var db = firebase.firestore();
    //let batch =  db.batch();
    this.order.TRANSPORT_REF_ID  = [];
    for (let index = 0; index < this.orderTransport.length; index++) {
      let detail = this.orderTransport[index];
      var key = db.collection(this.app.DB.ORDER_TRANSPORT).doc().id;
      let obj = Object.assign({}, detail);
      this.order.TRANSPORT_REF_ID.push(key);
      this.orderService.createOrderTransport(key,obj);
      //batch.set(ref, obj);

      // if(this.uploadedFilesTransport.length > 0 && detail.ATTACFILE_NAME != null){
      //   for (let file of this.uploadedFilesTransport) {
      //     if(file.name == detail.ATTACFILE_NAME){
      //       let newName = this.app.getHead() + this.app.transformDate(new Date(),'yyyyMMddHHmmss');
      //       let doc = this.pathOrderTransport+newName;
      //       detail.ATTACFILE_NAME = doc;
      //       this.task = this.storage.upload(doc,file);
      //       (await this.task).ref.getDownloadURL().then(url => { 
      //         detail.ATTACFILE_URL = url;  
      //         let obj2 = Object.assign({}, detail);
      //         this.orderService.createOrderTransport(key,obj2);
      //         //batch.update(ref, obj2);      
      //       });
      //     }
      //   }
      // }
      
    }
    //batch.commit();
    this.misc.progressSpinner(false);
  }

  valedateb4Save(){
    let result = true;
    if(this.orderDetail.length == 0){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาเลือกใส่สินค้า');
      result = false;
    }else if(this.orderPay == null || this.orderPay.length == 0){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาเลือกการชำระเงิน');
      result = false;
    }else if(this.orderTransport == null || this.orderTransport.length == 0){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาเลือกการส่งสินค้า');
      result = false;
    }
    else if(this.order.STATUS_TRANFER_NO == undefined || this.order.STATUS_TRANFER_NO == null){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาเลือกการชำระเงิน');
      result = false;
    }else if(this.order.CHANNEL_NO == undefined || this.order.CHANNEL_NO == null){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาเลือกช่องทาง');
      result = false;
    }else if(this.order.CUS_NAME == undefined || this.order.CUS_NAME == null){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาใส่ชื่อลูกค้า');
      result = false;
    }else if(this.order.CUS_ADDRESS == undefined || this.order.CUS_ADDRESS == null){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาใส่ที่อยู่');
      result = false;
    }else if(this.order.CUS_TEL1 == undefined || this.order.CUS_TEL1 == null){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาใส่เบอร์โทร');
      result = false;
    }else if(this.order.CUS_FULL_ADDRESS == undefined || this.order.CUS_FULL_ADDRESS == null){
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'กรุณาใส่ตำบล อำเภอ จังหวัด รหัสไปรษณีย์');
      result = false;
    }
    return result;
  }

  beforesave(){
    if(this.order.ORDER_DETAILS != null && this.order.ORDER_DETAILS.length > 0){
      for (let index = 0; index < this.order.ORDER_DETAILS.length; index++) {
        let key = this.order.ORDER_DETAILS[index];
        this.orderService.deleteOrderDetails(key);
      }
    }


    if(this.order.STOCK_REF_ID != null && this.order.STOCK_REF_ID.length > 0){
      for (let index = 0; index < this.order.STOCK_REF_ID.length; index++) {
        let key = this.order.STOCK_REF_ID[index];
        this.stockService.deleteSTock(key);
      }
    }

    if(this.order.PAY_REF_ID != null && this.order.PAY_REF_ID.length > 0){
      for (let index = 0; index < this.order.PAY_REF_ID.length; index++) {
        let key = this.order.PAY_REF_ID[index];
        this.orderService.deleteOrderPay(key);
      }
    }

    if(this.order.TRANSPORT_REF_ID != null && this.order.TRANSPORT_REF_ID.length > 0){
      for (let index = 0; index < this.order.TRANSPORT_REF_ID.length; index++) {
        let key = this.order.TRANSPORT_REF_ID[index];
        this.orderService.deleteOrderTransport(key);
      }
    }

    let orderDate = firebase.firestore.Timestamp.fromDate(this.orderDate);
    let orderReceiveDate = null;
    if(this.orderReceiveDate != null){
      orderReceiveDate = firebase.firestore.Timestamp.fromDate(this.orderReceiveDate);
    }

    let packDate = null;
    if(this.orderReceiveDate != null){
      packDate = firebase.firestore.Timestamp.fromDate(this.packDate);
    }

    let transportDate = null;
    if(this.transportDate != null){
      transportDate = firebase.firestore.Timestamp.fromDate(this.transportDate);
    }

    
    let findCustomer = false;
    for(let i = 0; i < this.customers.length; i++) {
      let a : Customer = this.customers[i];
      if(this.order.CUS_NAME == a.CUS_NAME && this.order.CUS_TEL1 == a.TEL && this.order.NAME_SOCIAL == a.CUS_NAME_SOCIAL){
        findCustomer = true;
      }
    }

    if(!findCustomer){
      let cus = new Customer();
      cus.CUS_NAME = this.order.CUS_NAME;
      cus.CUS_NAME_SOCIAL = this.order.NAME_SOCIAL;
      cus.TEL = this.order.CUS_TEL1;
      cus.TEL2 = this.order.CUS_TEL2;
      cus.EMAIL = this.order.EMAIL;
      cus.CUS_ADDRESS = this.order.CUS_ADDRESS;
      cus.CUS_FULL_ADDRESS = this.order.CUS_FULL_ADDRESS;
      cus.CUS_DISTRICT = this.order.CUS_DISTRICT;
      cus.CUS_AMPHURE = this.order.CUS_AMPHURE;
      cus.CUS_PROVINCE = this.order.CUS_PROVINCE;
      cus.CUS_ZIPCODE= this.order.CUS_ZIPCODE;
      cus.CREATE_DATE = firestore.Timestamp.now();
      cus.CREATE_BY = this.app.getUsername();
      cus.UPDATE_DATE = firestore.Timestamp.now();
      cus.UPDATE_BY = this.app.getUsername();
      cus.HEAD_CD = this.app.getHead();
      cus.PROJECT = this.app.getProject();
      this.masterService.createCustomer(cus);
    }

    this.order.STATUS_TRANFER_NAME = this.app.getSelectLabel(this.order.STATUS_TRANFER_NO,this.transferList);
    this.order.SKILL_NAME = this.app.getSelectLabel(this.order.SKILL_NO,this.skills);
  
    let ch = this.app.getDropdownFromList(this.order.CHANNEL_NO,this.channelList);
    this.order.CHANNEL_NAME = ch.VALUE;
    this.order.CHANNEL_TYPE = ch.ATT_01;
    this.order.WAREHOUSE_NAME = ch.ATT_02;

    this.order.TANSPORT_RATE_NAME = this.app.getSelectLabel(this.order.TANSPORT_RATE_NO,this.transportList);
    this.order.TRANSPORT_NAME = this.app.getSelectLabel(this.order.TRANSPORT_NO,this.deleverList);
    this.order.BILL_NAME = this.order.CUS_NAME; 
    this.order.BILL_ADDRESS = this.order.CUS_ADDRESS; 
    this.order.BILL_FULL_ADDRESS = this.order.CUS_FULL_ADDRESS; 
    this.order.BILL_TEL1 =  this.order.CUS_TEL1; 
    this.order.BILL_TEL2 =  this.order.CUS_TEL2; 

    this.order.CUS_ADDRESS_SEND = "";
    this.order.BILL_ADDRESS_SEND = "";

    this.order.CUS_ADDRESS_SEND = this.order.CUS_ADDRESS + " ตำบล "+ this.order.CUS_DISTRICT + 
          " อำเภอ " +this.order.CUS_AMPHURE+ " จังหวัด "+this.order.CUS_PROVINCE+" รหัสไปรษณีย์ "+this.order.CUS_ZIPCODE;
    this.order.BILL_ADDRESS_SEND = this.order.BILL_ADDRESS + " ตำบล "+ this.order.BILL_DISTRICT + 
    " อำเภอ " + this.order.BILL_AMPHURE + " จังหวัด "+ this.order.BILL_PROVINCE +" รหัสไปรษณีย์ "+this.order.BILL_ZIPCODE;

    this.order.PACK_DATE = packDate;
    this.order.RECEIVE_DATE = orderReceiveDate;
    this.order.TRANSPORT_DATE = transportDate;
    this.order.ORDER_DATE = orderDate;
    
    this.order.ACTIVE_FLAG = 'Y';
    this.order.UPDATE_BY = this.app.getUsername();
    this.order.UPDATE_DATE = firebase.firestore.Timestamp.now();
    
    if(this.order.STATUS_TRANFER_NO != null){
      this.order = this.orderService.submitOrder(this.order);
    }

    if(this.order.FLAG_COD){
      this.order = this.orderService.confirmOrder(this.order);
    }
    
    //const AMOUNT_TRANFER : number = this.order.AMOUNT_TRANFER;  
    const ORDER_STEP : number = this.order.ORDER_STEP;    
    const PRODUCT_QTY : number = this.order.PRODUCT_QTY;
    const SHIPPING_COST : number = this.order.SHIPPING_COST;
    const DISCOUNT_AMOUNT : number = this.order.DISCOUNT_AMOUNT;
    const DISCOUNT_PERCENT : number = this.order.DISCOUNT_PERCENT;
    const TOTAL_DC : number = this.order.TOTAL_DC;
    const TOTAL_ORDER : number = this.order.TOTAL_ORDER; 
    const TOTAL_COMMISSION : number = this.order.TOTAL_COMMISSION;
    const TOTAL_PAY : number = this.order.TOTAL_PAY;
    const TAX : number = this.order.TAX;
    const VAT : number = this.order.VAT;
    const COD : number = this.order.COD;

    this.order.ORDER_STEP = ORDER_STEP;    
    this.order.PRODUCT_QTY = PRODUCT_QTY;
    this.order.SHIPPING_COST = SHIPPING_COST;
    this.order.DISCOUNT_AMOUNT = DISCOUNT_AMOUNT;
    this.order.DISCOUNT_PERCENT = DISCOUNT_PERCENT;
    this.order.TOTAL_DC = TOTAL_DC;
    this.order.TOTAL_ORDER = TOTAL_ORDER; 
    this.order.TOTAL_COMMISSION = TOTAL_COMMISSION;
    this.order.TOTAL_PAY = TOTAL_PAY;
    this.order.TAX = TAX;
    this.order.VAT = VAT;
    this.order.COD = COD;
    //this.order.AMOUNT_TRANFER = AMOUNT_TRANFER;

    //this.order.ORDER_DETAILS = [];
    this.stockList = [];
    this.orderDetail.forEach(d => {
      let s = new Stock();
      s.WAREHOUSE_NAME = this.order.WAREHOUSE_NAME;
      s.REF = null;

      s.ORDER_NO = this.order.ORDER_NO;
      s.DATE =  this.order.ORDER_DATE;

      s.STOCK_CATGORY = 'STOCK_OUT';
      s.STOCK_CD =  'PRODUCT_SALE';
      s.STOCK_CATGORY_LABEL = 'สินค้าออก';
      s.STOCK_CD_LABEL = 'ของขาย';
    
      s.PRODUCT_SKU = d.PRODUCT_SKU;
      s.PRODUCT_NAME = d.PRODUCT_NAME;
      s.PRODUCT_CATEGORY = d.PRODUCT_CATEGORY;

      const amount : number = Number(d.AMOUNT);

      s.AMOUNT = amount;
      s.AMOUNT_IN = 0;
      s.AMOUNT_OUT = amount;


      s.REMARK = null;

      const price : number = Number(d.PRICE);
      const dcPercent : number = Number(d.DCPERCENT);
      const dcAmount : number = Number(d.DCAMOUNT);
      const commission : number = Number(d.COMMISSION);
      const totalPrice : number = Number(d.TOTAL_PRICE);
      const totalComm : number = Number(d.TOTAL_COMM);

      s.PRICE = price;
      s.DCPERCENT = dcPercent;
      s.DCAMOUNT = dcAmount;
      s.COMMISSION = commission;
      s.TOTAL_PRICE = totalPrice;
      s.TOTAL_COMM = totalComm;
      s.UNIT = d.UNIT;
      s.UNIT_NAME = this.app.getSelectLabel(d.UNIT,this.units);;

      s.CREATE_DATE = firebase.firestore.Timestamp.now();
      s.CREATE_BY = this.app.getUsername();
      s.UPDATE_DATE = firebase.firestore.Timestamp.now();
      s.UPDATE_BY = this.app.getUsername();
      s.HEAD_CD = this.app.getHead();
      s.PROJECT = this.app.getProject();
      this.stockList.push(s);
    });

    for (let index = 0; index < this.orderPay.length; index++) {
      let detail = this.orderPay[index];
      this.orderPay[index].BANK_NAME = this.app.getSelectLabel(detail.BANK_CODE,this.bankList);
      this.orderPay[index].DELIVER_NAME = this.app.getSelectLabel(detail.DELIVER_CODE,this.deleverList); 
    }

    for (let index = 0; index < this.orderTransport.length; index++) {
      let detail = this.orderTransport[index];
      this.orderTransport[index].TRANSPORT_NAME = this.app.getSelectLabel(detail.TRANSPORT_NO,this.deleverList);
    }
  }

  updateOrderHeader(){
    let obj = Object.assign({}, this.order);
    this.orderService.createOrUpdateOrder(this.key,obj);
  }

  async save(){
    //if(this.valedateb4Save()){
      this.beforesave();
      this.saveOrderPay();
      this.saveOrderTransport();
      this.addDataToStock();
      this.addOrderDetail();

      this.updateOrderHeader();
      this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการกดบันทึกใบสั่งซื้อ",this.order);
   // }
  }

  saveAndBack(){
    this.misc.progressSpinner(true);
    if(this.valedateb4Save()){
      this.save();
      this.location.back();
    }
    this.misc.progressSpinner(false);
  }

  saveAndNew(){
    this.misc.progressSpinner(true);
    if(this.valedateb4Save()){
      this.save();
      this.ngOnInit();
    }
    this.misc.progressSpinner(false);
  }

  async reOrder(){

  }
}

