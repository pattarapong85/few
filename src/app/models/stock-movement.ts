import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
export class StockMovement {
    CHANNEL  :  String;
    ORDER_NO  :  String;
    PRODUCT_NAME  :  String;
    PRODUCT_TYPE : String;
    BOOK_OR_SALE :  String;
    STATUS :  String;
    WAREHOUSE_NAME :  String;
    CREATE_DATE :  Timestamp;
    CREATE_BY :  String;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  String;
    HEAD_CD : String;
    PROJECT : String;
}
