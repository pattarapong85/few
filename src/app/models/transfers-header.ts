import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
export class TransfersHeader {
    WAREHOUSE_FIRST :  String;
    WAREHOUSE_SECOUND :  String;
    REMARK :  String;
    TRANSFERS_DATE :  String;
    TRANSFERS_REF :  String;
    TRANSFERS_ATTACH_FILE :  String;
    CREATE_DATE :  Timestamp;
    CREATE_BY :  String;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  String;
    HEAD_CD : String;
    PROJECT : String;
}
