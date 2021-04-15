import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class OrderHistory {
    ORDER_NO :  string;  
    DETAIL :  string; 
    DATA :  any;   
    CREATE_DATE :  Timestamp; 
    CREATE_BY :  string;  
    HEAD_CD :  string;  
    PROJECT :  string;  
}
