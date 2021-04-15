import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class Dropdown {
    CATEGORY : string;
    SUB_CATEGORY : string;
    CD : string;
    VALUE : string;
    ATT_01 : string;
    ATT_02 : string;
    ATT_03 : string;
    ATT_04 : string;
    ATT_05 : string;
    ATTACFILE_NAME : string;
    ATTACFILE_URL : string;
    DESC : string;
    REMARK : string;
    CREATE_DATE :  Timestamp; 
    CREATE_BY :  string; 
    UPDATE_DATE :  Timestamp; 
    UPDATE_BY :  string; 
    ACTIVE_FLAG :  string; 
    HEAD_CD  : string;
    PROJECT : string;
}
