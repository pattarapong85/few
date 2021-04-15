import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class OrderPay {
    ORDER_NO :  string;
    STATUS_TRANFER_NO :  string; //COD OR TRANSFER // CLASH
    STATUS_TRANFER_NAME :  string; 
    ATTACFILE_NAME :  string;
    ATTACFILE_URL :  string;
    REF :  string;
    PAY_DATE :  Timestamp;
    ACCOUNT_NO :  string;
    BANK_CODE :  string;
    BANK_NAME :  string;
    DELIVER_CODE :  string;
    DELIVER_NAME :  string;
    AMOUNT :  number;
    FEE :  number;
    COD_SERVICE :  number;
    REMARK :  string;
    ACTIVE_FLAG :  string;
    CREATE_DATE :  Timestamp;
    CREATE_BY :  string;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  string;
    HEAD_CD :  string;
    PROJECT :  string;
}
