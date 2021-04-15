import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class Wherehouse {
    WAREHOUSE_NAME : String;
    ADDRESS_NO : String;
    FULL_ADDRESS : String;
    TEL : String;
    DESC : String;
    REMARK : String;
    CREATE_DATE :  Timestamp;
    CREATE_BY :  String;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  String;
    ACTIVE_FLAG :  String;
    HEAD_CD : String;
    PROJECT : String;
}
