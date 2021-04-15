import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { generate } from 'rxjs';
import * as firebase from 'firebase';
import { StockService } from 'src/app/service/stock.service';
import { Stock } from 'src/app/models/stock';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-fn50005',
  templateUrl: './fn50005.component.html',
  styleUrls: ['./fn50005.component.scss']
})
export class Fn50005Component implements OnInit {

  dateFrom : Date;
  dateTo : Date;

  cols: any[];
  dataTable : Stock[];

  clonedStock: { [s: string]: Stock; } = {};

  constructor(private app : AppService,
    private stockService : StockService ,
    private firestore : AngularFirestore ,
    private misc: MiscComponent) { }

  ngOnInit(): void {
    this.cleardate();
    this.getStocks();
  }

  cleardate(){
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);
    this.dateFrom = firstDay; 
    this.dateTo = lastDay; 
  }

  onSelectDate(e){
    this.getStocks();
  }

  getStocks(){
    this.dateFrom.setHours(0);
    this.dateFrom.setMinutes(0);
    this.dateFrom.setSeconds(0);
    this.dateTo.setHours(23);
    this.dateTo.setMinutes(59);
    this.dateTo.setSeconds(59);
  
    let orderDateFrom = firebase.firestore.Timestamp.fromDate(this.dateFrom);
    let orderDateTo = firebase.firestore.Timestamp.fromDate(this.dateTo);
    this.stockService.getStockMoveMent(this.app.getHead(),orderDateFrom,orderDateTo).snapshotChanges()
      .subscribe(response => {
        this.dataTable = [];
        let i = 0;
        for (let item of response) {
          let e = <Stock>item.payload.doc.data();
          e['KEY'] = item.payload.doc.id;
          e['IDX'] = i;
          e['DATE_FMT'] = this.app.transformTimestamp(e.DATE,"dd/MM/yyyy");
          this.dataTable.push(e);
          i++;
        }
        
      }, error => {
        console.log("ERROR",error);
      });
  }

  onRowEditInit(product: Stock) {
    console.log(product);
    
    this.clonedStock[product['IDX']] = {...product};  
  }

  onRowEditDelete(product: Stock) {
    this.stockService.deleteSTock(product['KEY']);
  }

  

  onRowEditSave(product: Stock) {

    const amount : number = Number(product.AMOUNT);

    product.AMOUNT = amount;
  if(product.STOCK_CATGORY == 'STOCK_IN'){
    product.AMOUNT_IN = amount;
    product.AMOUNT_OUT = 0;
  }else if(product.STOCK_CATGORY == 'STOCK_OUT'){
    product.AMOUNT_IN = 0;
    product.AMOUNT_OUT = amount;
  }
    if (product.AMOUNT > 0) {
      delete this.clonedStock[product['IDX']];
      let mst = Object.assign({}, product);
      delete mst['KEY'];
      delete mst['IDX'];
      delete mst['DATE_FMT'];
      this.stockService.updateSTock(product['KEY'],mst).catch(err => console.log(err));
      this.misc.newMessage('s', 'สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
    }  
    else {
        this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'จำนวนสินค้าต้องไม่เป็น 0');
    }
  }

  onRowEditCancel(product: Stock, index: number) {
      this.dataTable[index] = this.clonedStock[product['IDX']];
      //delete this.dataTable[product['IDX']];
  }
}
