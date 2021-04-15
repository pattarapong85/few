import { Component, OnInit } from '@angular/core';
import { Head } from 'src/app/models/head';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/service/app.service';
import { MasterService } from 'src/app/service/master.service';
import { ConfirmationService } from 'primeng/api';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { firestore } from 'firebase/app';
import { Address } from 'src/app/models/address';
import addressJson from 'src/assets/address.json';

@Component({
  selector: 'app-fn90007',
  templateUrl: './fn90007.component.html',
  styleUrls: ['./fn90007.component.scss']
})
export class Fn90007Component implements OnInit {

  headInfo: Head = new Head();

  fncDialog: boolean;
  fncModeAdd: boolean;
  indexValue : number;
  addressList: any[] = [];
  selectedAddress: any = [];
  filteredAddress: any[] = [];

  private subscriptions: Subscription[] = [];

  addressTel : string;
  addressNo : string;
  addressDetail : any;
  fullAddress : string;

  constructor(private app : AppService,
    private misc: MiscComponent,
    private masterService : MasterService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.masterService.getDataHead(this.app.getHead()).snapshotChanges().subscribe(response => {
      let head = [];
      for (let item of response) {
        let e = <Head>item.payload.doc.data();
        e['KEY'] = item.payload.doc.id;
        head.push(e);
      }
     
      this.headInfo = <Head>head[0];
    }, error => {
      console.log("ERROR",error);
    });

    this.getAddressList();
  }

  getAddressList() {
      this.addressList = [];
      addressJson.data.forEach(e => {
        e['FULL_ADDRESS'] = e.district + " " + e.amphoe + " " + e.province + " " + e.zipcode
        this.addressList.push(e);
      });
    }

    onChangeAddress(addresss){
        this.fullAddress = "";
        if(this.addressDetail != null){
          this.fullAddress = this.addressNo + " "+this.addressDetail.district + " "+this.addressDetail.amphoe + " "+this.addressDetail.province+" "+this.addressDetail.zipcode;
        }else{
          this.fullAddress = this.addressNo;
        }

        if(this.addressTel != ""){
          this.fullAddress = this.fullAddress + " เบอร์โทร "+this.addressTel;
        }
        
    }

    onSelectAddress(event){
      this.fullAddress = "";
      this.fullAddress = this.addressNo + " "+event.district + " "+event.amphoe + " "+event.province+" "+event.zipcode;   
      if(this.addressTel != ""){
        this.fullAddress = this.fullAddress + " เบอร์โทร "+this.addressTel;
      }
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

  hideDialog() {
    this.fncDialog = false;
  }

  openNewAddress(){
    this.fncModeAdd = true;
    this.fncDialog = true;
    this.addressTel = "";
    this.addressNo = "";
    this.addressDetail = null;
    this.fullAddress = "";
  }

  saveAddress(){
    let v = {
      TEL : this.addressTel,
      ADDRESS_NO : this.addressNo,
      ADDRESS_DETAIL : this.addressDetail,
      ADDRESS_FULL : this.fullAddress
    }
    if(this.headInfo.ADDRESSS_LIST == null){
      this.headInfo.ADDRESSS_LIST = [];
    }
    if(this.fncModeAdd){
      this.headInfo.ADDRESSS_LIST.push(v);
    }else{
      this.headInfo.ADDRESSS_LIST[this.indexValue] = v;
    }
    
    this.hideDialog();
  }

  edit(row){
    this.indexValue = this.headInfo.ADDRESSS_LIST.indexOf(row);
    this.fncModeAdd = false;
    this.fncDialog = true;
    this.addressNo = row['ADDRESS_NO'];
    this.addressDetail = row['ADDRESS_DETAIL'];
    this.fullAddress = row['ADDRESS_FULL'];
  }

  deleteAddress(idx){
    const index : number = this.headInfo.ADDRESSS_LIST.indexOf(idx);
    if (index !== -1) {
      this.headInfo.ADDRESSS_LIST.splice(index, 1);
    }
  }

  save(){
    this.misc.progressSpinner(true);
    this.headInfo.UPDATE_DATE = firestore.Timestamp.now();
    this.headInfo.UPDATE_BY = this.app.getUsername();
    let mst = Object.assign({}, this.headInfo);
    delete mst['KEY'];
    this.masterService.update(this.headInfo['KEY'],mst).catch(err => console.log(err));
    this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
    this.misc.progressSpinner(false);
  }
}
