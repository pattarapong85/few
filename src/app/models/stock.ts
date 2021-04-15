import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
export class Stock {

    WAREHOUSE_NAME :  string;
    REF : string;
    ORDER_NO :  string;
    DATE : Timestamp;

    STOCK_CATGORY :  string;
    STOCK_CD :  string;
    STOCK_CATGORY_LABEL :  string;
    STOCK_CD_LABEL :  string;
    
    
    PRODUCT_SKU :  string;
    PRODUCT_NAME :  string;
    PRODUCT_CATEGORY :  string;

    AMOUNT : number;
    AMOUNT_IN : number;
    AMOUNT_OUT : number;

    REMARK :  string;
    
    CREATE_DATE :  Timestamp;
    CREATE_BY :  string;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  string;
    HEAD_CD : string;
    PROJECT : string;



    PRICE :  number;
    DCPERCENT :  number;  
    DCAMOUNT :  number;   
    COMMISSION :  number;  
    TOTAL_PRICE :  number;  
    TOTAL_COMM :  number;  
    UNIT :  String;
    UNIT_NAME :  String;
    
    /*
    ORDER_NO : string;
    PROD_SKU :  String;  
    NAME :  String;  
    CATEGORY : String;
    PRICE :  number;
    DCPERCENT :  number;  
    DCAMOUNT :  number;   
    COMMISSION :  number;  
    QTY :  number;  
    TOTAL_PRICE :  number;  
    TOTAL_COMM :  number;  
    UNIT :  String;
    ACTIVE_FLAG :  String;
    */
}
