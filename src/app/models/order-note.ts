import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class OrderNote {
    ORDER_NO :  string;
    MESSAGE :  string;
    ATTACFILE_NAME :  string;
    ATTACFILE_URL :  string;
    CREATE_DATE :  Timestamp; 
    CREATE_BY :  string;
    UPDATE_DATE :  Timestamp; 
    UPDATE_BY :  string;
    HEAD_CD :  string;
    PROJECT :  string;
}
