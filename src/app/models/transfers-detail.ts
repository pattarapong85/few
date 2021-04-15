import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
export class TransfersDetail {
    PRODUCT_SKU :  String;
    PRODUCT_NAME :  String;
    QTY : Number;
    CREATE_DATE :  Timestamp;
    CREATE_BY :  String;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  String;
    HEAD_CD : String;
    PROJECT : String;
}
