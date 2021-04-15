import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;


export class Head {
    HEAD_CD :  string;
    HEAD_NAME :  string;
    HEAD_TAX_NO :  string;

    HEAD_PR_FIRSTNAME_LASTNAME :  string;
    HEAD_PR_EMAIL :  string;
    HEAD_PR_TEL_1 :  string;
    HEAD_PR_TEL_2 :  string;
    HEAD_PR_MOBILE_1 :  string;
    HEAD_PR_MOBILE_2 :  string;


    HEAD_GN_TEL_1 :  string;
    HEAD_GN_TEL_2 :  string;
    HEAD_GN_MOBLIE_1 :  string;
    HEAD_GN_MOBILE_2 :  string;
    HEAD_GN_EMAIL :  string;
    HEAD_GN_FACEBOOK :  string;
    HEAD_GN_LINE :  string;
    HEAD_GN_WEBSITE :  string;

    ADDRESSS_LIST : any[] = [];








    ACTIVE_FLAG :  string;
    UPDATE_DATE :  Timestamp; 
    UPDATE_BY :  string; 
    CREATE_DATE :  Timestamp; 
    CREATE_BY :  string;
    PROJECT :  string;
}
