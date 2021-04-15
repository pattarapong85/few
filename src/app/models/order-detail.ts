import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class OrderDetail {

    ORDER_NO :  string;
    DATE : Timestamp;

    PRODUCT_IMG :  string;
    PRODUCT_SKU :  string;
    PRODUCT_NAME :  string;
    PRODUCT_CATEGORY :  string;

    AMOUNT : number;
    
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
    UNIT :  string;
    UNIT_NAME :  string;

    EMP_NO :  string;
    EMP_FULLNAME :  string;
}
