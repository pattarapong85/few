import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class EffactHead {
    HEAD_CD :  String;
    START_DATE :Timestamp;
    END_DATE : Timestamp;
    CREATE_DATE :  Timestamp;
    CREATE_BY :  String;
    UPDATE_DATE :  Timestamp;
    UPDATE_BY :  String;
}

