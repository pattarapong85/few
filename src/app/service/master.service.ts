import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Head } from 'src/app/models/head';
import { System } from 'src/app/models/system';
import { Employee } from 'src/app/models/employee';
import { Customer } from 'src/app/models/customer';
import { Dropdown } from 'src/app/models/dropdown';
import { Attribute } from 'src/app/models/attribute';
import { Address } from 'src/app/models/address';
import { Product } from 'src/app/models/product';
import { AppService } from 'src/app/service/app.service';
import * as firebase from 'firebase';
import { firestore } from 'firebase/app';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MasterService {
  
  dataHeadRef: AngularFirestoreCollection<Head> = null;
  dataSystemRef: AngularFirestoreCollection<System> = null;
  dataEmployeeRef: AngularFirestoreCollection<Employee> = null;
  dataCustomerRef: AngularFirestoreCollection<Customer> = null;
  dataAddressRef: AngularFirestoreCollection<Address> = null;
  dataDropdownRef: AngularFirestoreCollection<Dropdown> = null;
  dataAttributeRef: AngularFirestoreCollection<Attribute> = null;
  dataProductRef: AngularFirestoreCollection<Product> = null;

  constructor(private firestore: AngularFirestore,private http: HttpClient,private app : AppService) { 
    this.dataHeadRef = firestore.collection(this.app.DB.HEAD);
    this.dataSystemRef = firestore.collection(this.app.DB.SYSTEM);
    this.dataEmployeeRef = firestore.collection(this.app.DB.EMPLOYEE);
    this.dataCustomerRef = firestore.collection(this.app.DB.CUSTOMERS);
    this.dataAddressRef = firestore.collection(this.app.DB.ADDRESS_ALL);
    this.dataDropdownRef = firestore.collection(this.app.DB.DROPDOWNS);
    this.dataAttributeRef = firestore.collection(this.app.DB.ATTRIBUTE);
    this.dataProductRef = firestore.collection(this.app.DB.PRODUCTS);
    
  }

  //Get List

  getSystemMasterList(category,sub_category){
    return this.firestore.collection(this.app.DB.SYSTEM, ref => ref.where("PROJECT", "==", "FEW")
      .where("CATEGORY", "==", category)
      .where("SUB_CATEGORY", "==", sub_category));
  }

  getSubGategorySystemMasterList(category){
    return this.firestore.collection(this.app.DB.SYSTEM, ref => ref.where("PROJECT", "==", "FEW")
      .where("CATEGORY", "==", category).orderBy("REMARK","asc"));
  }

  getDropdownList(headCode,category,sub_category){
    return this.firestore.collection(this.app.DB.DROPDOWNS, ref => ref.where("PROJECT", "==", "FEW")
      .where("ACTIVE_FLAG", "==", "Y")
      .where("HEAD_CD", "==", headCode)
      .where("CATEGORY", "==", category)
      .where("SUB_CATEGORY", "==", sub_category));
  }

  getDropdownDocument(key){
    return this.firestore.collection(this.app.DB.DROPDOWNS).doc(key);
  }

  getDropdownList2(headCode,category,sub_category){
    var db = firebase.firestore();
    let ref = db.collection(this.app.DB.DROPDOWNS);

    return ref.where("ACTIVE_FLAG", "==", "Y")
    .where("HEAD_CD","==",headCode)
    .where("CATEGORY","==",category)
    .where("SUB_CATEGORY","==",sub_category);

    /*query.valueChanges().pipe(map(d => { console.log(d);
      return d;}));*/
  }


  getAttributeList(headCode){
    return this.firestore.collection(this.app.DB.ATTRIBUTE, ref => ref.where("PROJECT", "==", "FEW")
      .where("ACTIVE_FLAG", "==", "Y")
      .where("HEAD_CD", "==", headCode));
  }
  
  getData(){
    return this.firestore.collection(this.app.DB.HEAD, ref => ref.where("PROJECT", "==", "FEW").orderBy('HEAD_CD', 'asc'));
  }

  getDataHead(headCode){
    return this.firestore.collection(this.app.DB.HEAD, ref => ref.where("HEAD_CD", "==", headCode));
  }

  create(data: Head): void {
    this.dataHeadRef.add({...data});
  }
 
  update(key: string, value : any): Promise<void> {
    return this.dataHeadRef.doc(key).set(value,{merge: true});
  }
 
  delete(key: string): Promise<void> {
    return this.dataHeadRef.doc(key).delete();
  }

  //System

  /*getOneSystem(CATEGORY,SUB_CATEGORY,CD) {
    let collection = this.firestore.collection(
      this.app.DB.DROPDOWNS, ref => ref.where('CATEGORY', '==', CATEGORY)
      .where('SUB_CATEGORY', '==', SUB_CATEGORY)
      .where('CD', '==', CD)).doc();
    let response = collection.valueChanges()
      .pipe(
        map(res => {
          const r = res[0];
          //return r;
        })
      ).subscribe(u => {
        
      });
    //console.log(response);
    
    return response;
  }*/

  getDataSystem(){
    return this.firestore.collection(this.app.DB.SYSTEM, ref => ref.orderBy('CATEGORY', 'asc').orderBy('SUB_CATEGORY', 'asc').orderBy('CD', 'asc').orderBy('REMARK', 'asc'));
  }

  createSystem(data: System): void {
    this.dataSystemRef.add({...data});
  }

  updateSystem(key: string, value : any): Promise<void> {
    return this.dataSystemRef.doc(key).set(value,{merge: true});
  }

  deleteSystem(key: string): Promise<void> {
    return this.dataSystemRef.doc(key).delete();
  }


  //Employee
  getDataEmployee(headCode){
    return this.firestore.collection(this.app.DB.EMPLOYEE, ref => ref.where("HEAD_CD", "==", headCode));
  }

  createEmployee(data: Employee): void {
    this.dataEmployeeRef.add({...data});
  }
 
  updateEmployee(key: string, value : any): Promise<void> {
    return this.dataEmployeeRef.doc(key).set(value,{merge: true});
  }
 
  deleteEmployee(key: string): Promise<void> {
    return this.dataEmployeeRef.doc(key).delete();
  }

  // Customer

  getDataCustomer(headCode){
    return this.firestore.collection(this.app.DB.CUSTOMERS, ref => ref
    .where("PROJECT", "==", "FEW")
    .where("HEAD_CD", "==", headCode));
  }

  createCustomer(data: Customer): void {
    this.dataCustomerRef.add({...data});
  }
 
  updateCustomer(key: string, value : any): Promise<void> {
    return this.dataCustomerRef.doc(key).set(value,{merge: true});
  }
 
  deleteCustomer(key: string): Promise<void> {
    return this.dataCustomerRef.doc(key).delete();
  }

  //Attribute
  getDataAttribute(headCode){
    return this.firestore.collection(this.app.DB.ATTRIBUTE, ref => 
    ref
    .where("PROJECT", "==", "FEW")
    .where("HEAD_CD", "==", headCode));
  }

  createAttribute(data: Attribute): void {
    this.dataAttributeRef.add({...data});
  }
 
  updateAttribute(key: string, value : any): Promise<void> {
    return this.dataAttributeRef.doc(key).set(value,{merge: true});
  }
 
  deleteAttribute(key: string): Promise<void> {
    return this.dataAttributeRef.doc(key).delete();
  }

  //Product
  getDataProduct(headCode){
    return this.firestore.collection(this.app.DB.PRODUCTS, ref => ref
    .where("PROJECT", "==", "FEW")
    .where("HEAD_CD", "==", headCode));
  }

  getDataProductList(headCode){
    return this.firestore.collection(this.app.DB.PRODUCTS, ref => ref
    .where("PROJECT", "==", "FEW")
    .where("HEAD_CD", "==", headCode)
    .where("ACTIVE_FLAG", "==", 'Y'));
  }

  createProduct(data: Product): void {
    this.dataProductRef.add({...data});
  }
 
  updateProduct(key: string, value : any): Promise<void> {
    return this.dataProductRef.doc(key).set(value,{merge: true});
  }
 
  deleteProduct(key: string): Promise<void> {
    return this.dataProductRef.doc(key).delete();
  }


  // DropDown
  /*CATEGORY : String;
  SUB_CATEGORY : String;
  CD : String;
  VALUE : String;
  DESC : String;
  REMARK : String;
  CREATE_DATE :  Timestamp; 
  CREATE_BY :  String; 
  UPDATE_DATE :  Timestamp; 
  UPDATE_BY :  String; 
  ACTIVE_FLAG :  String; 
  HEAD_CD  : String;
  PROJECT : String;*/
  getOneDropdown(data : Dropdown) {
    let collection = this.firestore.collection(
      this.app.DB.DROPDOWNS, ref => ref.where('CATEGORY', '==', data.CATEGORY)
      .where('SUB_CATEGORY', '==', data.SUB_CATEGORY)
      .where('CD', '==', data.CD));
    let response = collection.valueChanges()
      .pipe(
        map(res => {
          const r = res[0];
          return r;
        })
      );

    return response;
  }

  getDataDropDown(headCode,category,sub_category){
    return this.firestore.collection(this.app.DB.DROPDOWNS, ref => ref.where("PROJECT", "==", "FEW")
      .where("HEAD_CD", "==", headCode)
      .where("CATEGORY", "==", category)
      .where("SUB_CATEGORY", "==", sub_category));
  }

  createDropDown(data: Dropdown): void {
    this.dataDropdownRef.add({...data});
  }

  getDocumentDropDown(key: string){
    return this.dataDropdownRef.doc(key)
  }

  updateDropDown(key: string, value : any): Promise<void> {
    return this.dataDropdownRef.doc(key).set(value,{merge: true});
  }
 
  deleteDropDown(key: string): Promise<void> {
    return this.dataDropdownRef.doc(key).delete();
  }

  deleteFile(key: string){
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(key);
    imageRef.delete().then(function() {
    }).catch(function(error) {
      console.log(error);
    });
}
}
