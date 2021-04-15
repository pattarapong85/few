import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class Employee {
    EMP_NO :  string;
    FIRSTNAME :  string;
    LASTNAME :  string;
    EMP_ADDRESS :  string;
    EMP_DISTRICT :  string; 
    EMP_AMPHURE :  string;
    EMP_PROVINCE :  string;
    EMP_ZIPCODE :  string; 
    EMP_FULL_ADDRESS :  string;
    EMP_TEL :  string;
    EMP_TEL2 :  string;
    CREATE_DATE :  Timestamp;
    CREATE_BY :  string;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  string;
    ACTIVE_FLAG :  string;
    HEAD_CD :  string;
    PROJECT : string;
}
