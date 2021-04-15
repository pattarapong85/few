import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { generate } from 'rxjs';
import * as firebase from 'firebase';
import { StockService } from 'src/app/service/stock.service';
import { Stock } from 'src/app/models/stock';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { AppService } from 'src/app/service/app.service';
import * as Rx from 'rxjs/Rx'
import * as _ from 'lodash';

@Component({
  selector: 'app-fn50003',
  templateUrl: './fn50003.component.html',
  styleUrls: ['./fn50003.component.scss']
})
export class Fn50003Component implements OnInit {

  cols: any[];
  dataTable : any[];

  constructor(private app : AppService,
    private stockService : StockService ,
    private firestore : AngularFirestore ,
    private misc: MiscComponent) { 

    
    }

  ngOnInit(): void {
    this.getStocksAll();

    this.cols = [
      { field: 'SKU', header: 'รหัสสินค้า' },
      { field: 'NAME', header: 'ชื่อสินค้า' },
      { field: 'CATEGORY', header: 'หมวดหมู่' },
      { field: 'STORE_IN', header: 'เข้า' },
      { field: 'STORE_OUT', header: 'ออก' },
      { field: 'REMAIN', header: 'คงเหลือ' },
      
    ];
  }

  getStocksAll(){
    this.stockService.getStockAll(this.app.getHead()).snapshotChanges()
      .subscribe(response => {
        //this.dataTable = [];
        let stores = [];
        let i = 0;
        for (let item of response) {
          let e = <Stock>item.payload.doc.data();
          e['CODE'] = e.HEAD_CD+e.PRODUCT_SKU;
          //this.dataTable.push(e);
          stores.push(e);
          i++;
        }
        
        let summed = _(stores)
        .groupBy('CODE')
        .map((objs, key) => {
          let stock_in = _.sumBy(objs, 'AMOUNT_IN');
          let stock_out = _.sumBy(objs, 'AMOUNT_OUT');
          let remain = stock_in - stock_out;
          return {
          'SKU': key,
          'NAME': objs[0]['PRODUCT_NAME'],
          'CATEGORY' : objs[0]['PRODUCT_CATEGORY'],
          'STORE_IN': stock_in,
          'STORE_OUT': stock_out,
          'REMAIN': remain
        }
        }).value();
      
        this.dataTable = summed; 
      }, error => {
        console.log("ERROR",error);
      });
  }

}

/*
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

// example usage

const pets = [
    {type:"Dog", name:"Spot"},
    {type:"Cat", name:"Tiger"},
    {type:"Dog", name:"Rover"}, 
    {type:"Cat", name:"Leo"}
];
    
const grouped = groupBy(pets, pet => pet.type);
    
console.log(grouped.get("Dog")); // -> [{type:"Dog", name:"Spot"}, {type:"Dog", name:"Rover"}]
console.log(grouped.get("Cat")); 

*/
