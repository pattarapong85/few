import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class Customer {
    CUS_NAME :  String;
    CUS_NAME_SOCIAL :  String;
    CUS_ADDRESS :  String;
    CUS_DISTRICT :  String; 
    CUS_AMPHURE :  String;
    CUS_PROVINCE :  String;
    CUS_ZIPCODE :  String; 
    CUS_FULL_ADDRESS :  String;
    TEL :  String;
    TEL2 :  String;
    EMAIL :  String;
    CREATE_DATE:  Timestamp;
    CREATE_BY :  String;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  String;
    ACTIVE_FLAG :  String;
    HEAD_CD :  String;
    PROJECT :  String;
}
