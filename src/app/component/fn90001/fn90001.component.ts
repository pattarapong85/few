import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { ComponentProject } from 'src/app/models/component-project';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

//import { Dropdown } from 'src/app/models/dropdown';
import { SelectItem } from 'primeng/api';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';

@Component({
  selector: 'app-fn90001',
  templateUrl: './fn90001.component.html',
  styleUrls: ['./fn90001.component.scss']
})
export class Fn90001Component implements OnInit {

    private subscriptions: Subscription[] = [];
    fncDialog: boolean;
    flagPrimaryKey : boolean;
    dataTable : any[];
    selectedRows: ComponentProject[];
    newRow: ComponentProject;
    submitted: boolean;
    statusList: SelectItem[];
    cols: any[];
  
    constructor(
      private app : AppService,
      private misc: MiscComponent,
      private masterService : MasterService,
      private confirmationService: ConfirmationService) { }
  
    ngOnInit() {    
    this.getTableList();
    this.statusList = this.app.getStatusFlag();
  
    this.cols = [
        { field: 'COMPONENT_CD', header: 'COMPONENT_CD' },
        { field: 'COMPONENT_NAME', header: 'COMPONENT_NAME' },
        { field: 'COM_CATEGORY_CD', header: 'COM_CATEGORY_CD' },
        { field: 'FLAG_LEVEL', header: 'FLAG_LEVEL' },
        { field: 'ICONS', header: 'ICONS' },
        { field: 'ORDER_BY', header: 'ORDER_BY' },
        { field: 'PARENT', header: 'PARENT' },
        { field: 'PRIORITY', header: 'PRIORITY' }
    ];
    }
  
    openNew() {
        this.newRow = new ComponentProject();
        this.submitted = false;
        this.fncDialog = true;
        this.flagPrimaryKey = false;
        this.newRow.PARENT = null;
    }
  
    hideDialog() {
        this.fncDialog = false;
        this.submitted = false;
    }
  
    edit(newRow: ComponentProject) {
      this.newRow = {...newRow};
      this.fncDialog = true;
      this.flagPrimaryKey = true;
    }
  
    getTableList() {
      this.app.getAllComponent().snapshotChanges()
      .subscribe(response => {
        this.dataTable = [];
        for (let item of response) {
          let e = <ComponentProject>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          this.dataTable.push(e);
        }
        
      }, error => {
        console.log("ERROR",error);
      });
    }
  validateBeforeSave(newRow : ComponentProject){
      return true;
  }
    
  save() {
    this.submitted = true;
    this.misc.progressSpinner(true);
    if (this.validateBeforeSave(this.newRow)) {
      const PRIORITY : number = Number(this.newRow.PRIORITY);
      this.newRow.PRIORITY = PRIORITY;
      this.newRow.PROJECT = this.app.getProject();
      if (this.newRow['KEY']) {
        let mst = Object.assign({}, this.newRow);
        delete mst['KEY'];
        this.app.updateComponent(this.newRow['KEY'],mst).catch(err => console.log(err));
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.hideDialog();
        this.misc.progressSpinner(false);
      }else{
        this.app.createComponent(this.newRow);
        this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
        this.newRow = new ComponentProject();
        this.hideDialog();
        this.misc.progressSpinner(false);
      } 
    }else{
      this.misc.progressSpinner(false);
    }
    
  }
  
  delete(newRow: ComponentProject) {
    this.misc.progressSpinner(true);
    this.app.deleteComponent(newRow['KEY']).catch(err => console.log(err));
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
              this.app.deleteComponent(this.selectedRows[i]['KEY']).catch(err => console.log(err));
            }
            this.misc.newMessage('s', 'สำเร็จ', 'ลบข้อมูลเรียบร้อย');
            this.selectedRows = null;
        }
    });
  }
  
  }
  