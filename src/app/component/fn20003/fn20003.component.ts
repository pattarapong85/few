import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OrderHeader } from 'src/app/models/order-header';
import { OrderDetail } from 'src/app/models/order-detail';
import { OrderHistory } from 'src/app/models/order-history';
import { OrderPay } from 'src/app/models/order-pay';
import { OrderTransport } from 'src/app/models/order-transport';
import { OrderNote } from 'src/app/models/order-note';
import { Address } from 'src/app/models/address';
import { ConfirmationService } from 'primeng/api';
import { MasterService } from 'src/app/service/master.service';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { OrderService } from 'src/app/service/order.service';
import { AppService } from 'src/app/service/app.service';
import * as firebase from 'firebase';
import { firestore } from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import { Location } from '@angular/common';
import { Dropdown } from 'src/app/models/dropdown';
import { Product } from 'src/app/models/product';
import {MenuItem} from 'primeng/api';
import { Head } from 'src/app/models/head';
import { Stock } from 'src/app/models/stock';
import addressJson from 'src/assets/address.json';

@Component({
  selector: 'app-fn20003',
  templateUrl: './fn20003.component.html',
  styleUrls: ['./fn20003.component.scss']
})
export class Fn20003Component implements OnInit {
  private subscriptions: Subscription[] = [];

  key : string;

  disAddpay : boolean;
  disConfirmPayCOD : boolean;
  disConfirmPayTNF : boolean;

  disAddTransport : boolean;
  disConfirmTransport : boolean;

  addressType : string;
  imageURL : string;

  orderDate : Date = null;
  transferDate : Date = null;
  transportDate : Date = null;
  orderReceiveDate : Date = null;
  productList : [];

  orderDateStr : String = null;

  order = new OrderHeader;
  orderDetail : OrderDetail [] = [];
  orderPay : OrderPay [] = [];
  orderTransport : OrderTransport [] = [];
  orderNote : OrderNote [] = [];
  orderHistory : OrderHistory [] = [];

  task: AngularFireUploadTask;
  pathOrderPay :string;
  pathOrderTransport :string;
  pathOrderNote :string;

  fncDialogOrderPay : boolean;
  fncDialogOrderTransport : boolean;
  fncDialogOrderMessage : boolean;
  fncDialogOrderSlip : boolean;
  fncAddressDialog : boolean;

  newRowOrderPay : OrderPay;
  newRowTransport : OrderTransport;
  newRowOrderNote : OrderNote;
  newRowHistory : OrderHistory;
  newRowAddress : any;

  uploadedFiles: any[] = [];


  addressList : SelectItem[] = [];

  bankList : SelectItem[] = [];
  transferList : SelectItem[] = [];
  transportList : SelectItem[] = [];
  taxTypeList : SelectItem[] = [];
  deleverList : SelectItem[] = [];
  statusDiscountList : SelectItem[] = [];
  statusList: SelectItem[];

  //colsPay  : any[];
  colsTransport  : any[];
  colsNote : any[];
  colsHistory : any[];

  items: MenuItem[];
  activeIndex: number = 0;

  addressFullList : any[];
  filteredAddress: any[];

  constructor(private app : AppService,
    private firestore : AngularFirestore ,
    private router: Router,
    private route: ActivatedRoute,
    private misc: MiscComponent,
    private confirmationService: ConfirmationService,
    private orderService : OrderService,
    private storage: AngularFireStorage,
    
    private location: Location,
    private masterService : MasterService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.route.params.subscribe(params => {
      this.key = params['orderId'];
      this.getOrder(this.key);
    }));

    this.getBankList();
    this.getDeleverList();
    this.getAddressSenditems();

    let item = [];
    this.app.getStatusFlag().forEach(element => {
      if(element['value'] == 'Y'){
        item.push({label: 'ยืนยัน', value: 'Y'});
      }else{
        item.push({label: 'ยังไม่ยืนยัน', value: 'N'});
      }
    });

    this.statusList = item;

    this.colsTransport = [
      { field: 'TRANSPORT_NAME', header: 'บริการขนส่ง' },
      { field: 'ATTACFILE_URL', header: 'ไฟล์แนบ' },
      { field: 'TRANSPORT_DATE_FMT', header: 'วันที่ส่งสินค้า' },
      { field: 'TRACKING_NO', header: 'หมายเลขแทร็คกิ้ง' },
      { field: 'CREATE_BY', header: 'ผู้ทำรายการ' },
      { field: 'CREATE_DATE_FMT', header: 'วันที่ทำรายการ' },
      { field: 'UPDATE_BY', header: 'ผู้ทำการอัพเดรท' },
      { field: 'UPDATE_DATE_FMT', header: 'วันที่ทำการอัพเดรท' }
    ];

