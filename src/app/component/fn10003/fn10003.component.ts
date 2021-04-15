import { Component, OnInit, Output, EventEmitter ,ViewChild, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from 'src/app/models/product';
import { Attribute } from 'src/app/models/attribute';
import { Dropdown } from 'src/app/models/dropdown';
import { SelectItem } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import * as firebase from 'firebase';

@Component({
  selector: 'app-fn10003',
  templateUrl: './fn10003.component.html',
  styleUrls: ['./fn10003.component.scss']
})
export class Fn10003Component implements OnInit {

  @ViewChild('fileUpload') fileUpload: any;

  private subscriptions: Subscription[] = [];
  fncDialog : boolean;
  fncSpecialProduct: boolean;
  flagPrimaryKey : boolean;
  dataTable : any[];
  selectedRows: Product[];
  newRow: Product;
  submitted: boolean;
  statusList: SelectItem[];
  cols: any[];

  // uploadedFiles: any[] = [];

  selectedAttribute : any[];
  filteredAttribute: any[];

  categoryList: SelectItem[];
  unitList: SelectItem[];
  attributeOptions: any[];
  attribute : any[];

  lines = []; //for headings
  linesR = []; // for rows

  uploadedFiles: any[] = [];

  task: AngularFireUploadTask;


  attributeCustomList : any[];

  constructor(
    private app : AppService,
    private db: AngularFirestore,
    private misc: MiscComponent,
    private storage: AngularFireStorage,
    private masterService : MasterService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {    
    this.attributeCustomList = [];
    this.getTableList();
    this.statusList = this.app.getStatusFlag();
    this.getCatgoryList();
    this.getUnitList();
    this.getAttributeList();
    this.cols = [
      { field: 'TYPE_SHOW', header: 'ประเภทสินค้า' },
      { field: 'CATEGORY_NAME', header: 'หมวดหมู่' },
      { field: 'PRODUCT_SKU', header: 'รหัสสินค้า' },
      { field: 'NAME', header: 'ชื่อสินค้า' },
      { field: 'BRAND', header: 'แบรนด์' },
      { field: 'PRICE', header: 'ราคา' },
      { field: 'REMARK', header: 'หมายเหตุ' },
      { field: 'FLAG', header: 'สถานะ' },
      { field: 'CREATE_DATE_FMT', header: 'วันที่สร้าง' },
      { field: 'CREATE_BY', header: 'สร้างโดย' }
  ];
  }

  openNew() {
      this.newRow = new Product();
      this.newRow.ACTIVE_FLAG = 'Y';
      this.newRow.TYPE = 'NOR';
      this.submitted = false;
      this.fncDialog = true;
      this.fncSpecialProduct = false;
      this.flagPrimaryKey = false;
  }

  hideDialog() {
      this.fncDialog = false;
      this.submitted = false;
  }

  onClickType(event){
    if('NOR' == this.newRow.TYPE){
      this.fncSpecialProduct = false;
    }else if('SPC' == this.newRow.TYPE){
      this.fncSpecialProduct = true;
    }else if('SET' == this.newRow.TYPE){
      this.fncSpecialProduct = false;
    } 
  }

  onChangeClick(e){
    //console.log(e);
    //console.log(this.attribute);
    
    //this.attributeCustomList.push(e.option.value);
    //console.log(this.attributeCustomList);
    
  }

  filterAttribute(event) {
    
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.attributeOptions.length; i++) {
        let data = this.attributeOptions[i];
        if (data.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(data);
        }
    }
    
    this.filteredAttribute = filtered;
}

  edit(newRow: Product) {
    this.newRow = {...newRow};
    this.fncDialog = true;
    this.flagPrimaryKey = true;
  }

  getCatgoryList() {
    let gategory = this.app.PRODUCT.CATEGORY;
    let sub_gategory = this.app.PRODUCT.SUB_CATEGORY_CATEGORY_PRODUCT;
    this.masterService.getDropdownList(this.app.getHead(),gategory,sub_gategory).snapshotChanges()
    .subscribe(response => {
      let items = [];
      for (let item of response) {
        let e = <Dropdown>item.payload.doc.data();
        items.push({label: e.VALUE, value: e.CD});
      }
      this.categoryList = items;
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
      this.unitList = items;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getAttributeList() {
    this.masterService.getAttributeList(this.app.getHead()).snapshotChanges()
    .subscribe(response => {
      let items = [];
      for (let item of response) {
        let e = <Attribute>item.payload.doc.data();
        items.push({name: e.VALUE, len : e.ATTRIBUTE_DETAIL.length, detail : e.ATTRIBUTE_DETAIL});
      }
      this.attributeOptions = items;
    }, error => {
      console.log("ERROR",error);
    });
  }

  getTableList() {
    this.masterService.getDataProduct(this.app.getHead()).snapshotChanges()
    .subscribe(response => {
      this.dataTable = [];
      for (let item of response) {
        let e = <Product>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        e['FLAG'] = e.ACTIVE_FLAG == 'Y' ? 'เปิด' : 'ปิด';
        if(e.TYPE == 'NOR'){
          e['TYPE_SHOW'] = 'สินค้าทั่วไป';
        }else if(e.TYPE == 'SPC'){
          e['TYPE_SHOW'] = 'สินค้ามีตัวเลือก';
        }else if(e.TYPE == 'SPC'){
          e['TYPE_SHOW'] = 'สินค้าจัดเซต';
        }
        e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy");
        this.dataTable.push(e);
      }
      
    }, error => {
      console.log("ERROR",error);
    });
  }

    validateBeforeSave(newRow : Product){
      if(newRow.PRODUCT_SKU == undefined && newRow.PRODUCT_SKU.trim().length == 0) {
        return false;
      }else if(newRow.NAME != undefined && newRow.NAME.trim().length == 0) {
        return false;
      }else if(newRow.ACTIVE_FLAG != undefined && newRow.ACTIVE_FLAG.trim().length == 0) {
        return false;
      }else{
        let ret = true;

        if (!this.newRow['KEY']) {
          this.dataTable.forEach(element => {
            if(element['PRODUCT_SKU'] == newRow.PRODUCT_SKU){
              this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีรหัสนี้ใช้แล้ว');
              ret = false;
            }
          });
        }

        return ret;
    }
  }
  
  async save() {
    this.submitted = true;
    this.misc.progressSpinner(true);
    if (this.validateBeforeSave(this.newRow)) {
      this.newRow.CATEGORY_NAME = this.app.getSelectLabel(this.newRow.CATEGORY,this.categoryList)
      this.newRow.HEAD_CD = this.app.getHead();
      this.newRow.PROJECT = this.app.getProject();
      let key = "";
      if (this.newRow['KEY']) {
        key = this.newRow['KEY'];
        this.newRow.images = [];
        this.newRow.UPDATE_DATE = firestore.Timestamp.now();
        this.newRow.UPDATE_BY = this.app.getUsername();
        let mst = Object.assign({}, this.newRow);
        delete mst['KEY'];
        delete mst['FLAG'];
        delete mst['CREATE_DATE_FMT'];
        this.masterService.updateProduct(key,mst).catch(err => console.log(err));
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.misc.progressSpinner(false);
      }else{
        key = this.db.createId(); 
        if(this.newRow.images == null || this.newRow.images == undefined){
          this.newRow.images = [];
        }
        this.newRow.CREATE_DATE = firestore.Timestamp.now();
        this.newRow.CREATE_BY = this.app.getUsername();
        this.newRow.UPDATE_DATE = firestore.Timestamp.now();
        this.newRow.UPDATE_BY = this.app.getUsername();
        //this.masterService.createProduct(this.newRow);
        let mst = Object.assign({}, this.newRow);
        delete mst['KEY'];
        delete mst['FLAG'];
        delete mst['CREATE_DATE_FMT'];
        this.masterService.updateProduct(key,mst).catch(err => console.log(err));
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.newRow = new Product();
        this.misc.progressSpinner(false);
      } 

      if(this.uploadedFiles.length > 0){
        for (let file of this.uploadedFiles) {
          let newName = "N"+new Date().getTime();
          let doc = this.app.getHead()+ "/Product/"+this.newRow.PRODUCT_SKU+"/"+newName;
          this.task = this.storage.upload(doc,file);
          (await this.task).ref.getDownloadURL().then(url => { 
            let v =  {
              ATTACFILE_NAME : doc,
              ATTACFILE_URL : url
            }   
            this.newRow.images.push(v);
  
          });  
        }
        
        let mst2 = Object.assign({}, this.newRow);
        delete mst2['KEY'];
        delete mst2['FLAG'];
        delete mst2['CREATE_DATE_FMT'];
        this.masterService.updateProduct(key,mst2).catch(err => console.log(err));
        this.uploadedFiles = [];  
      }
      this.hideDialog();
    }else{
      this.hideDialog();
      this.misc.progressSpinner(false);
    }
    
  }

  delete(newRow: Product) {
    this.misc.progressSpinner(true);
    this.masterService.deleteProduct(newRow['KEY']).catch(err => console.log(err));
    this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
    this.misc.progressSpinner(false);
  }

  deleteSelected() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected data?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            for(let i=0;i<this.selectedRows.length;i++){
              this.masterService.deleteProduct(this.selectedRows[i]['KEY']).catch(err => console.log(err));
            }
            this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
            this.selectedRows = null;
        }
    });
  }


  onSelectFile(event){
    let files = event.files;
    if(files && files.length > 0) {
      for(let file of event.files) {
        this.uploadedFiles.push(file);
      }
    }
  }

  onClearFile(event){
    this.uploadedFiles = [];
  }
  
  onRemoveFile(event){
    for(let index=0;index <= this.uploadedFiles.length;index++) {
      let file = this.uploadedFiles[index];
      if(event.file.name == file.name){
        this.uploadedFiles.splice(index,1);
      }
    }
  }

  deleteImage(row){
    for (let index = 0; index < this.newRow.images.length; index++) {
      const element = this.newRow.images[index];
      if(row['ATTACFILE_URL'] == element['ATTACFILE_URL']){
        let key = this.newRow['KEY'];
        this.newRow.images.splice(index, 1);
        let mst = Object.assign({}, this.newRow);
        delete mst['KEY'];
        delete mst['FLAG'];
        delete mst['CREATE_DATE_FMT'];
        this.masterService.updateProduct(key,mst).catch(err => console.log(err));
      }
      
    }


    this.storage.storage.refFromURL(row['ATTACFILE_URL']).delete();
  }



  //File upload function
  changeListener(event){
    this.lines = []; //for headings
    this.linesR = []; // for rows
    let files = event.files;
    if(files && files.length > 0) {
       let file : File = files.item(0); 
         let reader: FileReader = new FileReader();
         reader.readAsText(file,'UTF-8');
         reader.onload = (e) => {
          let csv: any = reader.result;
          let allTextLines = [];
          allTextLines = csv.split(/\r|\n|\r/);
          let headers = allTextLines[0].split(';');
          let data = headers;
          let tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }
          //Pusd headinf to array variable
          this.lines.push(tarr);
          
         
          // Table Rows
          let tarrR = [];
          //Create formdata object
          var myFormData = new FormData();
          let arrl = allTextLines.length;
          let rows = [];
          
          for(let i = 1; i < arrl; i++){
            rows.push(allTextLines[i].split(','));
            if(allTextLines[i]!=""){
              // Save file data into formdata varibale  
              myFormData.append("data"+i, allTextLines[i]);
            }
          }
         
          for (let j = 0; j < arrl; j++) {
              if(rows[j] != null){
                tarrR.push(rows[j]);
                tarrR = tarrR.filter(function(i){ return i != ""; });
              }
          }

          this.linesR.push(tarrR);
      }
    }
  }

  onUpload(event) {

    let listProduct : Product [] = [];
      for (let i = 0; i < this.linesR.length; i++) {
        let rows = this.linesR[i];
        for (let j = 0; j < rows.length; j++) {
          let p = rows[j];

          console.log("PP",p);

          let product = new Product();
          product.TYPE = "NOR";
          product.CATEGORY = "normal";
          product.CATEGORY_NAME = this.app.getSelectLabel(product.CATEGORY,this.categoryList);
          product.UNIT = "001";
          product.ACTIVE_FLAG = 'Y';
          product.PRODUCT_LOWEST = 5;
          product.DESC = null;
          product.DESC_ABBR = null;
          product.PROMOTION_CODE = null;
          
          product.images = [];
          product.CREATE_DATE = firestore.Timestamp.now();
          product.CREATE_BY = this.app.getUsername();
          product.UPDATE_DATE = firestore.Timestamp.now();
          product.UPDATE_BY = this.app.getUsername();
          product.HEAD_CD = this.app.getHead();
          product.PROJECT = this.app.getProject();

          product.PRODUCT_SKU = p[0];
          product.NAME = p[1];
          product.BRAND = p[2];
          product.WIDE = Number( p[3] );
          product.LONG = Number( p[4] );
          product.HEIGHT = Number( p[5] );
          product.WEIGHT = Number( p[6] );
          product.COST = Number( p[7] );
          product.PRICE = Number( p[8] );
          listProduct.push(product);
        }
      } 

    //console.log(listProduct);
    
    var db = firebase.firestore();
    let batch =  db.batch();
    listProduct.forEach(product => {
      var ref = db.collection(this.app.DB.PRODUCTS).doc();
      let obj = Object.assign({}, product);
      batch.set(ref, obj);
    });
    batch.commit();
    this.fileUpload.clear();
  }
}



