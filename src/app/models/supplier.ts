import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
export class Supplier {
    SUPPLIER_NAME :  String;
    SUPPLIER_BRANCH :  String;
    SUPPLIER_TAX_NO :  String;
    EMAIL :  String;
    TEL :  String;
    LINE :  String;
    FACEBOOK :  String;
    URL :  String;
    ADDRESS_NO :  String;
    FULL_ADDRESS :  String;
    DESC :  String;
    REMARK :  String;
    CREATE_DATE :  Timestamp;
    CREATE_BY :  String;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  String;
    ACTIVE_FLAG :  String;
    HEAD_CD : String;
    PROJECT : String;
}
