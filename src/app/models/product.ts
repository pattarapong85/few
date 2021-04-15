import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class Product {
    TYPE :  string;
    PRODUCT_SKU :  string;
    NAME :  string;
    CATEGORY :  string;
    CATEGORY_NAME :  string;
    BRAND :  string;
    DESC :  string;
    REMARK :  string;

    WEIGHT : number;
    LONG : number;
    WIDE : number;
    HEIGHT : number;
    DESC_ABBR :  string;
    UNIT :  string;

    COST : number;
    PRICE : number;
    PRODUCT_LOWEST : number;
    COMMISSION : number;
    PROMOTION_CODE : string;

    UPDATE_DATE :  Timestamp; 
    UPDATE_BY :  string; 
    CREATE_DATE :  Timestamp; 
    CREATE_BY :  string;

    ACTIVE_FLAG :  string;
    HEAD_CD :  string;
    PROJECT :  string;

    images : any [];
}