    this.colsNote = [
      { field: 'MESSAGE', header: 'ข้อความ' },
      { field: 'ATTACFILE_URL', header: 'ไฟล์แนบ' },
      { field: 'CREATE_DATE_FMT', header: 'วันที่สร้าง' },
      { field: 'CREATE_BY', header: 'ผู้ทำการสร้าง' },
      { field: 'UPDATE_DATE_FMT', header: 'วันที่แก้ไข' },
      { field: 'UPDATE_BY', header: 'ผู้ทำการแก้ไข' }
    ];
    
    this.colsHistory = [
      { field: 'DETAIL', header: 'รายละเอียด' },
      { field: 'CREATE_DATE_FMT', header: 'วันที่/เวลา ทำรายการ' },
      { field: 'CREATE_BY', header: 'ผู้ทำรายการ' }
    ];
  }

  statusOrder(order : OrderHeader){
    let items = [];

    if(order.STATUS_TRANFER_NO == 'COD'){
      items = [{
        label: 'รอการดำเนินการ',
        command: (event: any) => {
            this.activeIndex = 0;
        }
        },
        {
            label: 'ยังไม่จ่ายเงิน',
            command: (event: any) => {
                this.activeIndex = 1;
            }
        },
        {
            label: 'ยืนยันการส่ง COD',
            command: (event: any) => {
                this.activeIndex = 2;
            }
        },
        {
            label: 'กำลังแพ็ค',
            command: (event: any) => {
                this.activeIndex = 3;
            }
        },
        {
            label: 'กำลังส่ง',
            command: (event: any) => {
                this.activeIndex = 4;
            }
        },
        {
            label: 'ยืนยัน',
            command: (event: any) => {
                this.activeIndex = 5;
            }
        },
        {
            label: 'สำเร็จ',
            command: (event: any) => {
                this.activeIndex = 6;
            }
        }
      ];
    }else{
      items = [{
        label: 'รอการดำเนินการ',
        command: (event: any) => {
            this.activeIndex = 0;
        }
    },
    {
        label: 'ยังไม่จ่ายเงิน',
        command: (event: any) => {
            this.activeIndex = 1;
        }
    },
    {
        label: 'จ่ายแล้ว',
        command: (event: any) => {
            this.activeIndex = 2;
        }
    },
    {
        label: 'ยืนยัน',
        command: (event: any) => {
            this.activeIndex = 3;
        }
    },
    {
        label: 'กำลังแพ็ค',
        command: (event: any) => {
            this.activeIndex = 4;
        }
    },
    {
        label: 'กำลังส่ง',
        command: (event: any) => {
            this.activeIndex = 5;
        }
    },
    {
        label: 'สำเร็จ',
        command: (event: any) => {
            this.activeIndex = 6;
        }
    }
  ];
  }
  this.items = items;
  }


  backToTable(){
    this.location.back();
  }

  getOrder(key : string){
    this.orderService.getOrder(key).snapshotChanges()
    .subscribe(response => {
     this.order =  <OrderHeader>response.payload.data();
     this.pathOrderPay  = this.app.getHead()+"/Order/"+this.order.ORDER_NO+'/uploadTranfer/';
     this.pathOrderTransport  = this.app.getHead()+"/Order/"+this.order.ORDER_NO+'/uploadDeliver/';
     this.pathOrderNote  = this.app.getHead()+"/Order/"+this.order.ORDER_NO+'/uploadNote/';
     this.orderDate = this.order.ORDER_DATE.toDate();

     this.orderDateStr = this.app.transformDate(this.orderDate,"dd/MM/yyyy");

 

      /*if(this.order.STATUS_TRANFER_NO == 'COD'){
     this.colsPay = [
        { field: 'DELIVER_NAME', header: 'การชำระเงิน' },
        { field: 'ATTACFILE_URL', header: 'หลักฐานการชำระเงิน' },
        { field: 'CREATE_DATE_FMT', header: 'วันที่/เวลา' },
        { field: 'AMOUNT', header: 'ยอดรวม' },
        { field: 'COD_SERVICE', header: 'ค่าบริการ COD' },
        { field: 'FEE', header: 'ค่าธรรมเนียม' },
        { field: 'REF', header: 'REF.' },
        { field: 'REMARK', header: 'หมายเหตุ' },
        // { field: 'FLAG', header: 'สถานะ' }
      ];
    }else if(this.order.STATUS_TRANFER_NO == 'BANK'){
      this.colsPay = [
        { field: 'BANK_NAME', header: 'การชำระเงิน' },
        { field: 'ATTACFILE_URL', header: 'หลักฐานการชำระเงิน' },
        { field: 'CREATE_DATE_FMT', header: 'วันที่/เวลา' },
        { field: 'ACCOUNT_NO', header: 'เลขบัญชี' },
        { field: 'AMOUNT', header: 'ยอดรวม' },
        { field: 'FEE', header: 'ค่าธรรมเนียม' },
        { field: 'REF', header: 'REF.' },
        { field: 'REMARK', header: 'หมายเหตุ' },
        { field: 'FLAG', header: 'สถานะ' }
      ];
    }*/
     
     if(this.order.RECEIVE_DATE != null && this.order.RECEIVE_DATE != undefined){
       this.orderReceiveDate = this.order.RECEIVE_DATE.toDate();
     }

     this.activeIndex = this.order.ORDER_STEP;

     this.statusOrder(this.order);

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
      let items = [];
      for (let item of response) {
        let e = <OrderPay>item.payload.doc.data();
        
        e['KEY'] = item.payload.doc.id;
        e['FLAG'] = e.ACTIVE_FLAG == 'Y' ? 'ยืนยัน' : 'ยังไม่ยืนยัน';
        e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy HH:mm");

        if(e.PAY_DATE != null && e.PAY_DATE != undefined){
          this.transferDate = e.PAY_DATE.toDate();
        }

        items.push(e);
      }
      this.orderPay = items;
      this.disAddpay = true;
      this.disConfirmPayCOD= true;
      this.disConfirmPayTNF= true;
      this.disAddTransport= true;
      this.disConfirmTransport= true;
      
      if(this.order.STATUS_TRANFER_NO == 'COD'){
        if(this.order.STATUS ==  this.app.STATUS.SEND){
          this.disAddpay = false;
          this.disConfirmPayCOD = false;
          this.disConfirmPayTNF= false;
        }
      }else{
        //BANK
        if(this.order.STATUS ==  this.app.STATUS.CONFIRM || this.order.STATUS ==  this.app.STATUS.NO_PAY){
          this.disAddpay= false;
          this.disConfirmPayCOD = false;
          this.disConfirmPayTNF= false;
        }
      }

      if(this.order.STATUS ==  this.app.STATUS.PACK){
        this.disAddTransport = false;
        this.disConfirmTransport = false;
      }

      /*if(this.order.STATUS_TRANFER_NO == 'COD'){
        this.disConfirmPayTNF= true;

        if(this.order.SEND_STATUS == true){
          this.disAddpay = false;
          if(this.orderPay.length > 0){
            this.disConfirmPayCOD= false;
          }
        }else{
          this.disAddpay = true;
        }
      }else{
        this.disConfirmPayCOD= true;
        if(this.order.SEND_STATUS == true){
          this.disAddpay = true;
          this.disConfirmPayTNF= true;
        }else{
          this.disAddpay = false;
          this.disConfirmPayTNF= false;
        }
      }

      if(this.order.STATUS == this.app.STATUS.CONFIRM){
        this.disAddpay = true;
        this.disConfirmPayCOD= true;
        this.disConfirmPayTNF= true;
      }*/
      


      }, error => {
        console.log("ERROR",error);
      });

      this.orderService.getOrderTransport(this.app.getHead(),this.order.ORDER_NO).snapshotChanges().subscribe(response => {
        let items = [];
        for (let item of response) {
          let e = <OrderTransport>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy HH:mm");
          e['UPDATE_DATE_FMT'] = this.app.transformTimestamp(e.UPDATE_DATE,"dd/MM/yyyy HH:mm");
          if(e.TRANSPORT_DATE){
            e['TRANSPORT_DATE_FMT'] = this.app.transformTimestamp(e.TRANSPORT_DATE,"dd/MM/yyyy HH:mm");
          }
          items.push(e);
        }
        this.orderTransport = items;

        

        /*if(this.order.STATUS_TRANFER_NO == 'COD'){
          this.disAddTransport= true;
        }else{
          if(this.order.STATUS == this.app.TRANFER.PACK){
            this.disAddTransport = false;
            this.disConfirmTransport = false;
          }else{
            this.disAddTransport = true;
            this.disConfirmTransport = true;
          }
        }*/
        }, error => {
          console.log("ERROR",error);
        });


      this.orderService.getOrderNote(this.app.getHead(),this.order.ORDER_NO).snapshotChanges().subscribe(response => {
        let items = [];
        for (let item of response) {
          let e = <OrderNote>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy HH:mm");
          e['UPDATE_DATE_FMT'] = this.app.transformTimestamp(e.UPDATE_DATE,"dd/MM/yyyy HH:mm");
          items.push(e);
        }
        this.orderNote = items;
        }, error => {
          console.log("ERROR",error);
        });


        this.orderService.getOrderHistory(this.app.getHead(),this.order.ORDER_NO).snapshotChanges().subscribe(response => {
          let items = [];
          for (let item of response) {
            let e = <OrderHistory>item.payload.doc.data();       
            e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy HH:mm");
            items.push(e);
          }
          this.orderHistory = items;
          }, error => {
            console.log("ERROR",error);
          });

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
    
    this.addressList = items;
  }, error => {
    console.log("ERROR",error);
  });
 }

 editOrder(){
    this.router.navigate(['/fn20002/'+this.key]);
  }

  preOrder(){
    this.misc.progressSpinner(true);
    if(this.order.STATUS == this.app.STATUS.CONFIRM){
      this.order.PRE_ORDER = true;
      this.updateOrderHeader();
    }else{
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'ไม่สามารถถ Pre Order ได้');
    }
    this.misc.progressSpinner(false);
  }

  reOrder(){
    this.misc.progressSpinner(true);
    if(this.order.STATUS == this.app.STATUS.CONFIRM){
      this.transferDate = null;
      this.order = this.orderService.reOrder(this.order);
      this.updateOrderHeader();
    }else{
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'ไม่สามารถถ Reorder ได้');
    }
    this.misc.progressSpinner(false);
  }

  deleteFile(key) {
    this.misc.progressSpinner(true);
    let obj = Object.assign({}, this.order);
    this.orderService.createOrUpdateOrder(this.key,obj);
    this.orderService.deleteFile(key);
    this.misc.progressSpinner(false);
}

  cancelOrder(){
    this.misc.progressSpinner(true);
    this.order.ACTIVE_FLAG = 'N';
    this.updateOrderHeader();
    this.misc.progressSpinner(false);
  }

 getDeleverList() {
  let gategory = this.app.PRODUCT.CATEGORY;
  let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_DELIVER;
  this.masterService.getDropdownList(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
  .subscribe(response => {
    let items = [];
    for (let item of response) {
      let e = <Dropdown>item.payload.doc.data();
      items.push({label: e.CD + " " + e.VALUE, value: e.CD});
    }
    this.deleverList = items;
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

  onchangeBank(e){
    for(let i=0;i<this.bankList.length;i++){
      let b = this.bankList[i];
      if(e.value == b['value']){
        this.newRowOrderPay.BANK_NAME = b['label'];
      }
    }
    
    //this.orderPay.
  }

  onchangeCOD(e){
    this.misc.progressSpinner(true);
    for(let i=0;i<this.deleverList.length;i++){
      let b = this.deleverList[i];
      if(e.value == b['value']){
        this.newRowOrderPay.DELIVER_NAME = b['label'];
      }
    }
    this.misc.progressSpinner(false);
  }

  onchangeTransport(e){
    for(let i=0;i<this.deleverList.length;i++){
      let b = this.deleverList[i];
      if(e.value == b['value']){
        this.newRowTransport.TRANSPORT_NO = b['value'];
        this.newRowTransport.TRANSPORT_NAME = b['label'];
      }
    }
  }

  onchangeAddress(e){
    this.newRowTransport.MY_ADDRESS = e.value;
  }

  hideDialog(){
    this.fncDialogOrderPay = false;
    this.fncDialogOrderSlip = false;
    this.fncDialogOrderTransport = false;
    this.fncDialogOrderMessage = false;
    this.fncAddressDialog = false;
  }


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
    this.newRowOrderPay.STATUS_TRANFER_NAME = this.order.STATUS_TRANFER_NAME;
    this.newRowOrderPay.AMOUNT = null;
    this.newRowOrderPay.COD_SERVICE = null;
    // this.newRowOrderPay.FEE = this.order.FEE;
    // this.newRowOrderPay.REMARK = this.order.REMARK_TRANFER;
    // this.newRowOrderPay.ACCOUNT_NO =  this.order.ACCOUNT_NO;
    // this.newRowOrderPay.REF = this.order.REF_TRANFER;
     
    this.newRowOrderPay.CREATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowOrderPay.CREATE_BY = this.app.getUsername();
    this.newRowOrderPay.UPDATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowOrderPay.UPDATE_BY = this.app.getUsername();
    this.newRowOrderPay.ACTIVE_FLAG = 'N';
    this.newRowOrderPay.HEAD_CD = this.app.getHead();
    this.newRowOrderPay.PROJECT = this.app.getProject();
  }

  confirmPay(){
    this.misc.progressSpinner(true);
    let chk = true;
    let total : number = 0;
    this.orderPay.forEach(element => {
      total = total +element.AMOUNT;
      if(element.ACTIVE_FLAG == 'N'){
        chk = false;
      }
    });
    if(chk == true && total >= this.order.TOTAL_ORDER){
      this.confirmationService.confirm({
        message: 'คุณต้องการยืนยันเงินครบใช่หรือไม่?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.order = this.orderService.paiedOrder(this.order);
          this.updateOrderHeader();
          this.misc.newMessage('s', 'สำเร็จ', 'ยืนยันการชำระเงินครบเรียบร้อย');
        }
      });
      
    }else{
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีบางข้อมูลยังไม่ได้ยืนยันหรือเงินไม่ครบ');
    }
    this.misc.progressSpinner(false);
  }

  confirmPayCOD(){
    this.misc.progressSpinner(true);
    let chk = true;
    this.orderPay.forEach(element => {
      if(element.ACTIVE_FLAG == 'N'){
        chk = false;
      }
    });
    
    if(chk == true){
      this.order = this.orderService.paiedOrder(this.order);
      this.updateOrderHeader();
      this.misc.newMessage('s', 'สำเร็จ', 'ยืนยันการชำระเงินครบเรียบร้อย');
    }else{
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีบางข้อมูลยังไม่ได้ยืนยัน');
    }
    
    this.misc.progressSpinner(false);
  }

  // updateStatusOrder(action){
  //   this.order = this.orderService.updateStatusOrder(this.order,action);
  //   this.updateOrderHeader();
  // }

  openNewTransport(){    
    this.fncDialogOrderTransport = true;
    this.transportDate = new Date();
    this.newRowTransport = new OrderTransport();
    if(this.addressList.length > 0){
      this.newRowTransport.MY_ADDRESS_DROPDOWN = this.addressList[this.addressList.length-1].value;
      this.newRowTransport.MY_ADDRESS = this.addressList[this.addressList.length-1].value;
    }
    this.newRowTransport.ORDER_NO = this.order.ORDER_NO;
    this.newRowTransport.CUS_NAME = this.order.CUS_NAME;
    this.newRowTransport.CUS_ADDRESS_FULL = this.order.CUS_ADDRESS + "ตำบล " +this.order.CUS_DISTRICT + "อำเภอ" + this.order.CUS_AMPHURE + "จังหวัด " + this.order.CUS_PROVINCE + " รหัสไปรษณีย์" + this.order.CUS_ZIPCODE ;
    this.newRowTransport.TEL1 = this.order.CUS_TEL1;
    this.newRowTransport.TEL2 = this.order.CUS_TEL2 == undefined ? null: this.order.CUS_TEL2;
    this.newRowTransport.CREATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowTransport.CREATE_BY = this.app.getUsername();
    this.newRowTransport.UPDATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowTransport.UPDATE_BY = this.app.getUsername();
    this.newRowTransport.HEAD_CD = this.app.getHead();
    this.newRowTransport.PROJECT = this.app.getProject();
  }

  openEditAddress(idx){
    this.getAddressList();
    this.addressType = idx;
    this.fncAddressDialog = true;
    this.newRowAddress = {};
    if(idx == 'CUS'){
      this.newRowAddress.NAME = this.order.CUS_NAME;
      this.newRowAddress.ADDRESS = this.order.CUS_ADDRESS;
      this.newRowAddress.FULL_ADDRESS = this.order.CUS_FULL_ADDRESS;
      this.newRowAddress.TEL = this.order.CUS_TEL1;
      this.newRowAddress.TEL2 = this.order.CUS_TEL2;
      this.newRowAddress.DISTRICT = this.order.CUS_DISTRICT;
      this.newRowAddress.AMPHURE = this.order.CUS_AMPHURE;
      this.newRowAddress.PROVINCE = this.order.CUS_PROVINCE;
      this.newRowAddress.ZIPCODE = this.order.CUS_ZIPCODE;
      this.newRowAddress.ADDRESS_SEN = this.order.CUS_ADDRESS_SEND;

    }else{

      this.newRowAddress.NAME = this.order.BILL_NAME;
      this.newRowAddress.ADDRESS = this.order.BILL_ADDRESS;
      this.newRowAddress.FULL_ADDRESS = this.order.BILL_FULL_ADDRESS;
      this.newRowAddress.TEL = this.order.BILL_TEL1;
      this.newRowAddress.TEL2 = this.order.BILL_TEL2;
      this.newRowAddress.DISTRICT = this.order.BILL_DISTRICT;
      this.newRowAddress.AMPHURE = this.order.BILL_AMPHURE;
      this.newRowAddress.PROVINCE = this.order.BILL_PROVINCE;
      this.newRowAddress.ZIPCODE = this.order.BILL_ZIPCODE;
      this.newRowAddress.ADDRESS_SEN = this.order.BILL_ADDRESS_SEND;

    }
  }

  getAddressList() {
      this.addressFullList = [];
      addressJson.data.forEach(e => {
        e['FULL_ADDRESS'] = e.district + " " + e.amphoe + " " + e.province + " " + e.zipcode
        this.addressFullList.push(e);
      });
  }

    filterAddress(event) {
      let filtered : Address[] = [];
      let query = event.query;
      for(let i = 0; i < this.addressFullList.length; i++) {
          let a : Address = this.addressFullList[i];
          if (a['FULL_ADDRESS'].toLowerCase().indexOf(query.toLowerCase()) != -1) {
              filtered.push(a);
          }
      }
      
      this.filteredAddress = filtered;
  }

  onSelectAutoComplete(event){
    //this.newRowAddress.FULL_ADDRESS = event.FULLNAME;
    this.newRowAddress.DISTRICT = event.district;
    this.newRowAddress.AMPHURE = event.amphoe;
    this.newRowAddress.PROVINCE = event.province;
    this.newRowAddress.ZIPCODE = event.zipcode; 
  }

  ConfirmTransport(){
    this.misc.progressSpinner(true);
    let chk = true;
    this.orderTransport.forEach(element => {
      if(element.TRACKING_NO == '' || element.TRACKING_NO == null){
        chk = false;
      }else if(element.TRANSPORT_DATE == null){
        chk = false;
      }
    });
    
    if(chk == true){
      //this.updateStatusOrder(this.app.ACTION.SEND);
      this.order = this.orderService.sendOrder(this.order);
      this.updateOrderHeader();
      this.misc.newMessage('s', 'สำเร็จ', 'ยืนยันการจัดส่งเรียบร้อย');
    }else{
      this.misc.newMessage('e', 'สำเร็จ', 'ยังไม่ได้ใส่หมายเลขแทรกกิ้ง หรือ วันที่ส่งสินค้า');
    }
    this.misc.progressSpinner(false);
  }

  openNewMessage(){
    this.misc.progressSpinner(true);
    this.fncDialogOrderMessage = true;
    this.transportDate = new Date();
    this.newRowOrderNote = new OrderNote();
    this.newRowOrderNote.ORDER_NO = this.order.ORDER_NO;
    this.newRowOrderNote.CREATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowOrderNote.CREATE_BY = this.app.getUsername();
    this.newRowOrderNote.UPDATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowOrderNote.UPDATE_BY = this.app.getUsername();
    this.newRowOrderNote.HEAD_CD = this.app.getHead();
    this.newRowOrderNote.PROJECT = this.app.getProject();
    this.misc.progressSpinner(false);
  }

  onUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }

  editPay(row){
    this.misc.progressSpinner(true);
    this.fncDialogOrderPay = true;
    this.newRowOrderPay = row;
    if(row.PAY_DATE != null){
      this.transferDate = row.PAY_DATE.toDate();
    }
    this.uploadedFiles = [];
    this.misc.progressSpinner(false);
  }

  deletePay(row){
    this.misc.progressSpinner(true);
    this.orderService.deleteOrderPay(row['KEY']);
    this.deleteFileOrderPay(row);
    this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการลบการชำระเงิน",row);
    this.misc.progressSpinner(false);
  }

  editTransport(row){
    this.misc.progressSpinner(true);
    this.fncDialogOrderTransport = true;
    this.newRowTransport = row;
    if(row.TRANSPORT_DATE != null){
      this.transportDate = row.TRANSPORT_DATE.toDate();
    }
    this.uploadedFiles = [];
    this.misc.progressSpinner(false);
  }

  deleteTransport(row){
    this.misc.progressSpinner(true);
    this.orderService.deleteOrderTransport(row['KEY']);
    // this.deleteFileOrderTransport(row);
    this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการลบการขนส่ง",row);
    this.misc.progressSpinner(false);
  }

  editNote(row){
    this.misc.progressSpinner(true);
    this.fncDialogOrderMessage = true;
    this.newRowOrderNote = row;
    this.misc.progressSpinner(false);
  }

  deleteNote(row){
    this.misc.progressSpinner(true);
    this.orderService.deleteOrderNote(row['KEY']);
    this.deleteFileOrderNote(row);
    this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการลบการข้อความ",row);
    this.misc.progressSpinner(false);
  }

  

  openFile(row){
    this.misc.progressSpinner(true);
    this.fncDialogOrderSlip = true;
    this.imageURL = row['ATTACFILE_URL'];
    this.misc.progressSpinner(false);
  }

  openConfirm(row){
    this.misc.progressSpinner(true);
    if(row['ACTIVE_FLAG'] == 'N'){
      this.confirmationService.confirm({
        message: 'คุณต้องการยืนยันตามที่เลือกหรือไม่?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let key = row['KEY'];
          this.newRowOrderPay = row;
          this.newRowOrderPay.ACTIVE_FLAG = 'Y';
          this.UpdateOrderPay(key);
          this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการอัพเดรทการชำระเงิน",this.newRowOrderPay);

          //this.order = this.orderService.confirmOrder (this.order);
          //this.updateOrderHeader();

          this.misc.newMessage('s', 'สำเร็จ', 'ยืนยันการชำระเงินเรียบร้อย');
        }
      });
    }
    this.misc.progressSpinner(false);
  }

  deleteFileOrderPay(row) {
    this.misc.progressSpinner(true);
    if(row['ATTACFILE_NAME'] != null){
      this.orderService.deleteFile(row['ATTACFILE_NAME']);
      this.newRowOrderPay.ATTACFILE_NAME = null;
      this.newRowOrderPay.ATTACFILE_URL = null; 
    }
    this.misc.progressSpinner(false);
  }

  // deleteFileOrderTransport(row) {
  //   this.misc.progressSpinner(true);
  //   if(row['ATTACFILE_NAME'] != null){
  //     this.orderService.deleteFile(row['ATTACFILE_NAME']);
  //     this.newRowTransport.ATTACFILE_NAME = null;
  //     this.newRowTransport.ATTACFILE_URL = null; 
  //   }
  //   this.misc.progressSpinner(false);
  // }

  deleteFileOrderNote(row) {
    this.misc.progressSpinner(true);
    if(row['ATTACFILE_NAME'] != null){
      this.orderService.deleteFile(row['ATTACFILE_NAME']);
      this.newRowOrderNote.ATTACFILE_NAME = null;
      this.newRowOrderNote.ATTACFILE_URL = null; 
    }
    this.misc.progressSpinner(false);
  }

  UpdateOrderPay(key){
    this.newRowOrderPay.UPDATE_BY = this.app.getUsername();
    this.newRowOrderPay.UPDATE_DATE = firebase.firestore.Timestamp.now();
    let obj = Object.assign({}, this.newRowOrderPay);
    delete obj['KEY'];
    delete obj['FLAG'];
    delete obj['CREATE_DATE_FMT'];
    this.orderService.createOrUpdateOrderPay(key,obj);
  }

  updateOrderHeader(){
    this.order.UPDATE_BY = this.app.getUsername();
    this.order.UPDATE_DATE = firebase.firestore.Timestamp.now();
    let obj = Object.assign({}, this.order);
    delete obj['KEY'];
    delete obj['FLAG'];
    delete obj['CREATE_DATE_FMT'];
    this.orderService.createOrUpdateOrder(this.key,obj);
  }

  saveAddress(){
    this.misc.progressSpinner(true);
    if(this.addressType == 'CUS'){
      this.order.CUS_NAME = this.newRowAddress.NAME;
      this.order.CUS_ADDRESS = this.newRowAddress.ADDRESS;
      this.order.CUS_FULL_ADDRESS = this.newRowAddress.FULL_ADDRESS;
      this.order.CUS_TEL1 = this.newRowAddress.TEL;
      this.order.CUS_TEL2 = this.newRowAddress.TEL2;
      this.order.CUS_DISTRICT = this.newRowAddress.DISTRICT;
      this.order.CUS_AMPHURE = this.newRowAddress.AMPHURE;
      this.order.CUS_PROVINCE = this.newRowAddress.PROVINCE;
      this.order.CUS_ZIPCODE = this.newRowAddress.ZIPCODE;
      this.newRowAddress.ADDRESS_SEN = this.order.CUS_ADDRESS_SEND;

       this.order.CUS_ADDRESS_SEND = this.order.CUS_ADDRESS + " ตำบล "+ this.order.CUS_DISTRICT + 
    " อำเภอ " +this.order.CUS_AMPHURE+ " จังหวัด "+this.order.CUS_PROVINCE+" รหัสไปรษณีย์ "+this.order.CUS_ZIPCODE;

    }else{

      this.order.BILL_NAME = this.newRowAddress.NAME;
      this.order.BILL_ADDRESS = this.newRowAddress.ADDRESS;
      this.order.BILL_FULL_ADDRESS = this.newRowAddress.FULL_ADDRESS;
      this.order.BILL_TEL1 = this.newRowAddress.TEL;
      this.order.BILL_TEL2 = this.newRowAddress.TEL2;
      this.order.BILL_DISTRICT = this.newRowAddress.DISTRICT;
      this.order.BILL_AMPHURE = this.newRowAddress.AMPHURE;
      this.order.BILL_PROVINCE = this.newRowAddress.PROVINCE;
      this.order.BILL_ZIPCODE = this.newRowAddress.ZIPCODE;

      this.order.BILL_ADDRESS_SEND = this.order.BILL_ADDRESS + " ตำบล "+ this.order.BILL_DISTRICT + 
    " อำเภอ " + this.order.BILL_AMPHURE + " จังหวัด "+ this.order.BILL_PROVINCE +" รหัสไปรษณีย์ "+this.order.BILL_ZIPCODE;

    }

    this.updateOrderHeader();
    this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการอัพเดรทที่อยู่จัดส่ง",this.order);
    this.hideDialog();
    this.misc.progressSpinner(false);
  }

  async saveOrderPay(){
    this.misc.progressSpinner(true);
    let transferDate = null;
    if(this.transferDate != null){
      transferDate = firebase.firestore.Timestamp.fromDate(this.transferDate);
    }

    this.newRowOrderPay.PAY_DATE = transferDate;

    let key = '';
    if(this.newRowOrderPay['KEY']){
      key = this.newRowOrderPay['KEY'];
      this.UpdateOrderPay(key);
    }else{
      key = this.firestore.firestore.collection(this.app.DB.ORDER_PAY).doc().id;
      let obj = Object.assign({}, this.newRowOrderPay);
      this.orderService.createOrUpdateOrderPay(key,obj);
    }

    if(this.uploadedFiles.length == 1){
      for (let file of this.uploadedFiles) {
        let newName = this.app.getHead() + this.app.transformDate(new Date(),'yyyyMMddHHmmss');
        let doc = this.pathOrderPay+newName;
        this.newRowOrderPay.ATTACFILE_NAME = doc;
        this.task = this.storage.upload(doc,file);
        (await this.task).ref.getDownloadURL().then(url => { 
          this.newRowOrderPay.ATTACFILE_URL = url; 
          this.UpdateOrderPay(key);
          this.uploadedFiles = [];       
        });
      }
    }

    this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการอัพเดรทการชำระเงิน",this.newRowOrderPay);
    this.hideDialog();
    this.misc.progressSpinner(false);
  }


  UpdateOrderTransport(key){
    this.newRowTransport.UPDATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowTransport.UPDATE_BY = this.app.getUsername();
    let obj = Object.assign({}, this.newRowTransport);
    delete obj['KEY'];
    delete obj['UPDATE_DATE_FMT'];
    delete obj['CREATE_DATE_FMT'];
    delete obj['TRANSPORT_DATE_FMT'];
    this.orderService.createOrderTransport(key,obj);
  }

  async saveOrderTransport(){
    this.misc.progressSpinner(true);
    let key = '';

    let transportDate = null;
    if(this.transportDate != null){
      transportDate = firebase.firestore.Timestamp.fromDate(this.transportDate);
      
    }
    this.newRowTransport.TRANSPORT_DATE = transportDate;
    if(this.newRowTransport['KEY']){
      key = this.newRowTransport['KEY'];
      this.UpdateOrderTransport(key);
    }else{
      key = this.firestore.firestore.collection(this.app.DB.ORDER_TRANSPORT).doc().id;
      let obj = Object.assign({}, this.newRowTransport);
      this.orderService.createOrderTransport(key,obj);
    }

    // this.order.TARNSPORT_DATE = transportDate;
    this.order.TRACKING_NO = this.newRowTransport.TRACKING_NO;
    // this.order.TRANSPORT_NO = this.newRowTransport.TRANSPORT_NO;
    // this.order.TRANSPORT_NAME = this.newRowTransport.TRANSPORT_NAME;
    this.order = this.orderService.packOrder(this.order);
    this.updateOrderHeader();
    this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการอัพเดรทการขนส่ง",this.newRowTransport);

    // if(this.uploadedFiles.length == 1){
    //   for (let file of this.uploadedFiles) {
    //     let newName = this.app.getHead() + this.app.transformDate(new Date(),'yyyyMMddHHmmss');
    //     let doc = this.pathOrderTransport+newName;
    //     this.newRowTransport.ATTACFILE_NAME = doc;
    //     this.task = this.storage.upload(doc,file);
    //     (await this.task).ref.getDownloadURL().then(url => { 
    //       this.newRowTransport.ATTACFILE_URL = url; 
    //       this.UpdateOrderTransport(key);
    //       this.uploadedFiles = [];         
    //     });
    //   }
    // }
   
    this.hideDialog();
    this.misc.progressSpinner(false);
  }

  UpdateOrderNote(key){
    this.newRowOrderNote.UPDATE_DATE = firebase.firestore.Timestamp.now();
    this.newRowOrderNote.UPDATE_BY = this.app.getUsername();
    let obj = Object.assign({}, this.newRowOrderNote);
    delete obj['KEY'];
    delete obj['UPDATE_DATE_FMT'];
    delete obj['CREATE_DATE_FMT'];
    this.orderService.createOrderNote(key,obj);
  }

  async saveOrderNote(){
    this.misc.progressSpinner(true);
    let key = '';
    if(this.newRowOrderNote['KEY']){
      key = this.newRowOrderNote['KEY'];
      this.UpdateOrderNote(key);
    }else{
      key = this.firestore.firestore.collection(this.app.DB.ORDER_NOTE).doc().id;
      let obj = Object.assign({}, this.newRowOrderNote);
      this.orderService.createOrderNote(key,obj);
    }

    this.orderService.createOrderHistory(this.order.ORDER_NO,"ทำการอัพเดรทข้อความ",this.newRowOrderNote);
    
    if(this.uploadedFiles.length == 1){
      for (let file of this.uploadedFiles) {
        let newName = this.app.getHead() + this.app.transformDate(new Date(),'yyyyMMddHHmmss');
        let doc = this.pathOrderNote+newName;
        this.newRowOrderNote.ATTACFILE_NAME = doc;
        this.task = this.storage.upload(doc,file);
        (await this.task).ref.getDownloadURL().then(url => { 
          this.newRowOrderNote.ATTACFILE_URL = url; 
          this.UpdateOrderNote(key);
          this.uploadedFiles = [];       
        });
      }
    }

    this.hideDialog();
    this.misc.progressSpinner(false);
  }

  public async getUrl(filepath: string) {
    this.storage.ref(filepath)
      .getDownloadURL()               // it returns url value as observable
      .subscribe((url: string) => {
        // actions with url value
      })
  }

}


