import { Component, OnInit, Output, EventEmitter,Injectable,AfterContentChecked  } from '@angular/core';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { Employee } from 'src/app/models/employee';
import { Address } from 'src/app/models/address';

import { SelectItem } from 'primeng/api';

import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';

import { ExcelService } from 'src/app/service/excel.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MiscComponent } from 'src/app/common/misc/misc.component';
import addressJson from 'src/assets/address.json';

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
  selector: 'app-fn10002',
  templateUrl: './fn10002.component.html',
  styleUrls: ['./fn10002.component.scss']
})
export class Fn10002Component implements OnInit {
      private subscriptions: Subscription[] = [];
      fncDialog: boolean;
      flagPrimaryKey : boolean;
      dataTable : any[];
      selectedRows: Employee[];
      newRow: Employee;
      submitted: boolean;
      statusList: SelectItem[];
      cols: any[];

      addressList : any[];
      filteredAddress: any[];
  

      constructor(
        private app : AppService,
        private excel : ExcelService,
        private misc: MiscComponent,
        private masterService : MasterService,
        private confirmationService: ConfirmationService) { }
  
      ngOnInit() {    
      this.getTableList();
      this.getAddressList();
      this.statusList = this.app.getStatusFlag();
  
      this.cols = [
          { field: 'EMP_NO', header: 'รหัสพนักงาน' },
          { field: 'FIRSTNAME', header: 'ชื่อ' },
          { field: 'LASTNAME', header: 'นามสกุล' },
          { field: 'FULL_ADDRESS', header: 'ที่อยู่' },
          { field: 'EMP_TEL', header: 'เบอร์โทร' },
          { field: 'EMP_TEL2', header: 'เบอร์โทรสำรอง' },
          { field: 'FLAG', header: 'สถานะ' },
          { field: 'CREATE_DATE_FMT', header: 'วันที่สร้าง' },
          { field: 'CREATE_BY', header: 'สร้างโดย' }
      ];
      }

      getAddressList() {
          this.addressList = [];
          addressJson.data.forEach(e => {
            e['FULL_ADDRESS'] = e.district + " " + e.amphoe + " " + e.province + " " + e.zipcode
            this.addressList.push(e);
          });
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

    onSelectAutoComplete(event){
      //this.newRow.EMP_FULL_ADDRESS = event.FULLNAME;
      this.newRow.EMP_DISTRICT = event.district;
      this.newRow.EMP_AMPHURE = event.amphoe;
      this.newRow.EMP_PROVINCE = event.province;
      this.newRow.EMP_ZIPCODE = event.zipcode; 
    }
  
      openNew() {
          this.newRow = new Employee();
          this.newRow.ACTIVE_FLAG = 'Y';
          this.submitted = false;
          this.fncDialog = true;
          this.flagPrimaryKey = false;
      }
  
      hideDialog() {
          this.fncDialog = false;
          this.submitted = false;
      }
  
      edit(newRow: Employee) {
        this.newRow = {...newRow};
        this.fncDialog = true;
        this.flagPrimaryKey = true;
      }
  
      getTableList() {
        let headCode = this.app.getHead();
        this.masterService.getDataEmployee(headCode).snapshotChanges().subscribe(response => {
          this.dataTable = [];
          for (let item of response) {
            let e = <Employee>item.payload.doc.data();
            e['KEY'] = item.payload.doc.id;
            e['FULL_ADDRESS'] = e.EMP_ADDRESS + " " + e.EMP_DISTRICT + " " + e.EMP_AMPHURE + " " + e.EMP_PROVINCE + " " + e.EMP_ZIPCODE;
            e['FLAG'] = e.ACTIVE_FLAG == 'Y' ? 'เปิด' : 'ปิด';
            e['CREATE_DATE_FMT'] = this.app.transformTimestamp(e.CREATE_DATE,"dd/MM/yyyy");
            this.dataTable.push(e);
          }
          
        }, error => {
          console.log("ERROR",error);
        });
      }
  
      validateBeforeSave(newRow : Employee){
        if(newRow.EMP_NO != undefined && newRow.EMP_NO.trim().length == 0) {
          return false;
        }else if(newRow.ACTIVE_FLAG != undefined && newRow.ACTIVE_FLAG.trim().length == 0) {
          return false;
        }else{
          let ret = true;
  
          if (!this.newRow['KEY']) {
            this.dataTable.forEach(element => {
              if(element['EMP_NO'] == newRow.EMP_NO){
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
        if (this.newRow['KEY']) {
          this.newRow.UPDATE_DATE = firestore.Timestamp.now();
          this.newRow.UPDATE_BY = this.app.getUsername();
          let mst = Object.assign({}, this.newRow);
          delete mst['KEY'];
          delete mst['FLAG'];
          delete mst['CREATE_DATE_FMT'];
          delete mst['FULL_ADDRESS'];
          this.masterService.updateEmployee(this.newRow['KEY'],mst).catch(err => console.log(err));
          this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
          this.hideDialog();
          this.misc.progressSpinner(false);
        }else{
          this.newRow.CREATE_DATE = firestore.Timestamp.now();
          this.newRow.CREATE_BY = this.app.getUsername();;
          this.newRow.UPDATE_DATE = firestore.Timestamp.now();
          this.newRow.UPDATE_BY = this.app.getUsername();;
          this.newRow.HEAD_CD = this.app.getHead();
          this.masterService.createEmployee(this.newRow);
          this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
          this.newRow = new Employee();
          this.hideDialog();
          this.misc.progressSpinner(false);
        } 
      }else{
        this.misc.progressSpinner(false);
      }
      
    }
  
    delete(newRow: Employee) {
      this.misc.progressSpinner(true);
      this.masterService.deleteEmployee(newRow['KEY']).catch(err => console.log(err));
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
                this.masterService.deleteEmployee(this.selectedRows[i]['KEY']).catch(err => console.log(err));
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
            "รหัสพนักงาน" : element.EMP_NO,
            "ชื่อ" : element.FIRSTNAME,
            "นามสกุล" : element.LASTNAME,
            "ที่อยู่" : element.EMP_ADDRESS,
            "ตำบล" : element.EMP_DISTRICT,
            "อำเภอ" : element.EMP_AMPHURE,
            "จังหวัด" : element.EMP_PROVINCE,
            "รหัสไปรษณีย์" : element.EMP_ZIPCODE,
            "เบอร์โทร" : element.EMP_TEL,
            "เบอร์โทรสำรอง" : element.EMP_TEL2,
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
              return [ed.HEAD_CD, ed.HEAD_CD, ed['FLAG']];
            })
          ]
        }
      };
    }   
}

