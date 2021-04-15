import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { ComponentProject } from 'src/app/models/component-project';
import { User } from 'src/app/models/user';
import { RoleAccess } from 'src/app/models/role-access';
import { RoleUser } from 'src/app/models/role-user';
import { System } from 'src/app/models/system';
import { Dropdown } from 'src/app/models/dropdown';
import { Address } from 'src/app/models/address';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import * as firebase from 'firebase';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import {formatDate} from '@angular/common';
import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SelectItem } from 'primeng/api';



@Injectable({
  providedIn: 'root'
})
export class AppService {

    dataRef: AngularFirestoreCollection<System> = null;
    roleUserRef: AngularFirestoreCollection<RoleUser> = null;
    roleAccessRef: AngularFirestoreCollection<RoleAccess> = null;
    roleAddressRef: AngularFirestoreCollection<Address> = null;
    componentRef: AngularFirestoreCollection<ComponentProject> = null;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private localStorage: LocalStorageService,
    private firestore: AngularFirestore,
    private cookieService : CookieService,
    private datePipe: DatePipe) { 
    this.dataRef = firestore.collection("SYSTEM");
    this.roleUserRef = firestore.collection("ROLE_USER");
    this.roleAccessRef = firestore.collection("ROLE_ACCESS");
    this.componentRef = firestore.collection("COMPONENT");
        
}

    PRODUCT = {
        CATEGORY: 'PRODUCT', 
        SUB_CATEGORY_CATEGORY_PRODUCT: 'CATEGORY_PRODUCT',
        SUB_CATEGORY_SKILL: 'CATEGORY_SKILL',
        SUB_CATEGORY_CHANNEL: 'CATEGORY_CHANNEL',
        SUB_CATEGORY_TRANSPORT: 'CATEGORY_TRANSPORT',
        SUB_CATEGORY_DELIVER: 'SUB_CATEGORY_DELIVER',
        SUB_CATEGORY_BANK: 'CATEGORY_BANK',
        SUB_CATEGORY_UNIT_PRODUCT: 'UNIT_PRODUCT',
    }; 
    
    SYSTEM = {
        CATEGORY_STATUS: 'STATUS',
        CATEGORY_STOCK: 'STOCK',
        SUB_CATEGORY_CHANNEL : 'CHANNEL',
        SUB_CATEGORY_SEND : 'SEND',
        SUB_CATEGORY_TAX : 'TAX',
        SUB_CATEGORY_TRANSFER : 'TRANSFER',
        SUB_CATEGORY_TRANSPORT : 'TRANSPORT',

        CATEGORY_BANK: 'BANK',
        SUB_CATEGORY_BANK : 'BANK',

        CATEGORY_DELIVER: 'DELIVER',
        SUB_CATEGORY_DELIVER : 'DELIVER',
    }; 
  
    
    USERNAME = 'USERNAME';
    HEAD = 'HEAD';
    PROJECT = 'FEW';

    DB = {
      COMPONENT : 'COMPONENT',
        USERS : 'USERS',
        ROLE : 'ROLE',
        ROLE_USER : 'ROLE_USER',
        ROLE_ACCESS : 'ROLE_ACCESS',

        ORDER_HEADER : 'ORDER_HEADER',
        ORDER_DETAIL : 'ORDER_DETAIL',
        ORDER_HISTORY : 'ORDER_HISTORY',
        ORDER_NOTE : 'ORDER_NOTE',
        ORDER_PAY : 'ORDER_PAY',
        ORDER_TRANSPORT : 'ORDER_TRANSPORT',

        HEAD : 'HEAD',
        SYSTEM : 'SYSTEM',
        EMPLOYEE : 'EMPLOYEE',
        CUSTOMERS : 'CUSTOMERS',
        ADDRESS_ALL : 'ADDRESS_ALL',
        DROPDOWNS : 'DROPDOWNS',
        ATTRIBUTE : 'ATTRIBUTE',
        PRODUCTS : 'PRODUCTS',


        WAREHOUSE : 'WAREHOUSE',
        SUPPLIER : 'SUPPLIER',
        STOCK : 'STOCK',
        PURCHASES : 'PURCHASES',



    };

    ACTION = {
        REORDER : 'REORDER',
        SUBMIT : 'SUBMIT',
        CONFIRM : 'CONFIRM',
        PACK : 'PACK',
        SEND : 'SEND',
        PAID : 'PAID',
        COMPLETE : 'COMPLETE'
    };

    STATUS = {
        DRAFT : 'DRAFT',
        NO_PAY : 'NO_PAY',
        CONFIRM : 'CONFIRM',
        PACK : 'PACK',
        SEND : 'SEND',
        PAIED : 'PAIED',
        COMPLETE : 'COMPLETE',
        RETURN : 'RETURN'
    }

   COD = {
        0: 'รอการดำเนินการ',
        1: 'ยังไม่จ่ายเงิน',
        2: 'ยืนยันการส่งเก็บเงินปลายทาง',
        3: 'กำลังแพ็ค',
        4: 'กำลังส่ง',
        5: 'ยืนยัน',
        6: 'สำเร็จ',
        7: 'ตีกลับ',
    }

    TRANFER = {
        0: 'รอการดำเนินการ',
        1: 'ยังไม่จ่ายเงิน',
        2: 'จ่ายแล้ว',
        3: 'ยืนยัน',
        4: 'กำลังแพ็ค',
        5: 'กำลังส่ง',
        6: 'สำเร็จ',
        7: 'ตีกลับ',
    }

    create(data): void {
        var db = firebase.firestore();
        //this.roleAddressRef.
        //this.roleAddressRef.add({...data});
        //let batch = firestore.
        const batch =  db.batch();


        var newRef = db.collection('ADDRESS_ALL').doc();
        batch.set(newRef, { name: 'New York City' });

    }

    getUsername(){
        return this.cookieService.get(this.USERNAME);
    }

    getHead(){
        return this.cookieService.get(this.HEAD);
    }

    getProject(){
        return this.PROJECT;
    }

    getAllComponent(){
        //let query = firebase.firestore().collection(this.DB.COMPONENT).where("PROJECT", "==", "FEW").orderBy('COMPONENT_CD','asc');
          //query = query.where("HEAD_CD", "==", headCode);
          //query = query.where("ORDER_DATE", ">=",dateFrom);
          //query = query.where("ORDER_DATE", "<=",DateTo);
          //query = query.where("ACTIVE_FLAG", "==", "Y");
           // const a = await query.get();
         // return a;
         return this.firestore.collection(this.DB.COMPONENT, ref => ref.where('PROJECT', "==", 'FEW').orderBy('COMPONENT_CD', 'asc'));
      }
      //componentRef: AngularFirestoreCollection<ComponentProject> = null;
      createComponent(data: ComponentProject): void {
        this.componentRef.add({...data});
      }
     
      updateComponent(key: string, value : any): Promise<void> {
        return this.componentRef.doc(key).set(value,{merge: true});
      }
     
      deleteComponent(key: string): Promise<void> {
        return this.componentRef.doc(key).delete();
      }



    getRoleUserList(user: User) {
        this.roleUserRef = this.firestore.collection("ROLE_USER", ref => ref.where('USERNAME', '==', user.USERNAME)
        .where("HEAD_CD","==",user.HEAD_CD).where("PROJECT","==",user.PROJECT));
        let datareturn = this.roleUserRef.valueChanges()
          .pipe(
            map(users => {
              const user = users;
              return user;
            })
        );
        return datareturn;
    }

    getRoleAccessList(roleCode,headCode,project) {
        this.roleAccessRef = this.firestore.collection("ROLE_ACCESS", ref => ref.where('ROLE_CD', 'in', roleCode)
        .where("HEAD_CD","==",headCode).where("PROJECT","==",project));
        let datareturn = this.roleAccessRef.valueChanges()
          .pipe(
            map(users => {
              const user = users;
              return user;
            })
        );
        return datareturn;
    }
    

    getRoleAccesstHomeList() {
        return this.firestore.collection("COMPONENT", ref => ref.where("PROJECT","==","FEW")
        .where("COM_CATEGORY_CD","==",'1').orderBy('PARENT', 'asc').orderBy('ORDER_BY', 'asc'));
    }

    getComponentList(headCode) {
       
        
        if(headCode == 'HOME'){
            return this.firestore.collection("COMPONENT", ref => ref.where("PROJECT","==","FEW")
            .where("COM_CATEGORY_CD","==",'1').orderBy('PARENT', 'asc').orderBy('ORDER_BY', 'asc'));
        }else{
            return this.firestore.collection("COMPONENT", ref => ref.where("PROJECT","==","FEW")
            .where("COM_CATEGORY_CD","==",'1').where("PRIORITY","==",1).orderBy('PARENT', 'asc').orderBy('ORDER_BY', 'asc'));
        }
    }

    
    getComponentHomeList() {
        return this.firestore.collection("COMPONENT", ref => ref.where("PROJECT", "==", "FEW")
                        .where("COM_CATEGORY_CD", "==", "1").orderBy('ORDER_BY', 'asc'));
    }

    getComponentALLList() {
        return this.firestore.collection("COMPONENT", ref => ref.where("PROJECT", "==", "FEW")
        .orderBy('FLAG_LEVEL', 'asc').orderBy('PRIORITY', 'desc').orderBy('ORDER_BY', 'asc'));
    }

    getGlobals() {
        return this.localStorage.getLocalStorage();
    }

    localStorageService() {
        return this.localStorage;
    }

    getStatusFlag(){
        let item = [
            {label: 'เปิด', value: 'Y'},
            {label: 'ปิด', value: 'N'}    
          ];

          return item;
    }

    getStatusTranfer(){
        let item = [
            {label: 'โอนเงิน', value: 'BANK'},
            {label: 'เก็บเงินปลายทาง', value: 'COD'}    
          ];

          return item;
    }

    getStatusStock(){
        let item = [
            {label: "สินค้าเข้า", value: "STOCK_IN"},
            {label: "สินค้าออก", value: "STOCK_OUT"}   
          ];

          return item;
    }

    getStatusDiscount(){
        let item = [
            {label: 'ลดเงินเป็นจำนวน', value: 'A'},
            {label: 'ลดเงินเป็นเปอร์เซ็น', value: 'P'}    
          ];
        return item;
    }
    
    // yyyy-mm-dd to dd/mm/yyyy
    convertDate4Calendar(d) {
        if(d != null){
            if (typeof d == "string") {
                let arr = d.split("-")
                if (arr.length == 3) {
                    d = arr[2] + "/" + arr[1] + "/" + arr[0]
                } else {
                    d = ""
                }
            } else {
                d = ""
            }
            return d;
        }else{
            return null;
        }
    }

    convertDateTimeCalendar(d) {
       /*if(d != null){
            if (typeof d == "string") {
                let arr = d.split("-")
                if (arr.length == 3) {
                    d = arr[2] + "/" + arr[1] + "/" + arr[0]
                } else {
                    d = ""
                }
            } else {
                d = ""
            }
            return d;
        }else{
            return null;
        }*/
        if (typeof d == "string") {
            let arr = d.split(" ");
            if (arr.length == 2) {
                let dd = arr[0].split("-");
                let tt = arr[1].split(":");
                if (dd.length == 3) {
                    d = dd[2] + "/" + dd[1] + "/" + dd[0]
                }
                
                let t ="";
                if (tt.length == 3) {
                    t = tt[0] + ":" + tt[1]
                }
                return d+" "+t;
                
            }else{
                d = ""
                return d;
            }
        }else{
            d = ""
            return d;
        }
    }

    // dd/mm/yyyy to yyyy-mm-dd
    convertCalendarToDate(d) {
        if(d == null || d == undefined){
            return null;
        }else{
            if (typeof d == "string") {
                let arr = d.split("/")
                if (arr.length == 3) {
                    d = arr[2] + "-" + arr[1] + "-" + arr[0]
                }
            }
            return d;
        }
    }

    convertCalendarToDateTime(d) {
        
        if(d == null || d == undefined){
            return null;
        }else{
            /*if (typeof d == "string") {
                let arr = d.split("/")
                if (arr.length == 3) {
                    d = arr[2] + "-" + arr[1] + "-" + arr[0]
                }
            }
            return d;*/
            //console.log(d);
            let date = new Date;
            let arr = d.split(" ");
            if (arr.length == 2) {
                let dd = arr[0].split("-");
                let tt = arr[1].split(":");
                /*if (dd.length == 3) {
                    d = dd[2] + "-" + dd[1] + "-" + dd[0]
                }
                
                let t ="";
                if (tt.length == 3) {
                    t = tt[0] + ":" + tt[1] + ":00"
                }*/

                date = new Date(Number(dd[0]), Number(dd[1])-1, Number(dd[2]),Number(tt[0]),Number(tt[1]));
                
                return date;
                
            }else{
                d = ""
                return d;
            }
        }
    }

    convertStringToDate(d) {
        let date = new Date;
        if (typeof d == "string") {
            let arr = d.split("/")
            if (arr.length == 3) {
                d = arr[2] + "-" + arr[1] + "-" + arr[0]
            }
        
        date = new Date(Number(arr[2]), Number(arr[1]), Number(arr[0]));
        }
        
        return date;
    }

    convertStringToDate_2(d) {
        let date = new Date;
        if (typeof d == "string") {
            let arr = d.split("-")
            date = new Date(Number(arr[0]), Number(arr[1])-1, Number(arr[2]));
        }
        
        return date;
    }

    convertDateBudhToDate(d) {
        if (typeof d == "string") {
            let arr = d.split("/")
            if (arr.length == 3) {
                let y = Number(arr[2]);
                d = ((y+2500)-543) + "-" + arr[1] + "-" + arr[0]
            }
        }
        return d;
    }

    convertDateToDateBudh(d) {
        if (typeof d == "string") {
            if(d.trim().length > 0){
                let arr = d.split("/")
                if (arr.length == 3) {
                    let y = Number(arr[2]);
                   // d = ((y+543)-2500) + "-" + arr[1] + "-" + arr[0]
                   d = arr[0] + "/" + arr[1] + "/" + ((y+543)-2500)
                }
            }
        }else{
            d = "";
        }
        return d;
    }

    transformDate(date,fmt) {
        let d = this.datePipe.transform(date, fmt);
         return d;
    }

    transformTimestamp(timestamp: Timestamp, format?: string): string {
        if (!timestamp || !timestamp.toDate) {
            return;
        }
        return formatDate(timestamp.toDate(), format || 'medium', this.locale);
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 5; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    generateKey() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    getSelectLabel(code : string,slectList : SelectItem[]){
        for(let i = 0; i < slectList.length; i++) {
          let e = slectList[i]; 
          if(code == e.value){
            return e.label;
          }
        }
        return null;
      }

      getDropdownFromList(code : string,list : Dropdown[]){
        for(let i = 0; i < list.length; i++) {
          let e = list[i]; 
          if(code == e.CD){
            return e;
          }
        }
        return null;
      }


    /*transform(timestamp: Timestamp, format?: string): string {
        return formatDate(timestamp.toDate(), format || 'medium', this.locale);
    }*/

    convertToFloat(d){
        return parseFloat(d.replace(/,/g,''));
    }

    generateOrderNo() : string {
        let orderNo : string = "";
        orderNo = this.getHead() + this.transformDate(new Date(),'yyyyMMddHHmmss');
        return orderNo;
    }

    getOrderHeaders(headCode: string) {
        return this.firestore.collection(this.DB.ORDER_HEADER).ref.where("HEAD_CD", "==", headCode);
    }

    getOrderDetails(headCode: string) {
        return this.firestore.collection(this.DB.ORDER_DETAIL, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getOrderTransport(headCode: string) {
        return this.firestore.collection(this.DB.ORDER_TRANSPORT, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getOrderPay(headCode: string) {
        return this.firestore.collection(this.DB.ORDER_PAY, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getOrderNote(headCode: string) {
        return this.firestore.collection(this.DB.ORDER_NOTE, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getOrderHistory(headCode: string) {
        return this.firestore.collection(this.DB.ORDER_HISTORY, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getEmployee(headCode: string) {
        return this.firestore.collection(this.DB.EMPLOYEE, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getStock(headCode: string) {
        return this.firestore.collection(this.DB.STOCK, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getwherehouse(headCode: string) {
        return this.firestore.collection(this.DB.WAREHOUSE, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getProduct(headCode: string) {
        return this.firestore.collection(this.DB.PRODUCTS, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getAttibute(headCode: string) {
        return this.firestore.collection(this.DB.ATTRIBUTE, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getCustomer(headCode: string) {
        return this.firestore.collection(this.DB.CUSTOMERS, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getUser(headCode: string) {
        return this.firestore.collection(this.DB.USERS, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getRoleUser(headCode: string) {
        return this.firestore.collection(this.DB.ROLE_USER, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getRole(headCode: string) {
        return this.firestore.collection(this.DB.ROLE, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getRoleAccess(headCode: string) {
        return this.firestore.collection(this.DB.ROLE_ACCESS, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getDropdown(headCode: string) {
        return this.firestore.collection(this.DB.ROLE_ACCESS, ref => ref.where("HEAD_CD", "==", headCode));
    }

    getSupplier(headCode: string) {
        return this.firestore.collection(this.DB.SUPPLIER, ref => ref.where("HEAD_CD", "==", headCode));
    }  
}
