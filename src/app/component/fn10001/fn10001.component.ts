import { Component, OnInit, Output, EventEmitter ,ViewChild, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';
import { ComponentProject } from 'src/app/models/component-project';
import { UserService } from 'src/app/service/user.service';

import { Head } from 'src/app/models/head';

import { User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';
import { RoleAccess } from 'src/app/models/role-access';
import { RoleUser } from 'src/app/models/role-user';

import { SelectItem } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';

import { ExcelService } from 'src/app/service/excel.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Employee } from 'src/app/models/employee';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}


@Component({
  selector: 'app-fn10001',
  templateUrl: './fn10001.component.html',
  styleUrls: ['./fn10001.component.scss']
})
export class Fn10001Component implements OnInit {

  private subscriptions: Subscription[] = [];
    fncDialog: boolean;
    flagPrimaryKey : boolean;
    dataTable : any[];
    selectedRows: Head[];
    newRow: Head;
    submitted: boolean;
    statusList: SelectItem[];
    cols: any[];

    constructor(
      private app : AppService,
      private excel : ExcelService,
      private userService : UserService,
      private misc: MiscComponent,
      private masterService : MasterService,
      private confirmationService: ConfirmationService) { }

    ngOnInit() {    
    this.getTableList();
    this.statusList = this.app.getStatusFlag();

    this.cols = [
        { field: 'HEAD_CD', header: 'รหัสร้านค้า' },
        { field: 'HEAD_NAME', header: 'ชื่อร้านค้า' },
        { field: 'FLAG', header: 'สถานะ' },
        { field: 'CREATE_DATE_FMT', header: 'วันที่สร้าง' },
        { field: 'CREATE_BY', header: 'สร้างโดย' }
    ];
    }

    openNew() {
        this.newRow = new Head();
        this.newRow.ACTIVE_FLAG = 'Y';
        this.submitted = false;
        this.fncDialog = true;
        this.flagPrimaryKey = false;
    }

    hideDialog() {
        this.fncDialog = false;
        this.submitted = false;
    }

    edit(newRow: Head) {
      this.newRow = {...newRow};
      this.fncDialog = true;
      this.flagPrimaryKey = true;
    }

    getTableList() {
      this.masterService.getData().snapshotChanges()
      .subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let e = <Head>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          e['FLAG'] = e.ACTIVE_FLAG == 'Y' ? 'เปิด' : 'ปิด';
          e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy");
          this.dataTable.push(e);
        }
        
      }, error => {
        console.log("ERROR",error);
      });
    }

    validateBeforeSave(newRow : Head){
      if(newRow.HEAD_CD == undefined && newRow.HEAD_CD.trim().length == 0) {
        return false;
      }else if(newRow.HEAD_NAME != undefined && newRow.HEAD_NAME.trim().length == 0) {
        return false;
      }else if(newRow.ACTIVE_FLAG != undefined && newRow.ACTIVE_FLAG.trim().length == 0) {
        return false;
      }else{
        let ret = true;

        if (!this.newRow['KEY']) {
          this.dataTable.forEach(element => {
            if(element['HEAD_CD'] == newRow.HEAD_CD){
              this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'มีรหัสนี้ใช้แล้ว');
              ret = false;
            }
          });
        }

        return ret;
    }
  }
    
  save() {
    this.submitted = true;
    this.misc.progressSpinner(true);
    if (this.validateBeforeSave(this.newRow)) {
      this.newRow.PROJECT = this.app.PROJECT;
      if (this.newRow['KEY']) {
        this.newRow.UPDATE_DATE = firestore.Timestamp.now();
        this.newRow.UPDATE_BY = 'SYSTEM';
        let mst = Object.assign({}, this.newRow);
        delete mst['KEY'];
        delete mst['FLAG'];
        delete mst['CREATE_DATE_FMT'];
        this.masterService.update(this.newRow['KEY'],mst).catch(err => console.log(err));
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.hideDialog();
        this.misc.progressSpinner(false);
      }else{
        this.insertRoleAccess(this.newRow.HEAD_CD);
        this.insertEmpployee();
        this.insertUser();
        this.insertRole();
        this.insertRoleUser(this.newRow.HEAD_CD);
        this.newRow.CREATE_DATE = firestore.Timestamp.now();
        this.newRow.CREATE_BY = 'SYSTEM';
        this.newRow.UPDATE_DATE = firestore.Timestamp.now();
        this.newRow.UPDATE_BY = 'SYSTEM';
        this.masterService.create(this.newRow);
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.newRow = new Head();
        this.hideDialog();
        this.misc.progressSpinner(false);
      } 
    }else{
      this.misc.progressSpinner(false);
    }
    
  }

  insertEmpployee(){
    let emp = new Employee();
    emp.EMP_NO = this.newRow.HEAD_CD+"admin";
    emp.FIRSTNAME = "ผู้ดูแล";
    emp.LASTNAME = "ผู้ดูแลระบบ";


    emp.CREATE_DATE = firestore.Timestamp.now();
    emp.CREATE_BY = 'SYSTEM';
    emp.UPDATE_DATE = firestore.Timestamp.now();
    emp.UPDATE_BY = 'SYSTEM';
    emp.ACTIVE_FLAG = 'Y';
    emp.HEAD_CD = this.newRow.HEAD_CD;
    emp.PROJECT = this.app.getProject();
    this.masterService.createEmployee(emp);
  }

  insertUser(){
    let u = new User();
    u.USERNAME = this.newRow.HEAD_CD+"admin";
    u.PASSWORD = "1234567";
    u.HEAD_CD = this.newRow.HEAD_CD;
    u.PROJECT = this.app.getProject();
    this.userService.createUser(u);
  }

  insertRole(){
    let roles : Role[] = [];
    let roleAddmin = new Role();
    roleAddmin.ROLE_CD = "ADMIN";
    roleAddmin.ROLE_NAME = "ผู้ดูแล";
    roleAddmin.HEAD_CD = this.newRow.HEAD_CD;
    roleAddmin.PROJECT = this.app.getProject();
    roles.push(roleAddmin);

    let roleUser = new Role();
    roleUser.ROLE_CD = "USER";
    roleUser.ROLE_NAME = "ผู้ใช้งาน";
    roleUser.HEAD_CD = this.newRow.HEAD_CD;
    roleUser.PROJECT = this.app.getProject();
    roles.push(roleUser);

    var db = firebase.firestore();
    let batch =  db.batch();
    roles.forEach(detail => {
      var ref = db.collection(this.app.DB.ROLE).doc();
      let obj = Object.assign({}, detail);
      batch.set(ref, obj);
    });
    batch.commit();
  }

  insertRoleUser(headCode){
    let roleUser : RoleUser[] = [];

    let r = new RoleUser();

    r.USERNAME = this.newRow.HEAD_CD+"admin";
    r.ROLE_CD = "ADMIN";
    r.HEAD_CD = headCode;
    r.PROJECT = this.app.getProject();

    roleUser.push(r);

    var db = firebase.firestore();
    let batch =  db.batch();
    roleUser.forEach(detail => {
      var ref = db.collection(this.app.DB.ROLE_USER).doc();
      let obj = Object.assign({}, detail);
      batch.set(ref, obj);
    });
    batch.commit();


  }

  insertRoleAccess(headCode){
    let roleAccessArray : RoleAccess [] = [];
    

    let accessAddmin = [
      "fn10002",
      "fn10003",
      "fn10004",
      "fn10005",
      "fn10006",
      "fn10007",
      "fn10008",
      "fn10009",
      "fn10010",
      "fn10011",
      "fn10012",
      "fn20001",
      "fn30001",
      "fn40001",
      "fn40010",
      "fn50001",
      "fn50002",
      "fn50003",
      "fn50004",
      "fn50005",
      "fn50006",
      "fn80001",
      "fn80002",
      "fn90001",
      "fn90002",
      "fn90003",
      "fn90004",
      "fn90005",
      "fn90006",
      "fn90007",
      "fn90008",
      "fn90009",
      "menu001",
      "menu002",
      "menu003",
      "menu004",
      "menu005"
    ];

    let accessUser = [
      "fn10002",
      "fn10003",
      "fn10004",
      "fn10005",
      "fn10006",
      "fn10007",
      "fn10008",
      "fn10009",
      "fn10010",
      "fn10011",
      "fn10012",
      "fn20001",
      "fn30001",
      "fn40001",
      "fn40010",
      "fn50001",
      "fn50002",
      "fn50003",
      "fn50004",
      "fn50005",
      "fn50006",
      "fn80001",
      "fn80002",
      "fn90001",
      "fn90002",
      "fn90003",
      "fn90004",
      "fn90005",
      "fn90006",
      "fn90007",
      "fn90008",
      "fn90009",
      "menu001",
      "menu002",
      "menu003",
      "menu004",
      "menu005"
    ];

    this.app.getComponentList(this.newRow.HEAD_CD).snapshotChanges().subscribe(response => {
      for (let item of response) {
        let e = <ComponentProject>item.payload.doc.data();
        if(accessAddmin.indexOf(e.COMPONENT_CD) > -1){
          let roleAccess : RoleAccess = new RoleAccess();
          roleAccess.COMPONENT_CD = e.COMPONENT_CD;
          roleAccess.ROLE_CD = "ADMIN";
          roleAccess.HEAD_CD = headCode;
          roleAccess.PROJECT = this.app.getProject();
          roleAccessArray.push(roleAccess);
        }

        if(accessUser.indexOf(e.COMPONENT_CD) > -1){
          let roleAccess : RoleAccess = new RoleAccess();
          roleAccess.COMPONENT_CD = e.COMPONENT_CD;
          roleAccess.ROLE_CD = "USER";
          roleAccess.HEAD_CD = headCode;
          roleAccess.PROJECT = this.app.getProject();
          roleAccessArray.push(roleAccess);
        }
      }  
      

    var db = firebase.firestore();
    let batch =  db.batch();
    roleAccessArray.forEach(detail => {
      var ref = db.collection(this.app.DB.ROLE_ACCESS).doc();
      let obj = Object.assign({}, detail);
      batch.set(ref, obj);
    });
    batch.commit();

  }, error => {
    console.log("ERROR",error);
    this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'ระบบผิดพลาดบางอย่าง');
  });

    
  }

  delete(newRow: Head) {
    this.misc.progressSpinner(true);
    this.deleteHead(newRow.HEAD_CD,newRow['KEY']);
    this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
    this.misc.progressSpinner(false);
  }

  async deleteHead(headCode : string,key : string){
    this.masterService.delete(key).catch(err => console.log(err));
    var db = firebase.firestore();
    let batch =  db.batch();
    const documentSnapshotArray = await this.app.getOrderHeaders(headCode).get();
    const batchArray = [];
    batchArray.push(batch);
    let operationCounter = 0;
    let batchIndex = 0;

    documentSnapshotArray.forEach(documentSnapshot => {
        const documentData = documentSnapshot.data();

    // update document data here...

    batchArray[batchIndex].update(documentSnapshot.ref, documentData);
    operationCounter++;

      if (operationCounter === 499) {
        batchArray.push(batch);
        batchIndex++;
        operationCounter = 0;
      }
  });

  batchArray.forEach(async batch => await batch.commit());


  }

  deleteSelected() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected data?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            for(let i=0;i<this.selectedRows.length;i++){
              this.deleteHead(this.selectedRows[i].HEAD_CD,this.selectedRows[i]['KEY']);
            }
            this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
            this.selectedRows = null;
        }
    });
  }

  exportEXCEL():void {
    if(this.selectedRows != undefined && this.selectedRows.length > 0){
      let exportExcel = [];
      this.selectedRows.forEach(element => {
        let row = {
          "Head_code" : element.HEAD_CD,
          "Head_name" : element.HEAD_NAME,
          "Status" : element['FLAG']
        }
        exportExcel.push(row);
      });
      this.excel.exportAsExcelFile(exportExcel, 'head');
    }else{
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'เลือกข้อมูลก่อน Export Excel');
    }
   }

   exportPDF(action = 'open'):void {
    if(this.selectedRows != undefined && this.selectedRows.length > 0){
      const documentDefinition = this.getDocumentDefinition();
      switch (action) {
        case 'open': pdfMake.createPdf(documentDefinition).open(); break;
        case 'print': pdfMake.createPdf(documentDefinition).print(); break;
        case 'download': pdfMake.createPdf(documentDefinition).download(); break;
        default: pdfMake.createPdf(documentDefinition).open(); break;
      }
    }else{
      this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'เลือกข้อมูลก่อน Export PDF');
    }
  }

  getDocumentDefinition() {
    return {
      content: [
        {
          text: 'EXPORT',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.getDataTable()
      ], defaultStyle: {
        font: 'THSarabunNew'
        },
    };
  }

  getDataTable() {
    return {
      table: {
        widths: ['*', '*', '*'],
        body: [
          [{
            text: 'รหัสร้านค้า',
            style: 'tableHeader',
          },
          {
            text: 'ชื่อร้านค้า',
            style: 'tableHeader'
          },
          {
            text: 'สถานะ',
            style: 'tableHeader'
          },
          ],
          ...this.selectedRows.map(ed => {
            return [ed.HEAD_CD, ed.HEAD_NAME, ed['FLAG']];
          })
        ]
      }
    };
  }

}
