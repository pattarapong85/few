import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class OrderTransport {
    ORDER_NO :  string;
    TRANSPORT_NO  :  string;
    TRANSPORT_NAME  :  string;

    PACKDATE_DATE :  Timestamp;
    TRANSPORT_DATE :  Timestamp;
    RECIEVE_DATE :  Timestamp;
    CUS_ADDRESS_FULL  :  string;

    MY_ADDRESS_DROPDOWN  :  string;
    MY_ADDRESS  :  string;
    CUS_NAME :  string;
    TEL1 : string;
    TEL2 : string;
    
    TRACKING_NO : string;
    
    CREATE_DATE :  Timestamp;
    CREATE_BY  :  string;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY  :  string;
    HEAD_CD  :  string;
    PROJECT :  string;
}
